export interface ProcedureData {
  codigoProcedimento: string;
  classificacao: string;
  coparticipacao: boolean;
  regraIsencao: string;
  percentualProcedimento: number;
  preferencialCredenciada: string;
  nomePlano: string;
}

export interface FilterState {
  classificacao: string[];
  coparticipacao: boolean | null;
  nomePlano: string[];
  searchQuery: string;
}