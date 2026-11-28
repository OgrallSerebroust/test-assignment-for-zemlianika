from apps.core.models import Appeal
from rest_framework import serializers


class AppealResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appeal
        fields = (
            "id",
            "full_name",
            "appeal",
            "status",
            "failure_reason",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class AppealStatusErrorSerializer(serializers.Serializer):
    status = serializers.ListField(child=serializers.CharField())


class AppealCreateErrorSerializer(serializers.Serializer):
    full_name = serializers.ListField(child=serializers.CharField(), required=False)
    appeal = serializers.ListField(child=serializers.CharField(), required=False)
    non_field_errors = serializers.ListField(child=serializers.CharField(), required=False)
