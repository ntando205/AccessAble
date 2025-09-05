from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('theapp.urls')),  # Replace 'yourapp' with your app name
]