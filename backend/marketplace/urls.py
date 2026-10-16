from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AdminDashboardView, AdminUserView, CategoryViewSet, ChangePasswordView, ConversationViewSet, DashboardView, DisputeViewSet, MeView, NotificationViewSet, OrderViewSet, PlatformSettingView, RegisterView, ReviewViewSet, ServiceViewSet, stripe_webhook

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("services", ServiceViewSet, basename="service")
router.register("orders", OrderViewSet, basename="order")
router.register("reviews", ReviewViewSet)
router.register("disputes", DisputeViewSet, basename="dispute")
router.register("conversations", ConversationViewSet, basename="conversation")
router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", RegisterView.as_view()),
    path("auth/token/", TokenObtainPairView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", MeView.as_view()),
    path("auth/change-password/", ChangePasswordView.as_view()),
    path("dashboard/<str:role>/", DashboardView.as_view()),
    path("admin/dashboard/", AdminDashboardView.as_view()),
    path("admin/users/<int:pk>/", AdminUserView.as_view()),
    path("admin/settings/", PlatformSettingView.as_view()),
    path("stripe/webhook/", stripe_webhook),
]
