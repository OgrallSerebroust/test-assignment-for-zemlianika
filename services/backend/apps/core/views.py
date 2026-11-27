from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .logic.selectors.appeal import appeal__all, appeal__by_status
from .models import Appeal
from .pagination.appeal import AppealPagination
from .serializers.request.appeal import AppealCreateSerializer
from .serializers.response.appeal import (
    AppealCreateErrorSerializer,
    AppealResponseSerializer,
    AppealStatusErrorSerializer,
)


class InvalidAppealStatus(ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY


@extend_schema_view(
    create=extend_schema(
        request=AppealCreateSerializer,
        responses={201: AppealResponseSerializer, 422: AppealCreateErrorSerializer},
    ),
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
class AppealViewSet(CreateModelMixin, ReadOnlyModelViewSet):
    queryset = appeal__all()
    serializer_class = AppealResponseSerializer
    pagination_class = AppealPagination

    def get_serializer_class(self):
        if self.action == "create":
            return AppealCreateSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        self.perform_create(serializer)
        response = AppealResponseSerializer(serializer.instance, context=self.get_serializer_context())
        return Response(response.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        if self.action != "list":
            return super().get_queryset()

        appeal_status = self.request.query_params.get("status")
        if appeal_status is None:
            return super().get_queryset()

        if appeal_status not in Appeal.Status.values:
            raise InvalidAppealStatus({"status": ["Недопустимый статус обращения."]})

        return appeal__by_status(appeal_status)
