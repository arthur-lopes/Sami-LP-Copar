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

          <PartnersSection partnersData={partnersData} isLoading={partnersLoading} />

          <hr className="my-12 border-gray-300" /> {/* Visual separator */}

          <div className="my-12 scroll-mt-20" id="coparticipacao-section">
            <div className="w-full">
              <h2 className="text-3xl font-bold text-[#FF5A5F] mb-4">
                Tabela de Coparticipação
              </h2>
              <p className="text-gray-600 mb-6">
                Consulte os valores de coparticipação para todos os procedimentos médicos disponíveis nos planos Sami.
              </p>
              
              <h3 className="text-2xl font-bold text-[#FF5A5F] mb-4">
                Entendendo a Coparticipação
              </h3>
              <p className="mb-4 text-gray-600 leading-relaxed">
                A Coparticipação é um valor pago pelo beneficiário de um plano de saúde quando realiza algum
                procedimento. Em um plano com coparticipação, você paga uma mensalidade menor que a de um plano
                convencional mais uma taxa para cada procedimento realizado que vem na fatura do plano. Esse valor
                pode ser cobrado em um prazo de 60 a 180 dias. Para maior segurança do membro, existe um limite de
                cobrança definido por lei, conhecido como Limitador de Coparticipação.
              </p>
              <h4 className="text-xl font-semibold text-[#FF5A5F] mb-3">
                Limitador de Coparticipação
              </h4>
              <p className="mb-4 text-gray-600 leading-relaxed">
                O limitador é um valor máximo mensal estabelecido para realização de cada
                procedimento em planos com coparticipação.
              </p>
              <p className="mb-8 text-gray-600 leading-relaxed">
                Vale reforçar: o cálculo de quanto você pagará de coparticipação, é feito em cima de uma porcentagem de
                20% até 40%, por serviço médico. No entanto, existe um limite de preço que não pode ultrapassar para cada
                grupo de procedimento, sendo o valor mínimo de R$10 e valor máximo de R$80.
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

            <Table 
              data={filteredData} 
              isLoading={loading} 
              selectedPlan={filters.nomePlano.length > 0 ? filters.nomePlano[0] : undefined}
              emptyMessage="Selecione um plano para visualizar os procedimentos disponíveis."
            />

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
        </div>
      </main>
    </div>
  );
}

export default App;