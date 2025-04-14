
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-6 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-dental-teal">DentalBooking</h3>
            <p className="text-gray-600 text-sm">
              Модерно уеб приложение за записване на часове в зъболекарска клиника чрез интелигентен календар, гъвкаво управление на графици и персонализирани напомняния.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-dental-teal hover:text-dental-mint">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-dental-teal hover:text-dental-mint">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-dental-teal hover:text-dental-mint">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Бързи връзки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-dental-teal text-sm">
                  Начало
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-600 hover:text-dental-teal text-sm">
                  Запазване на час
                </Link>
              </li>
              <li>
                <Link to="/dentists" className="text-gray-600 hover:text-dental-teal text-sm">
                  Зъболекари
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-dental-teal text-sm">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-dental-teal text-sm">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services#checkup" className="text-gray-600 hover:text-dental-teal text-sm">
                  Профилактични прегледи
                </Link>
              </li>
              <li>
                <Link to="/services#treatment" className="text-gray-600 hover:text-dental-teal text-sm">
                  Лечение на кариеси
                </Link>
              </li>
              <li>
                <Link to="/services#whitening" className="text-gray-600 hover:text-dental-teal text-sm">
                  Избелване на зъби
                </Link>
              </li>
              <li>
                <Link to="/services#implants" className="text-gray-600 hover:text-dental-teal text-sm">
                  Зъбни импланти
                </Link>
              </li>
              <li>
                <Link to="/services#orthodontics" className="text-gray-600 hover:text-dental-teal text-sm">
                  Ортодонтия
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Контакти</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-dental-teal" />
                <span>ул. Шипка 34, София 1000</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-dental-teal" />
                <span>+359 888 123 456</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-dental-teal" />
                <span>info@dentalbooking.bg</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-dental-teal" />
                <span>Пон-Пет: 8:00-19:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DentalBooking. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
