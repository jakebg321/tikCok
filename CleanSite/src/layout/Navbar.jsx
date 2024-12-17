// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Overview' },
    { path: '/meme-scanner', label: 'Meme Scanner' },
    { path: '/bundle-checker', label: 'Bundle Checker' },
    { path: '/about', label: 'About' }
  ];

  return (
    <div className="fixed top-0 left-0 z-50 p-4">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-[#B0E0E6]/10 rounded-lg transition-colors"
        >
          <HiMenu className="h-6 w-6 text-[#4A4A4A]" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-[#4A4A4A] hover:bg-[#B0E0E6]/10 hover:text-[#708090]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;