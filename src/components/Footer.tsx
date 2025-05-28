import React from 'react';
import { Cross as MedicalCross, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and company info */}
          <div className="col-span-1">
            <div className="flex items-center">
              <MedicalCross className="h-8 w-8 text-[#FF5A5F]" />
              <span className="ml-2 text-xl font-semibold">Sami Saúde</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Saúde acessível, tecnológica e com foco em prevenção, para todos os brasileiros.
            </p>
            <div className="flex mt-6 space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Planos
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Sami Básico
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Sami Premium
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Sami Odonto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Empresarial
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Beneficiários
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Portal do Beneficiário
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Rede Credenciada
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Coparticipação
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contato
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#FF5A5F] mt-0.5 mr-2" />
                <span className="text-gray-300 text-sm">
                  Av. Paulista, 1000 - São Paulo, SP
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#FF5A5F] mr-2" />
                <span className="text-gray-300 text-sm">0800 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#FF5A5F] mr-2" />
                <span className="text-gray-300 text-sm">contato@samisaude.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Sami Saúde. Todos os direitos reservados. 
            ANS nº 12345-6.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;