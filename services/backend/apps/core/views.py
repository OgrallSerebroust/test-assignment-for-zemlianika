from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ReadOnlyModelViewSet

from .logic.selectors.appeal import appeal__all, appeal__by_status
from .models import Appeal
from .pagination.appeal import AppealPagination
from .serializers.response.appeal import (
    AppealResponseSerializer,
    AppealStatusErrorSerializer,
)


class InvalidAppealStatus(ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="status",
                type=str,
                enum=Appeal.Status.values,
                description="Фильтр по статусу обращения.",
            ),
        ],
        responses={200: AppealResponseSerializer(many=True), 422: AppealStatusErrorSerializer},
    ),
)
class AppealViewSet(ReadOnlyModelViewSet):
    queryset = appeal__all()
    serializer_class = AppealResponseSerializer
    pagination_class = AppealPagination

    def get_queryset(self):
        if self.action != "list":
            return super().get_queryset()

        appeal_status = self.request.query_params.get("status")
        if appeal_status is None:
            return super().get_queryset()

        if appeal_status not in Appeal.Status.values:
            raise InvalidAppealStatus({"status": ["Недопустимый статус обращения."]})

        return appeal__by_status(appeal_status)
