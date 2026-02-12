import { supabase, handleError } from './api.js';

const API_KEY = (import.meta as any).env?.VITE_GOOGLE_SHEETS_API_KEY || '';

export const googleSheetService = {
  extractSheetId(url: string) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  },

  async previewSheet(url: string, tabName: string = 'Sheet1') {
    try {
      const sheetId = this.extractSheetId(url);
      if (!sheetId) throw new Error("Invalid Google Sheets URL");

      if (!API_KEY) {
        // Mock data for demo purposes if no API Key
        console.warn("No Google Sheets API Key found. Returning mock data.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          sheet_id: sheetId,
          headers: ['Name', 'Email', 'Phone', 'Company', 'Title', 'Value'],
          sample_rows: [
            ['John Doe', 'john@acme.com', '555-0123', 'Acme Corp', 'CEO', '5000'],
            ['Jane Smith', 'jane@beta.io', '555-0124', 'Beta Inc', 'CTO', '8500'],
            ['Bob Jones', 'bob@gamma.net', '555-0125', 'Gamma LLC', 'VP Sales', '12000'],
          ],
          total_rows: 45
        };
      }

      // Real fetch if API key exists
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}?key=${API_KEY}`
      );
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Failed to fetch sheet");
      }

      const data = await response.json();
      const rows = data.values || [];
      if (rows.length === 0) throw new Error("Sheet is empty");

      return {
        sheet_id: sheetId,
        headers: rows[0],
        sample_rows: rows.slice(1, 6),
        total_rows: rows.length - 1
      };
    } catch (error: any) {
      console.error("Sheet Fetch Error", error);
      throw new Error(error.message);
    }
  },

  async saveConnection(connectionData: any) {
    try {
      const { data, error } = await supabase.from('google_sheet_connections').insert([connectionData]).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error);
    }
  }
};