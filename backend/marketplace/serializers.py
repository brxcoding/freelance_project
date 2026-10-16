from django.contrib.auth import get_user_model
from django.db.models import Avg
from rest_framework import serializers
from .models import Category, Conversation, Dispute, Message, Notification, Order, PlatformSetting, Review, Service

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "role", "avatar", "bio", "stripe_account_id", "payment_method_label", "is_online", "is_active", "date_joined"]
        read_only_fields = ["id", "is_online", "date_joined"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ["username", "email", "password", "full_name", "role", "avatar"]
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ServiceSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source="category", queryset=Category.objects.all(), write_only=True, required=False)
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = ["id", "freelancer", "category", "category_id", "title", "description", "image", "price", "delivery_days", "features", "active", "featured", "created_at", "rating", "review_count"]
        read_only_fields = ["id", "freelancer", "created_at"]
    def get_rating(self, obj):
        return obj.freelancer.reviews_received.aggregate(value=Avg("rating"))["value"]
    def get_review_count(self, obj):
        return obj.freelancer.reviews_received.count()

class OrderSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source="service.title", read_only=True)
    client_name = serializers.CharField(source="client.full_name", read_only=True)
    freelancer_name = serializers.CharField(source="freelancer.full_name", read_only=True)
    class Meta:
        model = Order
        fields = ["id", "client", "client_name", "freelancer", "freelancer_name", "service", "service_title", "quantity", "total", "status", "stripe_session_id", "created_at", "updated_at"]
        read_only_fields = ["id", "client", "freelancer", "total", "stripe_session_id", "created_at", "updated_at"]

class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)
    class Meta:
        model = Review
        fields = ["id", "order", "author", "author_name", "freelancer", "rating", "comment", "created_at"]
        read_only_fields = ["author", "freelancer", "created_at"]

class DisputeSerializer(serializers.ModelSerializer):
    opened_by_name = serializers.CharField(source="opened_by.full_name", read_only=True)
    class Meta:
        model = Dispute
        fields = ["id", "order", "opened_by", "opened_by_name", "reason", "status", "resolution", "created_at"]
        read_only_fields = ["opened_by", "created_at"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "body", "attachment", "created_at", "read_at"]

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(source="participant", queryset=User.objects.all(), write_only=True, required=False)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    class Meta:
        model = Conversation
        fields = ["id", "participants", "participant_id", "last_message", "unread_count", "created_at", "updated_at"]
    def get_last_message(self, obj):
        message = obj.messages.order_by("-created_at").first()
        return MessageSerializer(message).data if message else None
    def get_unread_count(self, obj):
        request = self.context.get("request")
        return obj.messages.filter(read_at__isnull=True).exclude(sender=request.user).count() if request else 0

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["user"]

class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = ["commission_fee", "maintenance_mode", "updated_at"]
