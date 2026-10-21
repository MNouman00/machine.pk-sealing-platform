from django.core.management.base import BaseCommand
from catalog.models import Category, Product

PRODUCTS = [
    ("AECO-300 Heat Sealer", "aeco-300-heat-sealer", "Heat Sealers", "249.00", 40, "Best Seller", "Precision impulse sealing with digital temperature control.", ["300mm length", "150°C"], ["Digital control"]),
    ("AECO-V400 Vacuum Sealer", "aeco-v400-vacuum-sealer", "Vacuum Sealers", "599.00", 25, "New", "Dual chamber vacuum sealing.", ["400mm width", "750W"], ["Dual chamber"]),
    ("AECO-IS200 Induction Sealer", "aeco-is200-induction-sealer", "Induction Sealers", "429.00", 30, "Popular", "Advanced induction sealing.", ["200mm size", "400W"], ["Tamper-evident"]),
    ("AECO-B350 Band Sealer", "aeco-b350-band-sealer", "Band Sealers", "899.00", 15, "Industrial", "Continuous band sealing.", ["350mm width", "Heavy-duty"], ["Variable speed"]),
    ("AECO-S500 Smart Sealer", "aeco-s500-smart-sealer", "Smart Technology", "1299.00", 10, "Smart", "AI-powered sealing system.", ["AI-powered", "IoT enabled"], ["Real-time data"]),
]

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for name, slug, cat_name, price, stock, tag, desc, specs, features in PRODUCTS:
            category, _ = Category.objects.get_or_create(
                name=cat_name, defaults={"slug": cat_name.lower().replace(" ", "-")}
            )
            Product.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    name=name, category=category, short_description=desc,
                    description=desc, price=price, stock=stock,
                    tags=[tag] if tag else [], specs=specs, features=features,
                    image_url=f"https://picsum.photos/seed/{slug}/600/600"
                ),
            )
        self.stdout.write(self.style.SUCCESS("Successfully added products!"))