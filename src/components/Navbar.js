import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to manage whether mobile menu is shown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-emerald-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">UnityBridge </Link>
        </div>
        {/* Links for larger screens */}
        <div className={`hidden md:flex space-x-4`}>
          <Link to="/" className="hover:text-emerald-200">Home</Link>
          <Link to="/about" className="hover:text-emerald-200">About</Link>
          <Link to="/donate" className="hover:text-emerald-200">Donate</Link>
          <Link to="/volunteer" className="hover:text-emerald-200">Volunteer</Link>
          <Link to="/contact" className="hover:text-emerald-200">Contact</Link>
        </div>
        {/* Hamburger menu for smaller screens */}
        <div className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="hover:text-emerald-200 block px-3 py-2 rounded-md">Home</Link>
          <Link to="/about" className="hover:text-emerald-200 block px-3 py-2 rounded-md">About</Link>
          <Link to="/donate" className="hover:text-emerald-200 block px-3 py-2 rounded-md">Donate</Link>
          <Link to="/volunteer" className="hover:text-emerald-200 block px-3 py-2 rounded-md">Volunteer</Link>
          <Link to="/contact" className="hover:text-emerald-200 block px-3 py-2 rounded-md">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
