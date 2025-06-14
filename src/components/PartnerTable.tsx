import React, { useState, useMemo } from 'react';
import { PartnerData } from '../types';

interface PartnerTableProps {
  data: PartnerData[];
  title: string;
  isLoading: boolean;
  emptyMessage?: string; // Custom message to display when no data is available
  // Add other props like filters if they become specific to this table
}

const SortIcon: React.FC<{ field: keyof PartnerData | null, currentSortField: keyof PartnerData | null, direction: 'asc' | 'desc' }> = ({ field, currentSortField, direction }) => {
  if (currentSortField !== field) {
    return <span className="ml-1 text-gray-400">↕</span>; // Default icon
  }
  return <span className="ml-1">{direction === 'asc' ? '▲' : '▼'}</span>;
};

const PartnerTable: React.FC<PartnerTableProps> = ({ data, title, isLoading, emptyMessage }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof PartnerData; direction: 'asc' | 'desc' } | null>({ key: 'nomeParceiro', direction: 'asc' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Custom sort: 'Preferencial' always first for 'tipoRede'
        if (a.tipoRede === 'Preferencial' && b.tipoRede !== 'Preferencial') return -1;
        if (a.tipoRede !== 'Preferencial' && b.tipoRede === 'Preferencial') return 1;

        // Then sort by the selected key
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const handleSort = (key: keyof PartnerData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600">Carregando dados dos parceiros...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="bg-white border-l-4 border-gray-400 p-4 mb-6 shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                {emptyMessage || `Nenhum dado encontrado para ${title.toLowerCase()}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('nomeParceiro')}>
                <div className="flex items-center">Nome do Parceiro<SortIcon field="nomeParceiro" currentSortField={sortConfig?.key || null} direction={sortConfig?.direction || 'asc'} /></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={`${item.nomeParceiro}-${item.nomePlano}-${index}`} className={`hover:bg-gray-50 transition-colors ${item.tipoRede === 'Preferencial' ? 'bg-green-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center">
                    <span className={`${item.tipoRede === 'Preferencial' ? 'text-green-700 font-semibold' : 'text-gray-900'}`}>{item.nomeParceiro}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.tipoRede === 'Preferencial' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.tipoRede}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedData.length === 0 && (
        <p className="text-center text-gray-500 py-4">Nenhum parceiro encontrado com os filtros atuais.</p>
      )}
    </div>
  );
};

export default PartnerTable;
