from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from .serializers import NotificationSerializer

def notify(user, kind, title, body, payload=None):
    item = Notification.objects.create(user=user, kind=kind, title=title, body=body, payload=payload or {})
    async_to_sync(get_channel_layer().group_send)(f"notifications_{user.id}", {"type": "notification", "data": NotificationSerializer(item).data})
    return item
