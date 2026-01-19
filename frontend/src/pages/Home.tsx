import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import BannerCarousel from "@/components/BannerCarousel";
import ProductGrid from "@/components/ProductGrid";
import CategoryGrid from "@/components/CategoryGrid";
import products from "@/data/products.json";

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setCartTotal(total);
  }, [cart]);

  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar cartItemCount={cart.length} cartSubtotal={cartTotal} />
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner
          title="Summer Collection 2024"
          subtitle="Discover our exclusive range of premium products at unbeatable prices"
          ctaText="Shop Now"
          onCTA={() => window.scrollTo({ top: 800, behavior: "smooth" })}
        />

        {/* Banner Carousel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BannerCarousel
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>

        {/* Category Grid */}
        <CategoryGrid
          title="Shop by Category"
        />

        {/* Featured Products */}
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          title="Featured Products"
          columns={3}
        />

        {/* Special Offer Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">🚚</div>
                <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                <p className="text-slate-300">On orders over $50</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">💎</div>
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-slate-300">Guaranteed satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">🤝</div>
                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-slate-300">Always here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Sellers */}
        <ProductGrid
          products={products.slice(0, 4)}
          onAddToCart={handleAddToCart}
          title="Best Sellers"
          columns={4}
        />
      </main>
      <Footer />
    </div>
  );
}