from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.utils import timezone
from .models import Conversation, Message, User
from .notifications import notify
from .serializers import MessageSerializer

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.group = f"chat_{self.conversation_id}"
        if self.scope["user"].is_anonymous or not await self.can_join():
            return await self.close()
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.set_online(True)
        await self.accept()
    async def disconnect(self, close_code):
        if hasattr(self, "group"):
            await self.channel_layer.group_discard(self.group, self.channel_name)
            if not self.scope["user"].is_anonymous: await self.set_online(False)
    async def receive_json(self, content):
        kind = content.get("type")
        if kind == "typing":
            await self.channel_layer.group_send(self.group, {"type": "chat.event", "data": {"type": "typing", "user_id": self.scope["user"].id, "is_typing": content.get("is_typing", False)}})
        elif kind == "clear":
            await self.clear_messages()
            await self.channel_layer.group_send(self.group, {"type": "chat.event", "data": {"type": "cleared"}})
        elif kind == "message":
            message = await self.create_message(content.get("body", ""), content.get("attachment", ""))
            await self.channel_layer.group_send(self.group, {"type": "chat.event", "data": {"type": "message", "message": message}})
    async def chat_event(self, event): await self.send_json(event["data"])
    @database_sync_to_async
    def can_join(self): return Conversation.objects.filter(pk=self.conversation_id, participants=self.scope["user"]).exists()
    @database_sync_to_async
    def set_online(self, online): User.objects.filter(pk=self.scope["user"].id).update(is_online=online)
    @database_sync_to_async
    def clear_messages(self): Message.objects.filter(conversation_id=self.conversation_id).delete()
    @database_sync_to_async
    def create_message(self, body, attachment):
        conversation = Conversation.objects.get(pk=self.conversation_id)
        message = Message.objects.create(conversation=conversation, sender=self.scope["user"], body=body, attachment=attachment)
        conversation.updated_at = timezone.now()
        conversation.save(update_fields=["updated_at"])
        for participant in conversation.participants.exclude(pk=self.scope["user"].id):
            notify(participant, "message", "New message", f"{self.scope['user'].full_name} sent you a message.", {"conversation_id": conversation.id})
        return MessageSerializer(message).data

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous: return await self.close()
        self.group = f"notifications_{self.scope['user'].id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()
    async def disconnect(self, close_code):
        if hasattr(self, "group"): await self.channel_layer.group_discard(self.group, self.channel_name)
    async def notification(self, event): await self.send_json(event["data"])
