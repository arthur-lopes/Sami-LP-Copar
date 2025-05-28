import React from 'react';
import { Cross as MedicalCross } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MedicalCross className="h-8 w-8 text-[#FF5A5F]" />
            <span className="ml-2 text-xl font-semibold">Sami Saúde</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Início
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Planos
            </a>
            <a href="#" className="font-medium text-[#FF5A5F] hover:text-[#E54A4F] transition-colors">
              Coparticipação
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contato
            </a>
          </nav>
          <div className="hidden md:block">
            <button className="bg-[#FF5A5F] text-white px-4 py-2 rounded-md hover:bg-[#E54A4F] transition-colors">
              Fale com um consultor
            </button>
          </div>
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;