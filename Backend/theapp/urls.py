from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'accessibility-locations', views.AccessibilityLocationViewSet)
router.register(r'accessibility-maps', views.AccessibilityMapViewSet)
router.register(r'job-postings', views.JobPostingViewSet)
router.register(r'healthcare-facilities', views.HealthcareFacilityViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]