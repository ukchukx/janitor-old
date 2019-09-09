FROM python:3.8.0b4-alpine3.10

WORKDIR /janitor

RUN apk update && \
  apk add postgresql-client postgresql-libs mysql-client && \
  apk add --virtual .build-deps gcc musl-dev postgresql-dev && \
  apk --purge del .build-deps

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir && \
  pip3 install --upgrade https://github.com/ukchukx/timeloop/zipball/master && \
  mkdir logs backups

COPY . .

RUN python3 manage.py collectstatic --noinput

CMD ["./start.sh"]
