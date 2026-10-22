from rest_framework import serializers
from .models import Category, Product, Order, OrderItem, ProductImage, QuoteRequest
from decimal import Decimal
from uuid import uuid4
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_feature"]

    def get_image(self, obj):
        if obj.image_url:
            return obj.image_url
        if obj.image:
            # Use the incoming request to build the correct absolute URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback for production
            return f"https://machine-pk-sealing-platform.onrender.com{obj.image.url}"
        return None

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category", "short_description", "description",
                  "price", "stock", "image_url", "tags", "specs", "features", "images"]

    def get_images(self, obj):
        # Pass context down so build_absolute_uri works
        return ProductImageSerializer(obj.images.all(), many=True, context=self.context).data

class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=200)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=32, allow_blank=True)
    shipping_address = serializers.CharField(allow_blank=True)
    items = OrderItemInputSerializer(many=True)

    def create(self, validated_data):
        user = self.context['request'].user
        ref = f"AECO-{uuid4().hex[:8].upper()}"
        order = Order.objects.create(
            user=user if user.is_authenticated else None,
            reference=ref,
            customer_name=validated_data["customer_name"],
            customer_email=validated_data["customer_email"],
            customer_phone=validated_data.get("customer_phone", ""),
            shipping_address=validated_data.get("shipping_address", ""),
        )
        total = Decimal("0")
        for item in validated_data["items"]:
            p = Product.objects.get(pk=item["product_id"])
            oi = OrderItem.objects.create(
                order=order, product=p, quantity=item["quantity"], unit_price=p.price
            )
            total += oi.line_total()
        order.total = total
        order.save()
        return order

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "reference", "customer_name", "customer_email", "status", "total", "created_at", "items"]

    def get_items(self, obj):
        return [
            {
                "product_id": i.product_id,
                "product_name": i.product.name,
                "quantity": i.quantity,
                "unit_price": str(i.unit_price),
                "line_total": str(i.line_total()),
            }
            for i in obj.items.all()
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = ["id", "name", "email", "phone", "company", "machine_interest", "message"]