import stripe
from django.conf import settings
from django.db.models import Avg, Q, Sum
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Conversation, Dispute, Notification, Order, PlatformSetting, Review, Service, User
from .notifications import notify
from .permissions import IsAdminRole, IsFreelancerOrReadOnly
from .serializers import CategorySerializer, ConversationSerializer, DisputeSerializer, MessageSerializer, NotificationSerializer, OrderSerializer, PlatformSettingSerializer, RegisterSerializer, ReviewSerializer, ServiceSerializer, UserSerializer
from django.http import JsonResponse
from upstash_redis import Redis
import os

redis = Redis(
    url=os.environ["UPSTASH_REDIS_REST_REDIS_URL"],
    token=os.environ["UPSTASH_REDIS_REST_KV_REST_API_TOKEN"],
)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(UserSerializer(serializer.save()).data, status=status.HTTP_201_CREATED)

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): return Response(UserSerializer(request.user).data)
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if not request.user.check_password(request.data.get("current_password", "")):
            return Response({"current_password": ["Incorrect password."]}, status=400)
        request.user.set_password(request.data["new_password"])
        request.user.save(update_fields=["password"])
        return Response(status=204)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    def get_permissions(self):
        return [AllowAny()] if self.request.method == "GET" else [IsAdminRole()]

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsFreelancerOrReadOnly]
    search_fields = ["title", "description", "freelancer__full_name", "category__name"]
    ordering_fields = ["price", "created_at"]
    def get_queryset(self):
        query = Service.objects.select_related("freelancer", "category").filter(active=True)
        values = self.request.query_params
        if values.get("category"): query = query.filter(category__slug=values["category"])
        if values.get("max_price"): query = query.filter(price__lte=values["max_price"])
        if values.get("delivery_days"): query = query.filter(delivery_days__lte=values["delivery_days"])
        if values.get("featured"): query = query.filter(featured=True)
        return query.order_by("-featured", "-created_at")
    def perform_create(self, serializer): serializer.save(freelancer=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Order.objects.select_related("service", "client", "freelancer").filter(Q(client=user) | Q(freelancer=user)).order_by("-created_at")
    def perform_create(self, serializer):
        service = serializer.validated_data["service"]
        quantity = serializer.validated_data.get("quantity", 1)
        order = serializer.save(client=self.request.user, freelancer=service.freelancer, total=service.price * quantity)
        notify(service.freelancer, Notification.Kind.ORDER, "New order", f"{self.request.user.full_name} ordered {service.title}", {"order_id": order.id})
    def perform_update(self, serializer):
        order = serializer.save()
        target = order.client if self.request.user == order.freelancer else order.freelancer
        notify(target, Notification.Kind.ORDER, "Order updated", f"Order #{order.id} is now {order.get_status_display()}.", {"order_id": order.id})
    @action(detail=True, methods=["post"])
    def checkout(self, request, pk=None):
        order = self.get_object()
        stripe.api_key = settings.STRIPE_SECRET_KEY
        session = stripe.checkout.Session.create(mode="payment", line_items=[{"price_data": {"currency": "usd", "product_data": {"name": order.service.title}, "unit_amount": int(order.total * 100)}, "quantity": 1}], success_url=f"{settings.FRONTEND_URL}/dashboard/client?payment=success", cancel_url=f"{settings.FRONTEND_URL}/services/{order.service_id}", metadata={"order_id": order.id})
        order.stripe_session_id = session.id
        order.save(update_fields=["stripe_session_id"])
        return Response({"url": session.url})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related("author", "freelancer")
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        order = serializer.validated_data["order"]
        review = serializer.save(author=self.request.user, freelancer=order.freelancer)
        notify(order.freelancer, Notification.Kind.REVIEW, "New review", f"Your project received a {review.rating}-star review.", {"review_id": review.id})

class DisputeViewSet(viewsets.ModelViewSet):
    serializer_class = DisputeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Dispute.objects.all() if self.request.user.role == "admin" else Dispute.objects.filter(Q(opened_by=self.request.user) | Q(order__freelancer=self.request.user))
    def perform_create(self, serializer):
        dispute = serializer.save(opened_by=self.request.user)
        dispute.order.status = Order.Status.DISPUTED
        dispute.order.save(update_fields=["status"])
        for admin in User.objects.filter(role="admin", is_active=True):
            notify(admin, Notification.Kind.DISPUTE, "New dispute", f"Dispute opened for order #{dispute.order_id}.", {"dispute_id": dispute.id})

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): return self.request.user.conversations.prefetch_related("participants", "messages").order_by("-updated_at")
    def create(self, request):
        participant = User.objects.get(pk=request.data["participant_id"])
        existing = self.get_queryset().filter(participants=participant).first()
        if existing: return Response(self.get_serializer(existing).data)
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, participant)
        notify(participant, Notification.Kind.CHAT, "New chat", f"{request.user.full_name} started a conversation.", {"conversation_id": conversation.id})
        return Response(self.get_serializer(conversation).data, status=201)
    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        conversation.messages.filter(read_at__isnull=True).exclude(sender=request.user).update(read_at=timezone.now())
        return Response(MessageSerializer(conversation.messages.select_related("sender"), many=True).data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): return self.request.user.notifications.order_by("-created_at")

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, role):
        if role not in ("client", "freelancer") or request.user.role != role: return Response({"detail": "Forbidden."}, status=403)
        orders = Order.objects.filter(client=request.user) if role == "client" else Order.objects.filter(freelancer=request.user)
        total = orders.filter(status__in=["paid", "in_progress", "delivered", "completed"]).aggregate(value=Sum("total"))["value"] or 0
        stats = {"total_amount": total, "active_orders": orders.filter(status__in=["paid", "in_progress", "delivered"]).count(), "completed_orders": orders.filter(status="completed").count()}
        if role == "freelancer": stats["average_rating"] = request.user.reviews_received.aggregate(value=Avg("rating"))["value"]
        chart = [{"name": item["status"].replace("_", " ").title(), "value": float(item["value"])} for item in orders.values("status").annotate(value=Sum("total"))]
        return Response({"stats": stats, "orders": OrderSerializer(orders.select_related("service", "client", "freelancer").order_by("-created_at"), many=True).data, "services": ServiceSerializer(request.user.services.all(), many=True).data if role == "freelancer" else [], "chart": chart})

