import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface ProcedureData {
  codigoProcedimento: string;
  procedimento: string; // Corresponds to 'Procedimentos'
  classificacao: string;
  coparticipacao: boolean;
  regraIsencao: string;
  percentualProcedimento: number;
  valorLimitador: string; // Added back
  preferencialCredenciada: string;
  nomePlano: string;
}

// Helper function to transform sheet data into ProcedureData array
const formatSheetData = (values: any[][]): ProcedureData[] => {
  console.log('[API LOG] formatSheetData called.');
  if (!values || values.length < 2) {
    // Expecting header row + data rows
    return [];
  }

  console.log('[API LOG] Raw values length:', values.length);
  if (values.length > 0) {
    console.log('[API LOG] Raw header from sheet:', JSON.stringify(values[0]));
  }
  if (values.length > 1) {
    console.log('[API LOG] First data row from sheet:', JSON.stringify(values[1]));
  }

  const header = values[0].map(h => String(h).trim());
  const dataRows = values.slice(1);
  console.log('[API LOG] Parsed header:', JSON.stringify(header));

  // Define a mapping from expected header names to ProcedureData keys
  // This makes it resilient to column order changes as long as headers are consistent
  const headerMap: { [key: string]: keyof ProcedureData } = {
    'Código': 'codigoProcedimento',
    'Procedimentos': 'procedimento',
    'Classificação dos Procedimentos': 'classificacao',
    'Coparticipação Sim/Não': 'coparticipacao',
    'Regra de Isenção': 'regraIsencao',
    '% Valor do Procedimento': 'percentualProcedimento',
    'Valor Limitador': 'valorLimitador', // Added back
    'Preferencial Credenciada': 'preferencialCredenciada',
    'Nome do Plano': 'nomePlano',
  };

  const mappedData = dataRows.map(row => {
    const item: any = {};
    // console.log(`[API LOG] Processing row: ${JSON.stringify(row)}`); // Log para cada linha (pode ser muito verboso)
    header.forEach((colName, index) => {
      const mappedKey = headerMap[colName]; // Get the target key from our map, e.g., 'codigoProcedimento'
      if (mappedKey) { // Check if colName (e.g., 'Código') exists as a key in headerMap
        item[mappedKey] = row[index]; // Assign to item using the mapped key: item['codigoProcedimento'] = ...
      }
    });

    const transformedItem = {
      codigoProcedimento: String(item.codigoProcedimento || '').trim(),
      procedimento: String(item.procedimento || '').trim(),
      classificacao: String(item.classificacao || '').trim(),
      coparticipacao: String(item.coparticipacao || '').trim().toLowerCase() === 'sim',
      regraIsencao: String(item.regraIsencao || '').trim(),
      percentualProcedimento: parseFloat(String(item.percentualProcedimento || '0').replace('%', '')) || 0,
      valorLimitador: String(item.valorLimitador || '').trim(), // Added back
      preferencialCredenciada: String(item.preferencialCredenciada || '').trim(),
      nomePlano: String(item.nomePlano || '').trim(),
    } as ProcedureData;
    // console.log(`[API LOG] Transformed item: ${JSON.stringify(transformedItem)}`); // Log para cada item transformado
    return transformedItem;
  });

  console.log('[API LOG] Number of items after map:', mappedData.length);
  if (mappedData.length > 0) {
    console.log('[API LOG] First item after map (before filter):', JSON.stringify(mappedData[0]));
  }

  const filteredData = mappedData.filter((item: ProcedureData) => item.codigoProcedimento && String(item.codigoProcedimento).trim() !== '');
  console.log('[API LOG] Number of items after filter:', filteredData.length);
  if (filteredData.length > 0) {
    console.log('[API LOG] First item after filter:', JSON.stringify(filteredData[0]));
  }
  return filteredData;
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

    console.log('[API LOG] Attempting to format sheet data...');
    const formattedData = formatSheetData(values);
    console.log(`[API LOG] Formatted data ready to send. Count: ${formattedData.length}`);
    if (formattedData.length > 0) {
      console.log('[API LOG] First item of formattedData to send:', JSON.stringify(formattedData[0]));
    }
    
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
