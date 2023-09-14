from django.urls import path
from django.views.generic import TemplateView

app_name = 'frontend'
urlpatterns = [
    path('', TemplateView.as_view(template_name = 'index.html'), name = 'home'),
    path('login', TemplateView.as_view(template_name = 'index.html'), name = 'login'),
    path('register', TemplateView.as_view(template_name = 'index.html'), name = 'regiter'),
    path('cart', TemplateView.as_view(template_name = 'index.html'), name = 'cart'),
    path('shipping', TemplateView.as_view(template_name = 'index.html'), name = 'shipping'),
    path('confirm-order', TemplateView.as_view(template_name = 'index.html'), name = 'confirm_order'),
    path('about', TemplateView.as_view(template_name = 'index.html'), name = 'about')
]