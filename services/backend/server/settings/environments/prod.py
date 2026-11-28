from .base import *

_env = EnvSettings()

DEBUG = False
SECRET_KEY = _env.secret_key.get_secret_value()
ALLOWED_HOSTS = _env.allowed_hosts
DATABASES = build_databases(_env)
CELERY_BROKER_URL = _env.celery_broker_url
