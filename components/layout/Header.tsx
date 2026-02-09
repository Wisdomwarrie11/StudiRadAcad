import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure header is always visible with a background color to prevent text blending with white pages
  // We use a slightly transparent dark background at the top for hero images, but solid enough to read text
  const headerBgClass = isScrolled || location.pathname !== '/' 
    ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg py-3' 
    : 'bg-brand-dark/80 backdrop-blur-sm py-5';

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${headerBgClass}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-2xl font-bold tracking-tight">Studi<span className="text-brand-accent">Rad</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-brand-accent transition-colors">Home</Link>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-brand-accent transition-colors">
                Learning <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden py-2 text-gray-800">
                  <Link to="/resources/blog" className="block px-4 py-2 hover:bg-gray-50 hover:text-brand-primary">Blog</Link>
                  <Link to="/resources/materials" className="block px-4 py-2 hover:bg-gray-50 hover:text-brand-primary">Learning Resources</Link>
                  <Link to="/webinars" className="block px-4 py-2 hover:bg-gray-50 hover:text-brand-primary">Webinars</Link>
                  <Link to="/resources/QuizChallenge" className="block px-4 py-2 hover:bg-gray-50 hover:text-brand-primary">Quiz corner</Link>

                </div>
              </div>
            </div>
            <Link to="/opportunities" className="text-sm font-medium hover:text-brand-accent transition-colors">Opportunities</Link>
            <Link to="/about" className="text-sm font-medium hover:text-brand-accent transition-colors">About Us</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-dark border-t border-gray-700 shadow-xl min-h-screen">
          <div className="flex flex-col p-6 gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-brand-accent">Home</Link>
            
            <div className="space-y-2">
              <button 
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center justify-between w-full text-white text-lg font-medium hover:text-brand-accent"
              >
                Resources <ChevronDown size={16} className={`transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="pl-4 space-y-2 border-l border-gray-700 ml-2">
                  <Link to="/resources/blog" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">Blog</Link>
                  <Link to="/resources/materials" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">Learning Materials</Link>
                  <Link to="/resources/news" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white">Radiography News</Link>
                </div>
              )}
            </div>
            <Link to="/activities" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-brand-accent">Our Activities</Link>
            <Link to="/classes" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-brand-accent">Our Academy</Link>
            <Link to="/opportunities" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-brand-accent">Opportunities</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium hover:text-brand-accent">About Us</Link>
            <button className="w-full py-3 bg-brand-accent text-brand-dark font-bold rounded-lg mt-4">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;