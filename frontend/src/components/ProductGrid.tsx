import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  title?: string;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  onAddToCart,
  title = "Featured Products",
  columns = 3,
}: ProductGridProps) {
  const gridColsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
          <p className="text-slate-600 mt-4 max-w-2xl">
            Handpicked collection of premium products selected just for you
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid ${gridColsClass[columns]} gap-6`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart || (() => {})}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
