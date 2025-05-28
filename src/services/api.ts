import { ProcedureData, PartnerData } from '../types';

export const fetchProcedureData = async (): Promise<ProcedureData[]> => {
  try {
    const response = await fetch('/api/getProcedures'); // Calls the serverless function
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data: ProcedureData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch procedure data:', error);
    // You might want to re-throw the error or return a default/empty state
    // depending on how App.tsx handles errors.
    // For now, re-throwing to let App.tsx handle it.
    throw error;
  }
};

export const fetchPartnersData = async (): Promise<PartnerData[]> => {
  try {
    const response = await fetch('/api/getPartners'); // Calls the new serverless function
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('API Error Response (Partners):', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data: PartnerData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch partner data:', error);
    throw error; // Re-throw to let the caller handle it
  }
};