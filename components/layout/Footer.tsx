import React from 'react';
import { Radiation, Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Radiation className="text-brand-accent" size={28} />
              <span className="text-2xl font-bold">Studi<span className="text-brand-accent">Rad</span></span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering radiographers worldwide with top-tier education, career opportunities, and a supportive community.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <Link 
                  key={i} 
                  to="#" 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-brand-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link to="/classes" className="hover:text-brand-accent transition-colors">Classes</Link></li>
              <li><Link to="/opportunities" className="hover:text-brand-accent transition-colors">Opportunities</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6">Resources</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/resources/blog" className="hover:text-brand-accent transition-colors">Blog & News</Link></li>
              <li><Link to="/resources/case-studies" className="hover:text-brand-accent transition-colors">Case Studies</Link></li>
              <li><Link to="/resources/exam-prep" className="hover:text-brand-accent transition-colors">Exam Prep</Link></li>
              <li><Link to="/resources/anatomy" className="hover:text-brand-accent transition-colors">Anatomy Library</Link></li>
              <li><Link to="/scholarships" className="hover:text-brand-accent transition-colors">Scholarships</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Subscribe to get the latest radiography news and job alerts.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent"
              />
              <button className="bg-brand-accent text-brand-dark font-bold py-3 rounded-lg hover:bg-white transition-colors">
                Subscribe
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-gray-400">
              <Mail size={16} />
              <span>studirad.org@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} StudiRad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
