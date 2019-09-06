# Generated by Django 2.2.5 on 2019-09-05 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('db', models.CharField(max_length=15)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('host', models.CharField(default='127.0.0.1', max_length=50)),
                ('port', models.IntegerField()),
                ('username', models.CharField(max_length=200)),
                ('password', models.CharField(max_length=200)),
                ('schedule', models.CharField(max_length=10)),
                ('day', models.CharField(max_length=10)),
                ('time', models.CharField(max_length=5)),
                ('keep', models.IntegerField(default=5)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'schedules',
            },
        ),
    ]