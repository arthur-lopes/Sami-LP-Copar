import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#FF5A5F] to-[#FF8087] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tabela de Coparticipação Sami
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Transparência é um dos nossos valores. Confira abaixo todos os valores
            de coparticipação para procedimentos médicos nos planos Sami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a 
              href="#table" 
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#FF5A5F] rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Ver tabela completa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;