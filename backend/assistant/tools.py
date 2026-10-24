from langchain_core.tools import tool
from catalog.models import Product, Order, OrderItem
from decimal import Decimal
from uuid import uuid4
from django.contrib.auth.models import User
@tool
def search_products(query: str = "", category: str = "", max_price: float = None) -> list:
    """Search for MACHINES.PK products. Use this to answer questions about inventory."""
    qs = Product.objects.filter(is_active=True)
    if query:
        qs = qs.filter(name__icontains=query)
    
    # If you just want to know how many, return the count + a few products
    count = qs.count()
    top_items = [{"id": p.id, "name": p.name, "price": float(p.price)} for p in qs[:5]]
    
    return {
        "total_machines_in_stock": count,
        "sample_machines": top_items
    }

@tool
def get_product_details(product_id: int) -> dict:
    """Get detailed specs for a specific product."""
    try:
        p = Product.objects.get(pk=product_id)
        return {"name": p.name, "specs": p.specs, "features": p.features, "stock": p.stock}
    except Product.DoesNotExist:
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