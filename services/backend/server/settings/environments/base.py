from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]


class EnvSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="DJANGO_",
    )
    allowed_hosts: list[str] = Field(
        min_length=1,
    )
    postgres_db: str = Field(
        min_length=1,
        validation_alias="POSTGRES_DB",
    )
    postgres_user: str = Field(
        min_length=1,
        validation_alias="POSTGRES_USER",
    )
    postgres_password: SecretStr = Field(
        min_length=1,
        validation_alias="POSTGRES_PASSWORD",
    )
    postgres_host: str = Field(
        default="db",
        validation_alias="POSTGRES_HOST",
    )
    postgres_port: int = Field(
        default=5432,
        ge=1,
        le=65535,
        validation_alias="POSTGRES_PORT",
    )
    secret_key: SecretStr


def build_databases(env: EnvSettings) -> dict[str, dict[str, str | int]]:
    return {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env.postgres_db,
            "USER": env.postgres_user,
            "PASSWORD": env.postgres_password.get_secret_value(),
            "HOST": env.postgres_host,
            "PORT": env.postgres_port,
        }
    }


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "drf_spectacular",
    "apps.core",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "server.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
WSGI_APPLICATION = "server.wsgi.application"
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
LANGUAGE_CODE = "Ru-ru"
TIME_ZONE = "Europe/Moscow"
USE_I18N = True
USE_TZ = True
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
SPECTACULAR_SETTINGS = {
    "TITLE": "Zemlianika API",
    "VERSION": "1.0.0",
}

STATIC_URL = "static/"
MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.console.EmailBackend",
    },
}
