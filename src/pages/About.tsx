import React from 'react';
import { useMe } from '../hooks/useAuthApi';
import AboutNavbar from '../components/about/AboutNavbar';
import AboutHero from '../components/about/AboutHero';
import AboutFeatures from '../components/about/AboutFeatures';
import AboutCommunity from '../components/about/AboutCommunity';
import AboutFooter from '../components/about/AboutFooter';

const AboutPage: React.FC = () => {
  const { data: me } = useMe(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Cấu hình Font Inter */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        html, body { font-family: 'Inter', sans-serif; }
      `,
        }}
      />

      {/* Background Pattern Nhẹ nhàng */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Navigation */}
      <AboutNavbar me={me} />

      {/* Hero */}
      <AboutHero me={me} />

      {/* Features */}
      <AboutFeatures />

      {/* Community */}
      <AboutCommunity />

    

      {/* Footer */}
      <AboutFooter />
    </div>
  );
};

export default AboutPage;

