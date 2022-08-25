from django.core.management.base import BaseCommand, CommandError
from backend.models import Product
import requests


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        url = 'https://fakestoreapi.com/products'
        response = requests.get(url)

        
        if response.status_code == 200:
            data = response.json()
            for product in data:
                price = product['price'] * 600
                Product.objects.create(
                    title = product['title'],
                    category = product['category'],
                    description = product['description'],
                    image  = product['image'],
                    rating = product['rating']['rate'],
                    popularity = product['rating']['count'],
                    price = price
                )

            self.stdout.write(self.style.SUCCESS('database succesfully populated'))
        else:
            raise CommandError('data fetch failed')