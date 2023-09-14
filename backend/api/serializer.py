from django.contrib.auth import password_validation as validators
from django.core import exceptions
from rest_framework import serializers
from backend.models import Product, Category, Order, PayWithPaystack, Favourites, Coupon
from django.contrib.auth.models import User


class RegisterUserSerializer(serializers.ModelSerializer):
    # password2 = serializers.CharField(style = {'input_type' : 'password'}, write_only = True)
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
        ]
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        errors = dict() 
        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return super(RegisterUserSerializer, self).validate(data)

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user

        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 
            'username', 
            'email', 
            'is_active'
        )

class AccountInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", 
            "username"
        ]

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        depth = 1
        fields = '__all__'

class GetProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', )

        
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            'id',
            'name'
        ]

class CartSizeSerializer(serializers.Serializer):
    size = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'size'
        ]

    def get_size(self, obj):
        return obj.order_product.count()
    


class CartItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = (
            'name',
            'order_product',
            'timestamp',
            'delivery_fee',
            'is_ordered',
            'status',
            'is_paid',
            'shipping_address',
            'get_summed_price',
            'get_total_price',
            'get_summed_coupon',
        )
        depth = 2

class QuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField()
    id = serializers.IntegerField()

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
        extra_kwargs = {
            'coupon_name' : {'required' : False},
            'discount' : {'required' : False}
        }


class ShippingDetialsSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    payment_method = serializers.ChoiceField(
        choices = (
        ('PS', 'PatStack' ),
        ('DE', 'Door Delivery' ),
    ))
    address = serializers.CharField()

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayWithPaystack
        fields = '__all__'

class FavouritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourites
        fields = '__all__'
        depth = 1
