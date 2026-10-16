from rest_framework.permissions import BasePermission

class IsFreelancerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in ("GET", "HEAD", "OPTIONS") or (request.user.is_authenticated and request.user.role == "freelancer")
    def has_object_permission(self, request, view, obj):
        return request.method in ("GET", "HEAD", "OPTIONS") or obj.freelancer_id == request.user.id

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.role == "admin")
