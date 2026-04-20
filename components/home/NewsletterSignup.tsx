import React from 'react';
import { Send } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-brand-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Get the latest radiography news, scholarship alerts, and course discounts delivered straight to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-accent/50"
              />
              <button className="bg-brand-accent text-brand-dark font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                Subscribe <Send size={18} />
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-200">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;