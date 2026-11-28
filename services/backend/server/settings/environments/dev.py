from django.core.exceptions import ImproperlyConfigured

from .base import *

_env = EnvSettings(_env_file=BASE_DIR / ".env")

DEBUG = True
SECRET_KEY = _env.secret_key.get_secret_value()
if not SECRET_KEY.strip():
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set in the development environment.")
ALLOWED_HOSTS = _env.allowed_hosts
DATABASES = build_databases(_env)
CELERY_BROKER_URL = _env.celery_broker_url
