import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Filters from './components/Filters';
import Table from './components/Table';
import PartnersSection from './components/PartnersSection';
import { fetchProcedureData, fetchPartnersData } from './services/api';
import { getUniqueValues, filterData } from './utils/filterUtils';
import { FilterState, ProcedureData, PartnerData } from './types';

function App() {
  const [data, setData] = useState<ProcedureData[]>([]);
  const [partnersData, setPartnersData] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true); // For procedures
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For procedures
  const [partnersError, setPartnersError] = useState<string | null>(null);
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
      // Load Procedures
      try {
        setLoading(true);
        const procedureDataResult = await fetchProcedureData();
        setData(procedureDataResult);
        setError(null);
      } catch (err) {
        console.error('Error fetching procedure data:', err);
        setError('Falha ao carregar os dados de procedimentos.');
      } finally {
        setLoading(false);
      }

      // Load Partners
      try {
        setPartnersLoading(true);
        const partnerDataResult = await fetchPartnersData();
        setPartnersData(partnerDataResult);
        setPartnersError(null);
      } catch (err) {
        console.error('Error fetching partner data:', err);
        setPartnersError('Falha ao carregar os dados de parceiros.');
        // Not setting global error, so procedure table can still show if partners fail
      } finally {
        setPartnersLoading(false);
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
          {/* Title for procedures table is now part of the structure above */}


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

          {/* Filters for procedures are now placed after the procedure table title */}

          <div className="mb-4 text-sm text-gray-500">
            {loading ? (
              "Carregando dados de procedimentos..."
            ) : (
              `Exibindo ${filteredData.length} de ${data.length} procedimentos`
            )}
            {/* Placeholder for partners loading/count */}
            {partnersLoading && <p className="text-sm text-gray-500 mt-1">Carregando dados de parceiros...</p>}
            {!partnersLoading && partnersError && <p className="text-sm text-red-500 mt-1">{partnersError}</p>}
            {/* Partner count message removed, as tables will show counts or 'no data' messages */}
          </div>

          <PartnersSection partnersData={partnersData} isLoading={partnersLoading} />

          <hr className="my-12 border-gray-300" /> {/* Visual separator */}

          <div className="mb-8" id="table-coparticipacao"> {/* Changed id to be more specific */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tabela de Coparticipação
            </h2>
            <p className="text-gray-600">
              Consulte os valores de coparticipação para todos os procedimentos médicos disponíveis nos planos Sami.
            </p>
          </div>

          {/* Filters for Procedures Table - already existing */}
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            classifications={classifications}
            plans={plans} // This plans is derived from procedureData, might need adjustment if global plan filter is desired
          />

          <div className="mb-4 text-sm text-gray-500">
            {loading ? (
              "Carregando dados de procedimentos..."
            ) : (
              `Exibindo ${filteredData.length} de ${data.length} procedimentos`
            )}
            {partnersLoading && <p className="text-sm text-gray-500 mt-1">Carregando dados de parceiros...</p>}
            {!partnersLoading && partnersError && <p className="text-sm text-red-500 mt-1">{partnersError}</p>}
            {/* Removed partner count from here as it's implicitly shown by the tables themselves */}
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