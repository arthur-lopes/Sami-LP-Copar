import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Filters from './components/Filters';
import Table from './components/Table';
import { fetchProcedureData } from './services/api';
import { getUniqueValues, filterData } from './utils/filterUtils';
import { FilterState, ProcedureData } from './types';

function App() {
  const [data, setData] = useState<ProcedureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    classificacao: [],
    coparticipacao: null,
    nomePlano: [],
    searchQuery: '',
  });

  // Derived values
  const classifications = data.length > 0 ? getUniqueValues(data, 'classificacao') : [];
  const plans = data.length > 0 ? getUniqueValues(data, 'nomePlano') : [];
  const filteredData = filterData(data, filters);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const procedureData = await fetchProcedureData();
        setData(procedureData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Falha ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Hero />
      
      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8" id="table">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tabela de Coparticipação
            </h2>
            <p className="text-gray-600">
              Consulte os valores de coparticipação para todos os procedimentos médicos disponíveis nos planos Sami.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            classifications={classifications}
            plans={plans}
          />

          <div className="mb-4 text-sm text-gray-500">
            {loading ? (
              "Carregando dados..."
            ) : (
              `Exibindo ${filteredData.length} de ${data.length} procedimentos`
            )}
          </div>

          <Table data={filteredData} isLoading={loading} />

          {!loading && filteredData.length > 10 && (
            <div className="mt-8 text-center">
              <a
                href="#table"
                className="inline-flex items-center text-sm text-[#FF5A5F] hover:underline"
              >
                Voltar ao topo
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;