import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
          <img 
            src="https://www.samisaude.com.br/static/images/logo-sami-white-0c678524272f894fc1c07ac05e4cf6b2.svg" 
            alt="Sami Saúde" 
            className="h-10"
          />
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p className="text-gray-300 text-sm text-center md:text-left">
              Sami Assistência Médica Ltda. CNPJ 36.567.721/0001-25. Alameda Vicente Pinzon, 54 Vila Olímpia  |  São Paulo, SP  CEP 04547-130
            </p>
            <img 
              src="https://www.samisaude.com.br/static/images/ans-number-a9af3bff7736099d1f5eec452d344e93.svg" 
              alt="ANS nº: 422398" 
              className="h-6 ml-2"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Sami Saúde. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;