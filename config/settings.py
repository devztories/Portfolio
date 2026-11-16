import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
env = os.environ.get
DEBUG = env("DJANGO_DEBUG", "1") == "1"
SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-only-insecure-key" if DEBUG else "")
if not SECRET_KEY:
    raise RuntimeError("Set DJANGO_SECRET_KEY in production.")
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
INSTALLED_APPS = ["django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
                  "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles", "portfolio"]
MIDDLEWARE = ["django.middleware.security.SecurityMiddleware", "django.contrib.sessions.middleware.SessionMiddleware",
              "django.middleware.common.CommonMiddleware", "django.middleware.csrf.CsrfViewMiddleware",
              "django.contrib.auth.middleware.AuthenticationMiddleware", "django.contrib.messages.middleware.MessageMiddleware",
              "django.middleware.clickjacking.XFrameOptionsMiddleware"]
ROOT_URLCONF = "config.urls"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [BASE_DIR / "templates"], "APP_DIRS": True,
              "OPTIONS": {"context_processors": ["django.template.context_processors.request",
                          "django.contrib.auth.context_processors.auth", "django.contrib.messages.context_processors.messages"]}}]
WSGI_APPLICATION = "config.wsgi.application"
if env("DB_NAME"):
    DATABASES = {"default": {"ENGINE": "django.db.backends.postgresql", "NAME": env("DB_NAME"), "USER": env("DB_USER", ""),
                 "PASSWORD": env("DB_PASSWORD", ""), "HOST": env("DB_HOST", "localhost"), "PORT": env("DB_PORT", "5432")}}
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}
LANGUAGE_CODE, TIME_ZONE, USE_TZ = "en-us", "Asia/Kolkata", True
STATIC_URL, STATIC_ROOT, STATICFILES_DIRS = "/static/", BASE_DIR / "staticfiles", [BASE_DIR / "static"]
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
EMAIL_BACKEND = env("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST, EMAIL_PORT = env("EMAIL_HOST", ""), int(env("EMAIL_PORT", "587"))
EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_USE_TLS = env("EMAIL_HOST_USER", ""), env("EMAIL_HOST_PASSWORD", ""), True
CONTACT_TO_EMAIL = env("CONTACT_TO_EMAIL", "")
if not DEBUG:
    SECURE_SSL_REDIRECT = SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
SECURE_CONTENT_TYPE_NOSNIFF = True

LOGIN_URL = "/manage/login/"
LOGIN_REDIRECT_URL = "/manage/"
LOGOUT_REDIRECT_URL = "/manage/login/"
