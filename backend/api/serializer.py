from django.contrib.auth import password_validation as validators
from django.core import exceptions
from rest_framework import serializers
from backend.models import Product, Category, Order, PayWithPaystack, Favourites
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username

        return token


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
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
        )
        depth = 2

class QuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField()
    id = serializers.IntegerField()

class CouponSerializer(serializers.Serializer):
    coupon_code = serializers.CharField()

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
