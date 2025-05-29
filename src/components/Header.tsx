import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center md:justify-start">
          <img 
            src="https://www.samisaude.com.br/static/images/logo-sami-saude-db70a2a56cce511d333f16272156d44f.svg" 
            alt="Sami Saúde" 
            className="h-10"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;