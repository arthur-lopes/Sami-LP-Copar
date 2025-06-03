import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ProcedureData } from '../types';

interface TableProps {
  data: ProcedureData[];
  isLoading: boolean;
  selectedPlan?: string; // Added to track if a plan is selected
  emptyMessage?: string; // Custom message when no data or no plan selected
}

type SortField = keyof ProcedureData | null;
type SortDirection = 'asc' | 'desc';

const Table: React.FC<TableProps> = ({ data, isLoading, selectedPlan, emptyMessage }) => {
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

  // Check if any column has all blank values
  const columnsWithValues = React.useMemo(() => {
    const columns: Record<keyof ProcedureData, boolean> = {} as Record<keyof ProcedureData, boolean>;
    
    // Initialize all columns as having no values
    Object.keys(data[0] || {}).forEach(key => {
      // Always hide the nomePlano column
      if (key === 'nomePlano') {
        columns[key as keyof ProcedureData] = false;
      } else {
        columns[key as keyof ProcedureData] = false;
      }
    });
    
    // Check each column for non-empty values
    data.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        // Skip the nomePlano column
        if (key === 'nomePlano') return;
        
        // For other columns, check if they have values
        // Check if the value is not empty, null, undefined, or zero
        // For strings that might represent numbers (like "0", "0.0"), convert to number first
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (
          value !== undefined && 
          value !== null && 
          value !== '' && 
          (typeof numericValue !== 'number' || numericValue !== 0)
        ) {
          columns[key as keyof ProcedureData] = true;
        }
      });
    });
    
    return columns;
  }, [data]);

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
      
      const aString = (aValue ? String(aValue) : '').toLowerCase();
      const bString = (bValue ? String(bValue) : '').toLowerCase();
      
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

  // If no plan is selected, show a message
  if (!selectedPlan) {
    return (
      <div>
        <div className="bg-white border-l-4 border-gray-400 p-4 mb-6 shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                {emptyMessage || "Selecione um plano para visualizar os procedimentos disponíveis."}
              </p>
            </div>
          </div>
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
              {columnsWithValues.codigoProcedimento && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigoProcedimento')}>
                  <div className="flex items-center"><span>Código</span><SortIcon field="codigoProcedimento" /></div>
                </th>
              )}
              {columnsWithValues.procedimento && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('procedimento')}>
                  <div className="flex items-center"><span>Procedimentos</span><SortIcon field="procedimento" /></div>
                </th>
              )}
              {columnsWithValues.classificacao && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('classificacao')}>
                  <div className="flex items-center"><span>Classificação dos Procedimentos</span><SortIcon field="classificacao" /></div>
                </th>
              )}
              {columnsWithValues.coparticipacao && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('coparticipacao')}>
                  <div className="flex items-center"><span>Copart</span><SortIcon field="coparticipacao" /></div>
                </th>
              )}
              {columnsWithValues.regraIsencao && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('regraIsencao')}>
                  <div className="flex items-center"><span>Regra de Isenção</span><SortIcon field="regraIsencao" /></div>
                </th>
              )}
              {columnsWithValues.percentualProcedimento && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('percentualProcedimento')}>
                  <div className="flex items-center"><span>% Valor do Procedimento</span><SortIcon field="percentualProcedimento" /></div>
                </th>
              )}
              {columnsWithValues.valorLimitador && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('valorLimitador')}>
                  <div className="flex items-center"><span>Valor Limitador</span><SortIcon field="valorLimitador" /></div>
                </th>
              )}
              {columnsWithValues.preferencialCredenciada && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('preferencialCredenciada')}>
                  <div className="flex items-center"><span>Valor Rede Preferencial</span><SortIcon field="preferencialCredenciada" /></div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={`${item.codigoProcedimento}-${index}-${item.nomePlano}`} className="hover:bg-gray-50 transition-colors">
                {columnsWithValues.codigoProcedimento && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.codigoProcedimento}</td>
                )}
                {columnsWithValues.procedimento && (
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.procedimento.split(' ').length > 3 ? (
                      <div className="whitespace-normal">{item.procedimento}</div>
                    ) : (
                      <div className="whitespace-nowrap">{item.procedimento}</div>
                    )}
                  </td>
                )}
                {columnsWithValues.classificacao && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.classificacao}</td>
                )}
                {columnsWithValues.coparticipacao && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.coparticipacao ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {item.coparticipacao ? 'Sim' : 'Não'}
                    </span>
                  </td>
                )}
                {columnsWithValues.regraIsencao && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.regraIsencao}</td>
                )}
                {columnsWithValues.percentualProcedimento && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.percentualProcedimento > 0 ? `${item.percentualProcedimento}%` : '-'}
                  </td>
                )}
                {columnsWithValues.valorLimitador && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.valorLimitador}</td>
                )}
                {columnsWithValues.preferencialCredenciada && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.preferencialCredenciada}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;