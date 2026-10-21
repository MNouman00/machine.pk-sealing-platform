from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Product, Category, Order, QuoteRequest
from .serializers import ProductSerializer, CategorySerializer, OrderCreateSerializer, OrderSerializer, QuoteRequestSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category")
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(short_description__icontains=q))
        return qs

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

class OrderViewSet(viewsets.GenericViewSet):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ["create", "list"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        # Only return orders for the logged-in user
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).order_by('-created_at')
        return Order.objects.none()

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        ser = OrderCreateSerializer(data=request.data, context={'request': request})
        ser.is_valid(raise_exception=True)
        order = ser.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="lookup/(?P<reference>[^/.]+)")
    def lookup(self, request, reference=None):
        try:
            order = Order.objects.get(reference=reference)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=404)
        return Response(OrderSerializer(order).data)
class QuoteRequestViewSet(viewsets.ModelViewSet):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer