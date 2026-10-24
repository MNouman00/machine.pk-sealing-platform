from langchain_core.tools import tool
from catalog.models import Product, Order, OrderItem
from decimal import Decimal
from uuid import uuid4
from typing import Optional
from django.contrib.auth.models import User
@tool
def search_products(
    query: str = "", 
    category: str = "", 
    max_price: Optional[float] = None  # <-- Optional allows null
) -> list:
    """Search AECO product catalog.
    
    Args:
        query: Free-text search (e.g. 'vacuum', 'heat sealer').
        category: Optional category name (e.g. 'Heat Sealers').
        max_price: Optional maximum price in USD (pass null if not filtering by price).
    """
    from catalog.models import Product
    from django.db.models import Q
    from decimal import Decimal

    qs = Product.objects.filter(is_active=True)
    if query:
        qs = qs.filter(Q(name__icontains=query) | Q(short_description__icontains=query))
    if category:
        qs = qs.filter(category__name__iexact=category)
    if max_price is not None:
        qs = qs.filter(price__lte=Decimal(str(max_price)))
    
    qs = qs[:10]
    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "category": p.category.name,
            "price": float(p.price),
            "stock": p.stock,
            "short_description": p.short_description,
            "tags": p.tags,
        }
        for p in qs
    ]

@tool
def get_product_details(product_id: int) -> dict:
    """Get detailed specs for a specific product."""
    if product_id is None:
        return {"error": "product_id is required"}
    try:
        from catalog.models import Product
        p = Product.objects.get(pk=product_id)
        return {"name": p.name, "specs": p.specs, "features": p.features, "stock": p.stock}
    except Exception:
        return {"error": "Product not found"}

@tool
def create_order(customer_name: str, customer_email: str, items: list[dict], user_id: int = None) -> dict:
    """Create an order. 'items' must be a list like: [{'product_id': 1, 'quantity': 2}]"""
    from django.contrib.auth.models import User
    from decimal import Decimal
    from uuid import uuid4
    from catalog.models import Product, Order, OrderItem
    
    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            pass
    
    order = Order.objects.create(
        user=user,
        reference=f"AECO-{uuid4().hex[:8].upper()}",
        customer_name=customer_name,
        customer_email=customer_email,
        status="pending"
    )
    
    total = Decimal("0")
    for i in items:
        p = Product.objects.get(pk=i["product_id"])
        oi = OrderItem.objects.create(order=order, product=p, quantity=i["quantity"], unit_price=p.price)
        total += oi.line_total()
    order.total = total
    order.save()
    
    return {"success": True, "reference": order.reference, "total": float(total)}

# Add this list at the bottom of the file
ALL_TOOLS = [search_products, get_product_details, create_order]