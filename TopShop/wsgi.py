"""
WSGI config for TopShop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
from decouple import config
from django.core.wsgi import get_wsgi_application

DEBUG = config('DEBUG').lower() in ('true', 't', '1')

if DEBUG:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TopShop.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TopShop.settings.prod')

application = get_wsgi_application()

app = application