
from django.conf import settings
import requests

class PayStack:
    """
        This class contains the neccessary variables and methods to make api calls 
        to paystack
    """
    PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
    base_url = 'https://api.paystack.co'

    def verify_payment(self, ref, *args, **kwargs):
        """
            This method verifies the attempted payment and returns both the status and result sata
        """
        path = f'/transaction/verify/{ref}'

        headers = { 
            'Authorization' : f"Bearer {self.PAYSTACK_SECRET_KEY}",
            'Content-Type' : 'application/json',
        }
        url = self.base_url + path
        response = requests.get(url, headers = headers)

        if response.status_code ==  200:
            response_data = response.json()
            return response_data['status'], response_data['data']
        response_data = response.json()
        return response_data['status'], response_data['message']
    