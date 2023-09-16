from backend.models import (Category, Coupon, Favourites, Product,
                            OrderProduct, Order, PayWithPaystack, ShippingAddress,
                            Favourites, RandomUsers)
from rest_framework.generics import ListAPIView, RetrieveAPIView, GenericAPIView
from rest_framework import status
from .serializer import (
    CartSizeSerializer, CouponSerializer, ProductSerializer, CategorySerializer, UserSerializer,
    RegisterUserSerializer, GetProductSerializer, CartItemSerializer, QuantitySerializer,
    ShippingDetialsSerializer, PaymentSerializer, FavouritesSerializer, 
    AccountInfoSerializer, RandomUserSerializer
)
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
import random
import string


def create_random_ID():
    """
        This function creates a random id for our order
    """
    while True:
        id = ''.join(random.choices(string.digits, k=5))
        order = Order.objects.filter(order_id=id)
        if not order.exists():
            break
    return id

class RandomAccountApiView(GenericAPIView):
    serializer_class = RandomUserSerializer

    def get(self, *args, **kwargs):
        random_users = RandomUsers.objects.all().filter(is_used = False)
        return Response(self.get_serializer(random.choice(random_users)).data)

class ProductListApiView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetial(RetrieveAPIView):
    permission_classes = (IsAuthenticated)
    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class ProductByCategoryApiView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        return Product.objects.filter(category=self.kwargs['category'])


class CatogoryApiView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ProductsByPrice(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        price = self.request.GET['price']
        variant = self.request.GET['variant']
        if variant == 'Min':
            product_qs = Product.objects.filter(price__gte=price)
        else:
            product_qs = Product.objects.filter(price__lte=price)

        return product_qs


class RegisterUserApiView(GenericAPIView):
    serializer_class = RegisterUserSerializer

    def post(self, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        if serializer.is_valid():
            user = serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'message': 'Account created Successfully'
        })

class AccountInfoApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = AccountInfoSerializer

    def get(self, *args, **kwargs):
        return Response(self.serializer_class(self.request.user).data)
    
class CartSizeApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = CartSizeSerializer

    def get(self, *args, **kwargs):
        try:
            order = Order.objects.get(user__id = self.request.user.id , is_ordered = False)
            return Response(self.serializer_class(order).data)
        except ObjectDoesNotExist:
            return Response({"size" : 0})
        
        
class AddToCartApiView(GenericAPIView):
    serializer_class = GetProductSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        try:
            product = Product.objects.get(id=id)
        except ObjectDoesNotExist as e:
            return Response({'error': 'Product does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        order_product, created = OrderProduct.objects.get_or_create(
            user=request.user,
            product=product,
            is_ordered=False
        )
        try:
            order = Order.objects.get(user=request.user, is_ordered=False)
        except ObjectDoesNotExist as e:
            order = Order(
                order_id=create_random_ID(),
                status='RE',
                user=request.user
            )
            order.save()

        if order.order_product.filter(product__id=product.id, is_ordered=False).exists():
            order_product.quantity += 1
            order_product.save()
        else:
            order.order_product.add(order_product)
        order.save()
        return Response(ProductSerializer(product).data)


class GetCartItemsApiView(GenericAPIView):
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=request.user,  is_ordered=False)
        if not order_qs.exists():
            return Response({'message': "Your cart is empty, Add an item"}, status=status.HTTP_404_NOT_FOUND)
        return Response({**self.get_serializer(order_qs[0]).data})


class UpdateQuantityView(GenericAPIView):
    serializer_class = QuantitySerializer
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            quantity = serializer.validated_data['quantity']
            Id = serializer.validated_data['id']
            try:
                order = Order.objects.get(user=request.user, is_ordered=False)
                try:
                    order_product = order.order_product.get(id=Id)
                except ObjectDoesNotExist as e:
                    return Response({'error': 'Someting went wrong'}, status=status.HTTP_404_NOT_FOUND)
            except ObjectDoesNotExist as e:
                return Response({'error': 'Someting went wrong'}, status=status.HTTP_404_NOT_FOUND)

            order_product.quantity = quantity
            order_product.save()

            return Response({'message': 'updated Successuflly'})
        else:
            return Response({'message': 'bad request'}, status=status.HTTP_400_BAD_REQUEST)


