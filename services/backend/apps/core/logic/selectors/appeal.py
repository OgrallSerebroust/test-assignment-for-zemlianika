from apps.core.models import Appeal
from django.db.models import QuerySet


def appeal__all() -> QuerySet[Appeal]:
    return Appeal.objects.all()


def appeal__by_status(status: str) -> QuerySet[Appeal]:
    return Appeal.objects.filter(status=status)
