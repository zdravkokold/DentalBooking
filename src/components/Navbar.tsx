
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-dental-teal">DentaCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-dental-teal transition-colors">Начало</Link>
            <Link to="/services" className="text-gray-700 hover:text-dental-teal transition-colors">Услуги</Link>
            <Link to="/dentists" className="text-gray-700 hover:text-dental-teal transition-colors">Зъболекари</Link>
            <Link to="/appointments" className="text-gray-700 hover:text-dental-teal transition-colors">Запази час</Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-dental-teal transition-colors">
                    Админ панел
                  </Link>
                )}
                {user?.role === 'dentist' && (
                  <Link to="/dentist" className="text-gray-700 hover:text-dental-teal transition-colors">
                    Моят кабинет
                  </Link>
                )}
                {user?.role === 'patient' && (
                  <Link to="/patient" className="text-gray-700 hover:text-dental-teal transition-colors">
                    Моят профил
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
                >
                  Изход
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoginClick}
                className="text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
              >
                Вход
              </Button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Начало
            </Link>
            <Link 
              to="/services" 
              className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link 
              to="/dentists" 
              className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Зъболекари
            </Link>
            <Link 
              to="/appointments" 
              className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Запази час
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Админ панел
                  </Link>
                )}
                {user?.role === 'dentist' && (
                  <Link 
                    to="/dentist" 
                    className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Моят кабинет
                  </Link>
                )}
                {user?.role === 'patient' && (
                  <Link 
                    to="/patient" 
                    className="block py-2 text-gray-700 hover:text-dental-teal transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Моят профил
                  </Link>
                )}
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-2 text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
                >
                  Изход
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLoginClick}
                className="w-full mt-2 text-dental-teal border-dental-teal hover:bg-dental-teal hover:text-white"
              >
                Вход
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
