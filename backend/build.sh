#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

# Create staticfiles folder if missing (fixes Whitenoise warning)
mkdir -p staticfiles

python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate
python manage.py create_superuser