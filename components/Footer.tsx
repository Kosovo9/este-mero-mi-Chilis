import React from 'react';
import { Translation } from '../types';

interface FooterProps {
  t: Translation;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full py-10 mt-20 border-t border-christmas-gold/10 bg-christmas-dark relative z-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-christmas-cream/60">
        <button className="flex items-center space-x-2 mb-6 md:mb-0 hover:text-christmas-gold transition-colors group text-left">
            <span className="text-christmas-gold group-hover:scale-125 transition-transform duration-300">♥</span>
            <span>{t.donation}</span>
        </button>
        <div className="flex flex-col items-center md:items-end space-y-2">
          <button className="hover:text-christmas-gold transition-colors">{t.affiliate}</button>
          <p className="opacity-50 text-xs">© 2024 Christmas AI Studio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;