import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ProcedureData } from '../types';

interface TableProps {
  data: ProcedureData[];
  isLoading: boolean;
}

type SortField = keyof ProcedureData | null;
type SortDirection = 'asc' | 'desc';

const Table: React.FC<TableProps> = ({ data, isLoading }) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: keyof ProcedureData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc' 
          ? Number(aValue) - Number(bValue) 
          : Number(bValue) - Number(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: keyof ProcedureData }) => {
    if (sortField !== field) return <div className="w-4" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline-block" />
    ) : (
      <ChevronDown className="h-4 w-4 inline-block" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">Nenhum procedimento encontrado com os filtros selecionados.</p>
        <p className="text-sm mt-2">Tente ajustar seus filtros ou realizar uma nova busca.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigoProcedimento')}>
                <div className="flex items-center"><span>Código</span><SortIcon field="codigoProcedimento" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('procedimento')}>
                <div className="flex items-center"><span>Procedimentos</span><SortIcon field="procedimento" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('classificacao')}>
                <div className="flex items-center"><span>Classificação dos Procedimentos</span><SortIcon field="classificacao" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('coparticipacao')}>
                <div className="flex items-center"><span>Coparticipação Sim/Não</span><SortIcon field="coparticipacao" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('regraIsencao')}>
                <div className="flex items-center"><span>Regra de Isenção</span><SortIcon field="regraIsencao" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('percentualProcedimento')}>
                <div className="flex items-center"><span>% Valor do Procedimento</span><SortIcon field="percentualProcedimento" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('valorLimitador')}>
                <div className="flex items-center"><span>Valor Limitador</span><SortIcon field="valorLimitador" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('preferencialCredenciada')}>
                <div className="flex items-center"><span>Preferencial Credenciada</span><SortIcon field="preferencialCredenciada" /></div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('nomePlano')}>
                <div className="flex items-center"><span>Nome do Plano</span><SortIcon field="nomePlano" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={`${item.codigoProcedimento}-${index}-${item.nomePlano}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.codigoProcedimento}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.procedimento}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.classificacao}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.coparticipacao ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {item.coparticipacao ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.regraIsencao}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.percentualProcedimento > 0 ? `${item.percentualProcedimento}%` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.valorLimitador}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.preferencialCredenciada}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.nomePlano.includes('Premium') ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.nomePlano}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;