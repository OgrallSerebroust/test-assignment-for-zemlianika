from rest_framework import serializers

from apps.core.models import Appeal


class AppealCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appeal
        fields = ("full_name", "appeal")
