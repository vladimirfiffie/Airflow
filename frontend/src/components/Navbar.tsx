import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Settings, LogOut } from "lucide-react";

interface NavbarProps {
  cartItemCount?: number;
  cartSubtotal?: number;
  userImage?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = 0,
  cartSubtotal = 0,
  userImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
}) => {
  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Store</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cart Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 text-[10px] bg-red-500 hover:bg-red-600 border-2 border-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-2">
              <div className="p-4 border-b bg-slate-50">
                <p className="font-semibold text-slate-900">{cartItemCount} Items in Cart</p>
                <p className="text-sm text-slate-600">Subtotal: ${cartSubtotal.toFixed(2)}</p>
              </div>
              <div className="p-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                  View Cart
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 overflow-hidden border border-slate-200 hover:bg-slate-100">
                <img
                  alt="User avatar"
                  src={userImage}
                  className="h-full w-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mt-2">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <div className="border-t my-1" />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;