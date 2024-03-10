
from django.contrib import admin
from django.urls import path, include#, url
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sparta/', include('sparta.urls')),
    path('', include('app.urls')),
    
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path(r'__debug__/', include('debug_toolbar.urls')),
    ]