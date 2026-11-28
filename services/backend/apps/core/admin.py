from django.contrib import admin

from .models import Appeal


@admin.register(Appeal)
class AppealAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "appeal",
        "status",
        "failure_reason",
        "created_at",
        "updated_at",
    )
