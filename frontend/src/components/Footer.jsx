import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MAIN GRID CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                D-SHOP
              </span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your premium destination for fashion and lifestyle. We bring quality products directly to your doorstep with care.
            </p>
            
            {/* Social Icons with unique hover colors */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="group p-2 rounded-full bg-slate-900 hover:bg-blue-600/20 transition-all duration-300">
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="group p-2 rounded-full bg-slate-900 hover:bg-sky-500/20 transition-all duration-300">
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
              </a>
              <a href="#" className="group p-2 rounded-full bg-slate-900 hover:bg-pink-600/20 transition-all duration-300">
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', to: '/' },
                { name: 'All Products', to: '/products' },
                { name: 'My Cart', to: '/cart' },
                { name: 'Login / Register', to: '/login' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-slate-400 hover:text-blue-400 transition-all duration-300"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-purple-600 rounded-full"></span>
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm text-slate-400 leading-snug group-hover:text-slate-200 transition-colors">
                  Sirdaryo Viloyati, <br/> Baxt Shahar, 5/2 do'kon
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-green-600/20 transition-colors">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                  +998 (97) 569 10 63
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                  <Mail className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                  support@dshop.com
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-pink-600 rounded-full"></span>
            </h4>
            <p className="text-slate-400 text-sm mb-6">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="relative">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900 text-white px-4 py-3 pl-4 pr-12 rounded-xl border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">D-SHOP</span>. All rights reserved.
          </p>
          <div className="flex gap-8 text-slate-500">
            <Link to="#" className="hover:text-white transition-colors relative group">
              Privacy Policy
              <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="#" className="hover:text-white transition-colors relative group">
              Terms of Service
              <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;