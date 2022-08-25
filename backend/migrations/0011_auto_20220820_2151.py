# Generated by Django 3.2.15 on 2022-08-20 20:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_favourites'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='favourites',
            name='product',
        ),
        migrations.AddField(
            model_name='favourites',
            name='product',
            field=models.ManyToManyField(to='backend.Product'),
        ),
    ]
