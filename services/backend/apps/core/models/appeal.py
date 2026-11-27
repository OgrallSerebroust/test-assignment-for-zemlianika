from django.db import models


class Appeal(models.Model):
    class Status(models.TextChoices):
        QUEUED = "queued", "Новый"
        PROCESSING = "processing", "В работе"
        DONE = "done", "Выполнен"
        FAILED = "failed", "Ошибочен"

    full_name = models.CharField(
        verbose_name="ФИО",
        max_length=255,
    )
    appeal = models.TextField(
        verbose_name="Обращение",
    )
    status = models.CharField(
        choices=Status.choices,
        verbose_name="Статус",
        max_length=10,
        default=Status.QUEUED,
    )
    failure_reason = models.TextField(
        verbose_name="Причина ошибки",
        blank=True,
        default="",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Время создания",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Время обновления",
    )

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["status", "-created_at", "-id"], name="appeal_status_created_id_idx"),
            models.Index(fields=["-created_at", "-id"], name="appeal_created_id_idx"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["queued", "processing", "done", "failed"]),
                name="appeal_valid_status",
            ),
            models.CheckConstraint(
                condition=(models.Q(status="failed") & ~models.Q(failure_reason=""))
                | (~models.Q(status="failed") & models.Q(failure_reason="")),
                name="appeal_failure_reason_matches",
            ),
        ]
