import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCTA?: () => void;
}

export default function HeroBanner({
  title = "Summer Collection 2024",
  subtitle = "Discover our exclusive range of premium products",
  ctaText = "Shop Now",
  onCTA,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-24 sm:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-semibold text-white backdrop-blur-sm">
                ✨ New Arrivals
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              {title}
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={onCTA}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                {ctaText}
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-blue-100 text-sm">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-blue-100 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-blue-100 text-sm">Support</p>
              </div>
            </div>
          </div>

          {/* Image/Illustration Area */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                alt="Featured product"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
              <p className="text-sm text-slate-600 mb-2">⭐ Bestseller</p>
              <p className="font-bold text-slate-900">Premium Quality</p>
              <p className="text-sm text-slate-500">Trusted by thousands</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
