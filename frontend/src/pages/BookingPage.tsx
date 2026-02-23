import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import products from "@/data/products.json";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id || "0"));

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar cartItemCount={0} cartSubtotal={0} />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Alert variant="destructive">
            <AlertDescription>Product not found</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar cartItemCount={0} cartSubtotal={0} />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            ← Back to Shopping
          </Button>
          
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <figure className="bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center min-h-96">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </figure>
                
                <div>
                  <h1 className="text-4xl font-bold mb-3 text-slate-900">{product.name}</h1>
                  <Badge className="mb-4 text-base bg-blue-100 text-blue-700 hover:bg-blue-100">{product.category}</Badge>
                  <p className="text-slate-600 mb-6 text-lg leading-relaxed">{product.description}</p>
                  
                  <div className="mb-8">
                    <p className="text-5xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold">Add to Cart</Button>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold">Buy Now</Button>
                  </div>
                  
                  <div className="my-8 border-t border-slate-200"></div>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-slate-900">Features:</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      <li>High quality materials</li>
                      <li>Premium design</li>
                      <li>Excellent warranty</li>
                      <li>Fast shipping</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}