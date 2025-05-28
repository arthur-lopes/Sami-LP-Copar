import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface PartnerData {
  nomeParceiro: string;
  tipo: string; // "Hospital" ou "Laboratório"
  tipoRede: string;
  nomePlano: string;
}

// Helper function to transform sheet data into PartnerData array
const formatPartnerData = (values: any[][]): PartnerData[] => {
  if (!values || values.length < 2) {
    return [];
  }

  const header = values[0].map(h => String(h).trim());
  const dataRows = values.slice(1);

  const headerMap: { [key: string]: keyof PartnerData } = {
    'Nome do Parceiro': 'nomeParceiro',
    'Tipo': 'tipo',
    'Tipo de Rede': 'tipoRede',
    'Nome do Plano': 'nomePlano',
  };

  const mappedData = dataRows.map(row => {
    const item: any = {};
    header.forEach((colName, index) => {
      const mappedKey = headerMap[colName];
      if (mappedKey) {
        item[mappedKey] = row[index];
      }
    });

    const transformedItem = {
      nomeParceiro: String(item.nomeParceiro || '').trim(),
      tipo: String(item.tipo || '').trim(),
      tipoRede: String(item.tipoRede || '').trim(),
      nomePlano: String(item.nomePlano || '').trim(),
    } as PartnerData;
    return transformedItem;
  });

  return mappedData.filter(item => item.nomeParceiro && item.tipo); // Ensure at least partner name and type are present
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  // IMPORTANT: User needs to set SPREADSHEET_RANGE_PARTNERS in Vercel environment variables (e.g., Página2!A1:D)
  const range = process.env.SPREADSHEET_RANGE_PARTNERS; 

  if (!apiKey || !spreadsheetId || !range) {
    return response.status(500).json({ error: 'API configuration is incomplete.' });
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  try {
    const sheetResponse = await axios.get(url);
    const values = sheetResponse.data.values;

    if (!values || values.length === 0) {
      return response.status(404).json({ error: 'No data found in partner spreadsheet or range is invalid.' });
    }

    const formattedData = formatPartnerData(values);
    
    response.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes

    return response.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching partner data from Google Sheets:', error);
    let errorMessage = 'Failed to fetch data.';
    if (axios.isAxiosError(error) && error.response) {
        console.error('Error details:', JSON.stringify(error.response.data));
        errorMessage = error.response.data?.error?.message || errorMessage;
    }
    return response.status(500).json({ error: errorMessage });
  }
}
