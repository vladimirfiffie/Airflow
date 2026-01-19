import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar cartItemCount={0} cartSubtotal={0} />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-slate-900">Shopping Cart</h1>
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="py-12">
              <p className="text-center text-slate-500 mb-8 text-lg">Your cart is empty</p>
              <div className="flex justify-center">
                <a href="/" className="block">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">Continue Shopping</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}