import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#FF5751] to-[#FF5751] text-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-black mb-10">
            Coparticipação
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Transparência é um dos nossos valores. Confira abaixo os hospitais e laboratórios da rede credenciada junto a todos os valores
            de coparticipação para procedimentos médicos nos planos Sami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a 
              href="#hospitais-section" x
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#FF5A5F] rounded-md font-bold hover:bg-gray-100 transition-colors text-xl"
            >
              Hospitais
            </a>
            <a 
              href="#laboratorios-section" 
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#FF5A5F] rounded-md font-bold hover:bg-gray-100 transition-colors text-xl"
            >
              Laboratórios
            </a>
            <a 
              href="#coparticipacao-section" 
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-[#FF5A5F] rounded-md font-bold hover:bg-gray-100 transition-colors text-xl"
            >
              Tabela de Coparticipação
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;