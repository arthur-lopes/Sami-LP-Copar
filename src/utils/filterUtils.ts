import { ProcedureData, FilterState } from '../types';

export const getUniqueValues = (data: ProcedureData[], key: keyof ProcedureData): string[] => {
  const values = new Set<string>();
  
  data.forEach(item => {
    if (typeof item[key] === 'string') {
      values.add(item[key] as string);
    }
  });
  
  return Array.from(values).sort();
};

export const filterData = (data: ProcedureData[], filters: FilterState): ProcedureData[] => {
  return data.filter(item => {
    // Filter by classification
    if (filters.classificacao.length > 0 && !filters.classificacao.includes(item.classificacao)) {
      return false;
    }
    
    // Filter by coparticipacao
    if (filters.coparticipacao !== null && item.coparticipacao !== filters.coparticipacao) {
      return false;
    }
    
    // Filter by plan name
    if (filters.nomePlano.length > 0 && !filters.nomePlano.includes(item.nomePlano)) {
      return false;
    }
    
    // Search query (check in code, classification, and exemption rule)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        item.codigoProcedimento.toLowerCase().includes(query) ||
        item.classificacao.toLowerCase().includes(query) ||
        item.regraIsencao.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};