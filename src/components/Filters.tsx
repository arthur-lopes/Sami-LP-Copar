import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  classifications: string[];
  plans: string[];
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  classifications,
  plans
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por código ou procedimento..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#FF5A5F] focus:border-[#FF5A5F] sm:text-sm transition duration-150"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            />
          </div>
        </div>

        {/* Filter selectors */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Classification filter */}
          <div className="min-w-[180px]">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FF5A5F] focus:border-[#FF5A5F] sm:text-sm"
              value={filters.classificacao[0] || ''}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange({
                  classificacao: value ? [value] : []
                });
              }}
            >
              <option value="">Classificação</option>
              {classifications.map((classification) => (
                <option key={classification} value={classification}>
                  {classification}
                </option>
              ))}
            </select>
          </div>

          {/* Coparticipation filter */}
          <div className="min-w-[180px]">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FF5A5F] focus:border-[#FF5A5F] sm:text-sm"
              value={filters.coparticipacao === null ? '' : String(filters.coparticipacao)}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange({
                  coparticipacao: value === '' ? null : value === 'true'
                });
              }}
            >
              <option value="">Coparticipação</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>

          {/* Plan filter */}
          <div className="min-w-[180px]">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FF5A5F] focus:border-[#FF5A5F] sm:text-sm"
              value={filters.nomePlano[0] || ''}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange({
                  nomePlano: value ? [value] : []
                });
              }}
            >
              <option value="">Plano</option>
              {plans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          {/* Reset filters */}
          <div className="flex items-center">
            <button
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F]"
              onClick={() => onFilterChange({
                classificacao: [],
                coparticipacao: null,
                nomePlano: [],
                searchQuery: ''
              })}
            >
              <Filter className="h-4 w-4 inline mr-2" />
              Limpar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;