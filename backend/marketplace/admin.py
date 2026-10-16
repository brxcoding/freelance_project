from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Category, Conversation, Dispute, Message, Notification, Order, PlatformSetting, Review, Service, User

admin.site.register(User, UserAdmin)
for model in [Category, Service, Order, Review, Dispute, Conversation, Message, Notification, PlatformSetting]:
    admin.site.register(model)
