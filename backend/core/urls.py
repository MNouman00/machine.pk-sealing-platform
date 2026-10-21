import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.views.static import serve
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
    path("api/chat/", include("assistant.urls")),
    path("api/auth/login/", obtain_auth_token, name="api_token_auth"),
    path("api/auth/", include("djoser.urls")),
    
    # Force Django to serve media files (fixes Windows path bug)
    path('media/<path:path>', serve, {'document_root': os.path.join(settings.BASE_DIR, 'media')}),
]