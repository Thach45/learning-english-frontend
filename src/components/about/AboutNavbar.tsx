import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

interface AboutNavbarProps {
  me?: unknown;
}

const AboutNavbar: React.FC<AboutNavbarProps> = ({ me }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  const navClassName = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm' : 'bg-transparent py-5'
  }`;

  return (
    <nav className={navClassName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src="/blinky.png"
                alt="BlinkyVocab logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-l tracking-tight text-gray-900">
              BlinkyVocab
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm">
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">Tính năng</a>
            <a href="#community" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">Cộng đồng</a>
            <a href="#gamification" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">Thành tích</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!me && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl transition-colors hover:bg-gray-100"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  Học miễn phí <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
            {me && (
              <button
                onClick={handleGoDashboard}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                Vào học ngay <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors bg-white border border-gray-200 shadow-sm"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-2 shadow-xl">
          <a
            href="#features"
            className="p-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tính năng
          </a>
          <a
            href="#community"
            className="p-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cộng đồng
          </a>
          <a
            href="#gamification"
            className="p-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Thành tích
          </a>
          <div className="h-px bg-gray-100 my-2"></div>
          {!me && (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  navigate('/register');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-indigo-600 text-white p-3 text-base font-semibold rounded-xl mt-2 flex justify-center items-center gap-2"
              >
                Bắt đầu học ngay
              </button>
            </>
          )}
          {me && (
            <button
              onClick={() => {
                handleGoDashboard();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-indigo-600 text-white p-3 text-base font-semibold rounded-xl mt-2 flex justify-center items-center gap-2"
            >
              Vào Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default AboutNavbar;

