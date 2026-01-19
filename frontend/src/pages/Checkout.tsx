import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar cartItemCount={0} cartSubtotal={0} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-slate-900">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-slate-700 font-semibold">Full Name</Label>
                      <Input id="fullname" type="text" placeholder="John Doe" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-slate-700 font-semibold">Address</Label>
                      <Input id="address" type="text" placeholder="123 Main St" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-700 font-semibold">City</Label>
                        <Input id="city" type="text" placeholder="New York" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-slate-700 font-semibold">ZIP Code</Label>
                        <Input id="zip" type="text" placeholder="10001" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-6">Payment Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card" className="text-slate-700 font-semibold">Card Number</Label>
                        <Input id="card" type="text" placeholder="1234 5678 9012 3456" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-slate-700 font-semibold">Expiry Date</Label>
                          <Input id="expiry" type="text" placeholder="MM/YY" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-slate-700 font-semibold">CVV</Label>
                          <Input id="cvv" type="text" placeholder="123" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="border-slate-200 shadow-lg sticky top-24 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-slate-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-t border-b border-slate-200 py-6 space-y-3">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span>$9.99</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-2xl font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-blue-600">$9.99</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">Complete Purchase</Button>
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 py-3 text-lg font-semibold" asChild>
                        <a href="/cart">Back to Cart</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}