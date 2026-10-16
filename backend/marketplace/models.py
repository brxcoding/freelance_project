from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        CLIENT = "client", "Client"
        FREELANCER = "freelancer", "Freelancer"
        ADMIN = "admin", "Admin"
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=160)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    avatar = models.URLField(blank=True, null=True)  # Cloudinary URL
    bio = models.TextField(blank=True)
    stripe_account_id = models.CharField(max_length=255, blank=True)
    payment_method_label = models.CharField(max_length=80, blank=True)
    is_online = models.BooleanField(default=False)

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    def __str__(self): return self.name

class Service(models.Model):
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="services")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="services")
    title = models.CharField(max_length=180)
    description = models.TextField()
    image = models.URLField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_days = models.PositiveIntegerField(default=7)
    features = models.JSONField(default=list, blank=True)
    active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        IN_PROGRESS = "in_progress", "In progress"
        DELIVERED = "delivered", "Delivered"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        DISPUTED = "disputed", "Disputed"
    client = models.ForeignKey(User, on_delete=models.PROTECT, related_name="client_orders")
    freelancer = models.ForeignKey(User, on_delete=models.PROTECT, related_name="freelancer_orders")
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="orders")
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    stripe_session_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="review")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_written")
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_received")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Dispute(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        REVIEWING = "reviewing", "Reviewing"
        RESOLVED = "resolved", "Resolved"
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="dispute")
    opened_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="disputes")
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    resolution = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    body = models.TextField(blank=True)
    attachment = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True)

class Notification(models.Model):
    class Kind(models.TextChoices):
        ORDER = "order", "Order"
        REVIEW = "review", "Review"
        DISPUTE = "dispute", "Dispute"
        MESSAGE = "message", "Message"
        CHAT = "new_chat", "New chat"
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    kind = models.CharField(max_length=20, choices=Kind.choices)
    title = models.CharField(max_length=140)
    body = models.CharField(max_length=255)
    payload = models.JSONField(default=dict, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PlatformSetting(models.Model):
    commission_fee = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    maintenance_mode = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
