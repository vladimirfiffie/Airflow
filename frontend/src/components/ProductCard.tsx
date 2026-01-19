import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200">
      <figure className="overflow-hidden h-48 bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </figure>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-900">{product.name}</CardTitle>
        <CardDescription className="text-blue-600 font-semibold text-sm">{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2 mb-4 text-slate-600">{product.description}</p>
        <div className="flex justify-between items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <div className="space-x-2 flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/product/${product.id}`)}
              className="hover:bg-slate-100 text-slate-700"
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;