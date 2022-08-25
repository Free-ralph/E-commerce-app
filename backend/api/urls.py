from django.urls import path
from .views import (ProductListApiView, ProductDetial,
                    ProductByCategoryApiView, CatogoryApiView,
                    ProductsByPrice, MyTokenObtainPairView,
                    RegisterUserApiView, AddToCartApiView,
                    GetCartItemsApiView, UpdateQuantityView,
                    RemoveItemApiView, ApplyCouponApiView,
                    ShippingApiView, GetPaymentApiView, 
                    ConfirmPaymentApiView, GetFavouritesProductsApiView, AddFavouritesApiView)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = 'api'
urlpatterns = [
    path('products', ProductListApiView.as_view(), name='products'),
    path('products/price', ProductsByPrice.as_view(), name='products'),
    path('product/categories', CatogoryApiView.as_view(), name='category'),
    path('product/<int:pk>', ProductDetial.as_view(), name='product'),
    path('product/<str:category>',ProductByCategoryApiView.as_view(), name='product'),
    path('token', MyTokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterUserApiView.as_view(), name='register'),
    path('add-to-cart/<int:id>', AddToCartApiView.as_view(), name='add_to_cart'),
    path('get-cart-items', GetCartItemsApiView.as_view(), name='get_cart_items'),
    path('update-quantity', UpdateQuantityView.as_view(), name='updated_quantity'),
    path('delete-item/<int:id>', RemoveItemApiView.as_view(), name='remove_item'),
    path('apply-coupon', ApplyCouponApiView.as_view(), name='apply_coupon'),
    path('shipping', ShippingApiView.as_view(), name='shipping'),
    path('get-payment', GetPaymentApiView.as_view(), name='get_payment'),
    path('confirm-payment/<str:payment_method>', ConfirmPaymentApiView.as_view(), name='confirm_payment'),
    path('favourites', GetFavouritesProductsApiView.as_view(), name='favourites'),
    path('add-favourite/<int:id>', AddFavouritesApiView.as_view(), name='add_favourite'),
]
