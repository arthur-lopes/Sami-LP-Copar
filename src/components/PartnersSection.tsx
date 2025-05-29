import React, { useState, useMemo } from 'react';
import { PartnerData } from '../types';
import PartnerTable from './PartnerTable';
import Select, { MultiValue } from 'react-select';

interface PartnersSectionProps {
  partnersData: PartnerData[];
  isLoading: boolean;
  // We'll get all unique plans from partnersData directly, 
  // but if a global plan filter is desired, App.tsx can pass down `allPlans` and selected `planFilters`
}

interface OptionType {
  value: string;
  label: string;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ partnersData, isLoading }) => {
  const [hospitalNameQuery, setHospitalNameQuery] = useState<string>('');
  const [laboratoryNameQuery, setLaboratoryNameQuery] = useState<string>('');
  const [hospitalSelectedPlanOptions, setHospitalSelectedPlanOptions] = useState<MultiValue<OptionType>>([]);
  const [laboratorySelectedPlanOptions, setLaboratorySelectedPlanOptions] = useState<MultiValue<OptionType>>([]);

  const uniquePlansFromPartners = useMemo(() => {
    if (!partnersData) return [];
    const plans = new Set(partnersData.map(p => p.nomePlano));
    return Array.from(plans).sort().map(plan => ({ value: plan, label: plan }));
  }, [partnersData]);

  const hospitalData = useMemo(() => {
    // Only show hospital data if a plan is selected
    if (hospitalSelectedPlanOptions.length === 0) {
      return [];
    }
    
    let hospitals = partnersData.filter(p => p.tipo.toLowerCase() === 'hospital');

    const planValues = hospitalSelectedPlanOptions.map((opt: OptionType) => opt.value);
    hospitals = hospitals.filter(hospital => planValues.includes(hospital.nomePlano));

    if (hospitalNameQuery.trim() !== '') {
      hospitals = hospitals.filter(hospital =>
        hospital.nomeParceiro.toLowerCase().includes(hospitalNameQuery.toLowerCase())
      );
    }
    return hospitals;
  }, [partnersData, hospitalSelectedPlanOptions, hospitalNameQuery]);

  const laboratoryData = useMemo(() => {
    // Only show laboratory data if a plan is selected
    if (laboratorySelectedPlanOptions.length === 0) {
      return [];
    }
    
    let laboratories = partnersData.filter(p => p.tipo.toLowerCase() === 'laboratório' || p.tipo.toLowerCase() === 'laboratorio');

    const planValues = laboratorySelectedPlanOptions.map((opt: OptionType) => opt.value);
    laboratories = laboratories.filter(lab => planValues.includes(lab.nomePlano));

    if (laboratoryNameQuery.trim() !== '') {
      laboratories = laboratories.filter(lab =>
        lab.nomeParceiro.toLowerCase().includes(laboratoryNameQuery.toLowerCase())
      );
    }
    return laboratories;
  }, [partnersData, laboratorySelectedPlanOptions, laboratoryNameQuery]);

  return (
    <div className="my-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#FF5A5F] mb-2">
          Rede Credenciada
        </h2>
        <p className="text-gray-600 mb-6">
          Consulte os hospitais e laboratórios disponíveis nos planos Sami.
        </p>
      </div>

      {/* Filtros e Tabela de Hospitais */}
      <div id="hospitais-section" className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm scroll-mt-20">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Filtrar Hospitais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hospitalNameSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Hospital:
            </label>
            <input
              type="text"
              id="hospitalNameSearch"
              value={hospitalNameQuery}
              onChange={(e) => setHospitalNameQuery(e.target.value)}
              placeholder="Nome do hospital"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="hospitalPlanFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar Plano (Hospitais):
            </label>
            <Select<OptionType, true>
              id="hospitalPlanFilter"
              options={uniquePlansFromPartners}
              isMulti
              onChange={setHospitalSelectedPlanOptions}
              value={hospitalSelectedPlanOptions}
              className="mt-1 basic-multi-select"
              classNamePrefix="select"
              placeholder="Todos os planos"
              noOptionsMessage={() => 'Nenhum plano disponível'}
            />
          </div>
        </div>
      </div>
      <PartnerTable 
        data={hospitalData} 
        title="Hospitais" 
        isLoading={isLoading} 
        emptyMessage={hospitalSelectedPlanOptions.length === 0 ? "Selecione um plano para visualizar os hospitais disponíveis." : undefined}
      />

      {/* Filtros e Tabela de Laboratórios */}
      <div id="laboratorios-section" className="mt-10 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm scroll-mt-20">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Filtrar Laboratórios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="laboratoryNameSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Laboratório:
            </label>
            <input
              type="text"
              id="laboratoryNameSearch"
              value={laboratoryNameQuery}
              onChange={(e) => setLaboratoryNameQuery(e.target.value)}
              placeholder="Nome do laboratório"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="laboratoryPlanFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar Plano (Laboratórios):
            </label>
            <Select<OptionType, true>
              id="laboratoryPlanFilter"
              options={uniquePlansFromPartners}
              isMulti
              onChange={setLaboratorySelectedPlanOptions}
              value={laboratorySelectedPlanOptions}
              className="mt-1 basic-multi-select"
              classNamePrefix="select"
              placeholder="Todos os planos"
              noOptionsMessage={() => 'Nenhum plano disponível'}
            />
          </div>
        </div>
      </div>
      <PartnerTable 
        data={laboratoryData} 
        title="Laboratórios" 
        isLoading={isLoading} 
        emptyMessage={laboratorySelectedPlanOptions.length === 0 ? "Selecione um plano para visualizar os laboratórios disponíveis." : undefined}
      />
    </div>
  );
};

export default PartnersSection;
