from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += [
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        route="api/",
        view=include("apps.core.urls"),
    ),
]
