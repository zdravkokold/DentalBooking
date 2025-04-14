
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-dental-lightGray px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-dental-teal mb-4">404</h1>
          <div className="w-16 h-16 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dental-teal">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 15h8M9 9h.01M15 9h.01"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Страницата не е намерена</h2>
          <p className="text-gray-600 mb-8">
            Съжаляваме, но страницата, която търсите, не съществува или е преместена.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-dental-teal hover:bg-dental-teal/90"
          >
            <Home className="mr-2 h-4 w-4" />
            Към началната страница
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
