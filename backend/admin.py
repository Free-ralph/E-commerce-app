from django.contrib import admin
from .models import Product, Category, Order, PayWithPaystack, Favourites, Coupon, RandomUsers

class OrderAdmin(admin.ModelAdmin):
    readonly_fields = (
        'get_summed_price',
        'get_summed_coupon',
        'get_total_price',
    )



admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Order, OrderAdmin)
admin.site.register(PayWithPaystack)
admin.site.register(Favourites)
admin.site.register(Coupon)
admin.site.register(RandomUsers)
