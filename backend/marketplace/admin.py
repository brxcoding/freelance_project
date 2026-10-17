from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Category, Conversation, Dispute, Message, Notification, Order, PlatformSetting, Review, Service, User

class CustomUserAdmin(UserAdmin):
    model = User

    # Fields shown in the list view
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_active",
        "is_staff",
        "date_joined",
    )
    list_filter = ("role", "is_active", "is_staff", "is_superuser")

    # Fields shown in the user detail/edit page
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (_("Personal info"), {"fields": ("full_name", "avatar", "bio")}),
        (_("Roles & Permissions"), {
            "fields": (
                "role",
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    # Fields shown when creating a new user
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "role",
                "password",
                "is_active",
                "is_staff",
                "is_superuser",
            ),
        }),
    )

    search_fields = ("username", "email", "full_name")
    ordering = ("id",)

# Register your custom User admin
admin.site.register(User, CustomUserAdmin)

# Register other models normally
for model in [Category, Service, Order, Review, Dispute, Conversation, Message, Notification, PlatformSetting]:
    admin.site.register(model)

