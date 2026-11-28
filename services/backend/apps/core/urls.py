from django.urls import URLPattern, URLResolver
from rest_framework.routers import SimpleRouter

from .views import AppealViewSet

router = SimpleRouter()
router.register(
    prefix="appeals",
    viewset=AppealViewSet,
    basename="appeals",
)
urlpatterns: list[URLPattern | URLResolver] = [*router.urls]
