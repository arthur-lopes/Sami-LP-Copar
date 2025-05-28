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
  const [selectedPlanOptions, setSelectedPlanOptions] = useState<MultiValue<OptionType>>([]);
  const [partnerNameQuery, setPartnerNameQuery] = useState<string>('');

  const uniquePlansFromPartners = useMemo(() => {
    if (!partnersData) return [];
    const plans = new Set(partnersData.map(p => p.nomePlano));
    return Array.from(plans).sort().map(plan => ({ value: plan, label: plan }));
  }, [partnersData]);

  const filteredPartners = useMemo(() => {
    let items = [...partnersData];

    // Filter by selected plans
    if (selectedPlanOptions.length > 0) {
      const planValues = selectedPlanOptions.map((opt: OptionType) => opt.value);
      items = items.filter(partner => planValues.includes(partner.nomePlano));
    }

    // Filter by partner name query
    if (partnerNameQuery.trim() !== '') {
      items = items.filter(partner => 
        partner.nomeParceiro.toLowerCase().includes(partnerNameQuery.toLowerCase())
      );
    }
    return items;
  }, [partnersData, selectedPlanOptions, partnerNameQuery]);

  const hospitalData = useMemo(() => {
    return filteredPartners.filter(p => p.tipo.toLowerCase() === 'hospital');
  }, [filteredPartners]);

  const laboratoryData = useMemo(() => {
    return filteredPartners.filter(p => p.tipo.toLowerCase() === 'laboratório' || p.tipo.toLowerCase() === 'laboratorio');
  }, [filteredPartners]);

  return (
    <div className="my-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rede Credenciada
        </h2>
        <p className="text-gray-600">
          Consulte os hospitais e laboratórios disponíveis nos planos Sami.
        </p>
      </div>

      {/* Filters for Partners Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div>
          <label htmlFor="partnerNameSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por Nome do Parceiro:
          </label>
          <input
            type="text"
            id="partnerNameSearch"
            value={partnerNameQuery}
            onChange={(e) => setPartnerNameQuery(e.target.value)}
            placeholder="Digite o nome do hospital ou laboratório"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="partnerPlanFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Plano:
          </label>
          <Select<OptionType, true>
            id="partnerPlanFilter"
            options={uniquePlansFromPartners}
            isMulti
            onChange={setSelectedPlanOptions}
            value={selectedPlanOptions}
            className="mt-1 basic-multi-select"
            classNamePrefix="select"
            placeholder="Todos os planos"
            noOptionsMessage={() => 'Nenhum plano disponível'}
          />
        </div>
      </div>

      <PartnerTable data={hospitalData} title="Hospitais" isLoading={isLoading} />
      <PartnerTable data={laboratoryData} title="Laboratórios" isLoading={isLoading} />
    </div>
  );
};

export default PartnersSection;
