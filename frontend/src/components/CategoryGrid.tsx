import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  color: string;
}

interface CategoryGridProps {
  categories?: Category[];
  onCategorySelect?: (categoryId: string) => void;
  title?: string;
}

const defaultCategories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    count: 2341,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "fashion",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop",
    count: 1856,
    color: "from-pink-400 to-rose-600",
  },
  {
    id: "home",
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    count: 1243,
    color: "from-green-400 to-emerald-600",
  },
  {
    id: "sports",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
    count: 987,
    color: "from-orange-400 to-red-600",
  },
];

export default function CategoryGrid({
  categories = defaultCategories,
  onCategorySelect,
  title = "Shop by Category",
}: CategoryGridProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore our carefully curated categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              onClick={() => onCategorySelect?.(category.id)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 mb-4">
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-50 transition-opacity`}></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-[-4px] transition-transform">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white text-opacity-90">
                    {category.count.toLocaleString()} products
                  </p>
                </div>
              </div>

              {/* Explore Button */}
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 group-hover:border-blue-600 transition-all"
                onClick={() => onCategorySelect?.(category.id)}
              >
                Explore
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
