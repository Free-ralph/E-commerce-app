from django.db import models
from django.contrib.auth.models import User
import secrets


STATUS = (
    ('RE' , 'Requested'),
    ('SH' , 'Shipped'),
    ('DE' , 'Delivered')
)

class Product(models.Model):
    title = models.CharField(max_length=200)
    category = models.ManyToManyField("Category")
    description = models.TextField()
    popularity = models.PositiveIntegerField()
    rating = models.PositiveIntegerField()
    image = models.URLField()
    price = models.FloatField()

    def __str__(self):
        return self.title
    
    def get_price(self):
        return self.price
    
class Favourites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ManyToManyField('Product')

    def __str__(self):
        return self.user.username
    
    class Meta:
        verbose_name_plural = 'Favourites'

class OrderProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete = models.CASCADE)
    quantity = models.IntegerField(default=1)
    is_ordered = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.quantity} of {self.product}'

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=40, null = True, blank=True)
    order_id = models.CharField(max_length = 5, unique=True)
    order_product = models.ManyToManyField('OrderProduct')
    timestamp = models.DateField(auto_now_add=True)
    coupon = models.ManyToManyField('Coupon', blank=True)
    delivery_fee = models.FloatField(null=True, blank = True)
    is_ordered = models.BooleanField(default=False)
    status = models.CharField(max_length=2, choices=STATUS)
    is_paid = models.BooleanField(default=False)
    shipping_address = models.OneToOneField("ShippingAddress", null=True, on_delete= models.CASCADE, blank = True)
    payment = models.OneToOneField('PayWithPaystack', related_name='order', on_delete=models.CASCADE, null=True, blank = True)


    def __str__(self):
        return f'Order for {self.name}'

    def get_summed_price(self):
        #gets the price of all products
        sum = 0
        for order_product in self.order_product.all():
            sum += order_product.product.get_price() * order_product.quantity
        return sum

    def get_summed_coupon(self):
        sum = 0 
        for coupon in self.coupon.all():
            sum += coupon.discount
        return sum

    def get_total_price(self):
        # gets the price of all products considering the availability of 
        # coupons an delivery fees
        total = 0
        if self.delivery_fee:
            total +=  self.delivery_fee
        total = self.get_summed_price() - self.get_summed_coupon()
        return total + 1500


class Category(models.Model):
    name = models.CharField(max_length=200)
    
    class Meta:
        verbose_name_plural = 'Categories'
    def __str__(self):
        return self.name


class Coupon(models.Model):
    coupon_name = models.CharField(max_length=40)
    coupon_code = models.CharField(max_length=5)
    discount = models.FloatField(null = True, blank = True)

    def __str__(self):
        return self.coupon_name

class ShippingAddress(models.Model):
    address = models.CharField (max_length=200)

    def __str__(self):
        return self.address

class PayWithPaystack(models.Model):
    first_name  = models.CharField(max_length = 20)
    last_name  = models.CharField(max_length = 20)
    ref = models.CharField(max_length = 100, unique = True)
    email = models.EmailField()
    amount = models.IntegerField()
    verified = models.BooleanField(default=False)
    date_paid = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'payment for {self.first_name} {self.last_name}'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    def save(self, *args, **kwargs):
        if not self.ref:
            while True :
                ref = secrets.token_urlsafe()
                if not PayWithPaystack.objects.filter(ref = ref).exists():
                    break 
            self.ref = ref
        super(PayWithPaystack, self).save(*args, **kwargs)
                

class RandomUsers(models.Model):
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=300)
    name = models.CharField(max_length=200, null = True)
    is_used = models.BooleanField(default=False)
    email = models.EmailField(null=True)

    def __str__(self):
        return self.username