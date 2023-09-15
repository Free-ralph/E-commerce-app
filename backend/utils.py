import requests
from .models import RandomUsers


def fetchArticles():
    url = 'https://randomuser.me/api/'

    count = 0
    while count < 200:
        response = requests.get(url)
        user = response.json()["results"][0]
        RandomUsers.objects.create(
            username=user["login"]["username"],
            password=user["login"]["password"],
            name=f'{user["name"]["first"]} {user["name"]["last"]}'
        )

        count += 1
    print("Successfull")
