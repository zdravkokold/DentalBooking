
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Calendar, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Handle notification button click
  const handleNotificationClick = () => {
    // Show a notification toast
    toast.success("Предстоящи прегледи", {
      description: "Имате запазен час при д-р Иванов утре в 14:00ч.",
      action: {
        label: "Преглед",
        onClick: () => navigate("/appointments")
      },
    });
  };

  // Handle calendar button click
  const handleCalendarClick = () => {
    navigate("/appointments");
  };

  // Handle login button click
  const handleLoginClick = () => {
    navigate("/login");
  };
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-dental-teal font-semibold text-xl">
                Dental<span className="text-dental-mint">Booking</span>
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-dental-teal px-3 py-2 text-sm font-medium border-transparent hover:border-dental-teal"
              >
                Начало
              </Link>
              <Link
                to="/appointments"
                className="text-gray-700 hover:text-dental-teal px-3 py-2 text-sm font-medium border-transparent hover:border-dental-teal"
              >
                Запазване на час
              </Link>
              <Link
                to="/dentists"
                className="text-gray-700 hover:text-dental-teal px-3 py-2 text-sm font-medium border-transparent hover:border-dental-teal"
              >
                Зъболекари
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-dental-teal px-3 py-2 text-sm font-medium border-transparent hover:border-dental-teal"
              >
                Услуги
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-dental-teal px-3 py-2 text-sm font-medium border-transparent hover:border-dental-teal"
              >
                Контакти
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCalendarClick}>
              <Calendar className="h-5 w-5 text-gray-600" />
            </Button>
            <Button className="bg-dental-teal hover:bg-opacity-90 text-white" onClick={handleLoginClick}>
              <User className="h-5 w-5 mr-2" /> Вход
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-dental-teal hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("sm:hidden", isOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-dental-teal"
            onClick={() => setIsOpen(false)}
          >
            Начало
          </Link>
          <Link
            to="/appointments"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-dental-teal"
            onClick={() => setIsOpen(false)}
          >
            Запазване на час
          </Link>
          <Link
            to="/dentists"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-dental-teal"
            onClick={() => setIsOpen(false)}
          >
            Зъболекари
          </Link>
          <Link
            to="/services"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-dental-teal"
            onClick={() => setIsOpen(false)}
          >
            Услуги
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-dental-teal"
            onClick={() => setIsOpen(false)}
          >
            Контакти
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 px-3 py-2">
              <Button variant="ghost" size="icon" onClick={() => {
                handleNotificationClick();
                setIsOpen(false);
              }}>
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                handleCalendarClick();
                setIsOpen(false);
              }}>
                <Calendar className="h-5 w-5 text-gray-600" />
              </Button>
              <Button 
                className="w-full bg-dental-teal hover:bg-opacity-90 text-white"
                onClick={() => {
                  handleLoginClick();
                  setIsOpen(false);
                }}
              >
                <User className="h-5 w-5 mr-2" /> Вход
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
