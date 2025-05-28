import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface ProcedureData {
  codigoProcedimento: string;
  classificacao: string;
  coparticipacao: boolean;
  regraIsencao: string;
  percentualProcedimento: number;
  preferencialCredenciada: string;
  nomePlano: string;
}

// Helper function to transform sheet data into ProcedureData array
const formatSheetData = (values: any[][]): ProcedureData[] => {
  if (!values || values.length < 2) {
    // Expecting header row + data rows
    return [];
  }

  const header = values[0].map(h => String(h).trim());
  const dataRows = values.slice(1);

  // Define a mapping from expected header names to ProcedureData keys
  // This makes it resilient to column order changes as long as headers are consistent
  const headerMap: { [key: string]: keyof ProcedureData } = {
    'Código': 'codigoProcedimento',
    'Classificação dos Procedimentos': 'classificacao',
    'Coparticipação Sim/Não': 'coparticipacao',
    // 'Sua Coluna para Regra de Isenção': 'regraIsencao', // Descomente e ajuste se tiver esta coluna
    '% Valor do Procedimento': 'percentualProcedimento',
    // 'Sua Coluna para Preferencial Credenciada': 'preferencialCredenciada', // Descomente e ajuste se tiver esta coluna
    'Nome do Plano': 'nomePlano',
    // O campo 'Procedimentos' e 'Valor Limitador' da sua planilha não estão sendo mapeados para ProcedureData atualmente.
    // Se precisar deles, adicione-os à interface ProcedureData e ao headerMap.
  };

  return dataRows.map(row => {
    const item: any = {};
    header.forEach((colName, index) => {
      const key = headerMap[colName] || colName; // Use mapped key or original if not in map
      if (key in headerMap) { // Only map recognized headers
        item[key] = row[index];
      }
    });

    return {
      codigoProcedimento: String(item.codigoProcedimento || ''),
      classificacao: String(item.classificacao || ''),
      coparticipacao: String(item.coparticipacao).toLowerCase() === 'true' || item.coparticipacao === true,
      regraIsencao: String(item.regraIsencao || ''),
      percentualProcedimento: Number(item.percentualProcedimento) || 0,
      preferencialCredenciada: String(item.preferencialCredenciada || ''),
      nomePlano: String(item.nomePlano || ''),
    } as ProcedureData;
  }).filter(item => item.codigoProcedimento); // Ensure at least codigoProcedimento is present
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.SPREADSHEET_ID;
  const range = process.env.SPREADSHEET_RANGE;

  if (!apiKey || !sheetId || !range) {
    return response.status(500).json({
      error: 'Missing Google Sheets API configuration in environment variables.',
    });
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const sheetResponse = await axios.get(url);
    const values = sheetResponse.data.values;

    if (!values) {
      return response.status(404).json({ error: 'No data found in spreadsheet or range is invalid.' });
    }

    const formattedData = formatSheetData(values);
    
    // Basic Caching Headers (Vercel specific or general)
    // Cache for 5 minutes on CDN, 1 hour on client browser
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600, public');

    return response.status(200).json(formattedData);
  } catch (error: any) {
    console.error('Error fetching from Google Sheets:', error.message);
    if (axios.isAxiosError(error) && error.response) {
        console.error('Google Sheets API Error Response:', error.response.data);
        return response.status(error.response.status || 500).json({
            message: 'Failed to fetch data from Google Sheets.',
            details: error.response.data.error?.message || error.message,
        });
    }
    return response.status(500).json({
      message: 'Failed to fetch data from Google Sheets.',
      details: error.message,
    });
  }
}
