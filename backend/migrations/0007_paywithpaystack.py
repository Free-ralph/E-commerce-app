# Generated by Django 3.2.15 on 2022-08-18 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_auto_20220818_2046'),
    ]

    operations = [
        migrations.CreateModel(
            name='PayWithPaystack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('ref', models.CharField(max_length=100, unique=True)),
                ('email', models.EmailField(max_length=254)),
                ('amount', models.IntegerField()),
                ('verified', models.BooleanField(default=False)),
                ('date_payed', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
