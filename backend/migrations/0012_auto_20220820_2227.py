# Generated by Django 3.2.15 on 2022-08-20 21:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_auto_20220820_2151'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='favourites',
            options={'verbose_name_plural': 'Favourites'},
        ),
        migrations.RemoveField(
            model_name='product',
            name='wishList',
        ),
    ]
