from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication

@database_sync_to_async
def get_user(token):
    try:
        authentication = JWTAuthentication()
        validated = authentication.get_validated_token(token)
        return authentication.get_user(validated)
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, app): self.app = app
    async def __call__(self, scope, receive, send):
        token = parse_qs(scope["query_string"].decode()).get("token", [None])[0]
        scope["user"] = await get_user(token) if token else AnonymousUser()
        return await self.app(scope, receive, send)
