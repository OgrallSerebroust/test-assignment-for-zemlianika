from .base import *

_env = EnvSettings(_env_file=BASE_DIR / ".env")

DEBUG = True
SECRET_KEY = _env.secret_key.get_secret_value()
ALLOWED_HOSTS = _env.allowed_hosts
DATABASES = build_databases(_env)
CELERY_BROKER_URL = _env.celery_broker_url