class RemoveItemApiView(GenericAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        id = kwargs['id']
        try:
            order = Order.objects.get(user=request.user, is_ordered=False)
            try:
                order_product = order.order_product.get(id=id)
            except ObjectDoesNotExist as e:
                return Response({'error': 'Someting went wrong'}, status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist as e:
            return Response({'error': 'Someting went wrong'}, status=status.HTTP_404_NOT_FOUND)

        order.order_product.remove(order_product)
        order_product.delete()
        order.save()

        return Response({'message': 'item removed'})

class GetDummyCoupon(GenericAPIView):
    serializer_class = CouponSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, *args, **kwargs):
        coupon_code = ''.join(random.choices(string.digits + string.ascii_letters, k=5))
        coupon = Coupon.objects.create(coupon_name = "dummy", coupon_code = coupon_code, discount = 2000)
        return Response(self.get_serializer(coupon).data)


class ApplyCouponApiView(GenericAPIView):
    serializer_class = CouponSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        if serializer.is_valid():
            coupon_code = serializer.validated_data['coupon_code']
            try:
                coupon = Coupon.objects.get(coupon_code=coupon_code)
            except ObjectDoesNotExist:
                return Response({'coupon': ["Coupon doesn't exist"]}, status=status.HTTP_404_NOT_FOUND)

            try:
                order = Order.objects.get(user=request.user, is_ordered=False)
            except ObjectDoesNotExist:
                return Response({'coupon': ["Somthing has gone wrong, we'll fix it"]}, status=status.HTTP_400_BAD_REQUEST)

            if order.coupon.filter(coupon_code=coupon.coupon_code).exists():
                return Response({'coupon': ['coupon has already been used']}, status=status.HTTP_400_BAD_REQUEST)
            order.coupon.add(coupon)
            order.save()
            return Response({'message': "Coupon added successfully"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShippingApiView(GenericAPIView):
    serializer_class = ShippingDetialsSerializer
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            first_name = serializer.validated_data['first_name']
            email = serializer.validated_data['email']
            address = serializer.validated_data['address']
            last_name = serializer.validated_data['last_name']
            payment_method = serializer.validated_data['payment_method']

            try:
                order = Order.objects.get(user=request.user, is_ordered=False)
            except ObjectDoesNotExist:
                return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
            shipping = ShippingAddress.objects.create(
                address=address
            )
            order.shipping_address = shipping
            order.name = f'{first_name} {last_name}'
            if payment_method == 'PS':
                payment = PayWithPaystack(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    amount=order.get_total_price() * 100
                )
                payment.save()
                order.payment = payment
            order.save()
            return Response({'message': 'successful'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetPaymentApiView(GenericAPIView):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        try:
            order = Order.objects.get(user=request.user, is_ordered=False)
        except ObjectDoesNotExist:
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

        payment = order.payment
        return Response(self.get_serializer(payment).data)


class ConfirmPaymentApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        payment_method = kwargs['payment_method']
        try:
            order = Order.objects.get(user=request.user, is_ordered=False)
        except ObjectDoesNotExist:
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

        order.is_ordered = True
        order.is_paid = True
        order.order_product.update(is_ordered = True)
        order.save()
        return Response({'message': 'Payment Successful'})


class GetFavouritesProductsApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = FavouritesSerializer
    
    
    
    def get(self, request, *args, **kwargs):
        fav, created = Favourites.objects.get_or_create(user = request.user)

        serializer = self.get_serializer(fav)
        return Response(serializer.data)

class AddFavouritesApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        ID = kwargs['id']
        try:
            product = Product.objects.get(id = ID)
        except ObjectDoesNotExist :
            return Response({'message' : 'something went wrong'}, status = status.HTTP_404_NOT_FOUND)
        fav, created = Favourites.objects.get_or_create(user = request.user)
        if fav.product.filter(id = product.id).exists():
            fav.product.remove(product)
        else:
            fav.product.add(product)
        
        fav.save()
        return Response({'message' : 'successful'})
