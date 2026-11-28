import logging
import random
import time

from celery import shared_task
from django.db import OperationalError, transaction
from django.utils import timezone

from .models import Appeal

logger = logging.getLogger(__name__)
MAX_RETRIES = 3
TEMPORARY_ERRORS = (OSError, OperationalError)


def process_appeal_work():
    time.sleep(random.uniform(2, 5))


@shared_task(
    bind=True,
    acks_late=True,
    reject_on_worker_lost=True,
    autoretry_for=TEMPORARY_ERRORS,
    retry_backoff=True,
    max_retries=MAX_RETRIES,
)
def process_appeal(self, appeal_id: int):
    Appeal.objects.filter(pk=appeal_id, status=Appeal.Status.QUEUED).update(
        status=Appeal.Status.PROCESSING,
        updated_at=timezone.now(),
    )

    with transaction.atomic():
        appeal = Appeal.objects.select_for_update().filter(pk=appeal_id).first()
        if appeal is None or appeal.status != Appeal.Status.PROCESSING:
            return

        try:
            process_appeal_work()
        except Exception as exc:
            if isinstance(exc, TEMPORARY_ERRORS) and self.request.retries < MAX_RETRIES:
                raise

            logger.exception("Processing failed for appeal %s", appeal_id)
            appeal.status = Appeal.Status.FAILED
            appeal.failure_reason = str(exc).strip() or type(exc).__name__
        else:
            appeal.status = Appeal.Status.DONE

        appeal.save(update_fields=["status", "failure_reason", "updated_at"])
