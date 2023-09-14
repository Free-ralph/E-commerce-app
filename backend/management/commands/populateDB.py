from django.core.management.base import BaseCommand, CommandError
from backend.models import Product, Category
import requests


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        url = 'https://fakestoreapi.com/products'
        response = requests.get(url)

        
        if response.status_code == 200:
            data = response.json()
            for count, product in enumerate(data):
                price = product['price'] * 600
                
                product_ins = Product.objects.create(
                    title = product['title'],
                    description = product['description'],
                    image  = product['image'],
                    rating = product['rating']['rate'],
                    popularity = product['rating']['count'],
                    price = price
                )
                category, created = Category.objects.get_or_create(name = product['category'])
                product_ins.category.add(category)
                product_ins.save()

                if count == 150:
                    break
            self.stdout.write(self.style.SUCCESS('database succesfully populated'))
        else:
            raise CommandError('data fetch failed')