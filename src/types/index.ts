export interface ProcedureData {
  codigoProcedimento: string;
  procedimento: string; // Added
  classificacao: string;
  coparticipacao: boolean;
  regraIsencao: string;
  percentualProcedimento: number;
  valorLimitador: string; // Added
  preferencialCredenciada: string;
  nomePlano: string;
}

export interface FilterState {
  classificacao: string[];
  coparticipacao: boolean | null;
  nomePlano: string[];
  searchQuery: string;
}

export interface PartnerData {
  nomeParceiro: string;
  tipo: string; // "Hospital" ou "Laboratório"
  tipoRede: string;
  nomePlano: string;
}