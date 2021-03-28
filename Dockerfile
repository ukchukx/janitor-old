FROM python:3.8.0b4-alpine3.10
ENV PYTHONUNBUFFERED=1

WORKDIR /janitor

# RUN apk update && \
#   apk add postgresql-client postgresql-libs postgresql-dev mysql-client && \
#   apk add --virtual .build-deps gcc musl-dev && \
#   apk --purge del .build-deps

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir && mkdir backups

COPY . .
EXPOSE 8000

RUN python3 manage.py collectstatic --noinput

CMD ["./start.sh"]