class AdminDashboardView(APIView):
    permission_classes = [IsAdminRole]
    def get(self, request):
        setting, _ = PlatformSetting.objects.get_or_create(pk=1)
        orders = Order.objects.all()
        return Response({"stats": {"revenue": orders.filter(status="completed").aggregate(value=Sum("total"))["value"] or 0, "users": User.objects.filter(is_active=True).count(), "disputes": Dispute.objects.exclude(status="resolved").count(), "new_today": User.objects.filter(date_joined__date=timezone.now().date()).count()}, "users": UserSerializer(User.objects.order_by("-date_joined"), many=True).data, "disputes": DisputeSerializer(Dispute.objects.select_related("opened_by"), many=True).data, "settings": PlatformSettingSerializer(setting).data, "activity": []})

class AdminUserView(APIView):
    permission_classes = [IsAdminRole]
    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True); serializer.save()
        return Response(serializer.data)

class PlatformSettingView(APIView):
    permission_classes = [IsAdminRole]
    def patch(self, request):
        setting, _ = PlatformSetting.objects.get_or_create(pk=1)
        serializer = PlatformSettingSerializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True); serializer.save()
        return Response(serializer.data)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def stripe_webhook(request):
    try:
        event = stripe.Webhook.construct_event(request.body, request.headers.get("Stripe-Signature"), settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=400)
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order = Order.objects.get(pk=session["metadata"]["order_id"])
        order.status = Order.Status.PAID
        order.save(update_fields=["status"])
        notify(order.freelancer, Notification.Kind.ORDER, "Payment received", f"Order #{order.id} is paid and ready to start.", {"order_id": order.id})
    return Response(status=200)

def redis_status(request):
    redis.set("status", "Redis is running successfully!")
    data = redis.get("status")
    return JsonResponse({"message": data})


