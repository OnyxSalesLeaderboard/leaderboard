import { google } from 'googleapis';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  ytdSales: number;
  mtdSales: number;
  wtdSales: number;
}

export type FilterType = 'YTD' | 'MTD' | 'WTD';

class GoogleSheetsService {
  private sheets: ReturnType<typeof google.sheets>;

  constructor() {
    // Use environment variables only
    console.log('Initializing Google Sheets Service...');
    console.log('Environment check:', {
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKeyId: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    });

    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      const missingVars = [];
      if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      if (!process.env.GOOGLE_PRIVATE_KEY_ID) missingVars.push('GOOGLE_PRIVATE_KEY_ID');
      
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    try {
      const credentials = {
        type: 'service_account',
        project_id: 'onyx-leaderboard',
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: '108868370823932998885',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)}`,
        universe_domain: 'googleapis.com'
      };

      console.log('Credentials object created with email:', credentials.client_email);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('Google Sheets service initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Sheets service:', error);
      throw error;
    }
  }

  async getLeaderboardData(spreadsheetId: string): Promise<LeaderboardEntry[]> {
    try {
      console.log('Fetching data from spreadsheet:', spreadsheetId);
      console.log('Using range: All Reps!A:R');

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'All Reps!A:R',
      });

      console.log('API Response status:', response.status);
      console.log('Response data keys:', Object.keys(response.data || {}));

      const rows = response.data.values;
      console.log('Rows received:', rows ? rows.length : 0);
      
      if (!rows || rows.length === 0) {
        console.log('No data found in spreadsheet');
        return [];
      }

      console.log('First few rows:', rows.slice(0, 3));

      // Skip header row and process data
      const dataRows = rows.slice(1);
      const leaderboardData: LeaderboardEntry[] = [];

      dataRows.forEach((row: string[], index: number) => {
        console.log(`Processing row ${index + 1}:`, row);
        if (row.length >= 6) {
          const entry: LeaderboardEntry = {
            rank: index + 1,
            name: row[0] || '', // Name is in column A (index 0)
            ytdSales: parseFloat(row[3]) || 0, // Column D (YTD)
            mtdSales: parseFloat(row[4]) || 0, // Column E (MTD)
            wtdSales: parseFloat(row[5]) || 0, // Column F (WTD)
          };
          leaderboardData.push(entry);
          console.log('Created entry:', entry);
        } else {
          console.log(`Row ${index + 1} skipped - insufficient columns:`, row.length);
        }
      });

      console.log('Final leaderboard data:', leaderboardData.length, 'entries');
      return leaderboardData;
    } catch (error) {
      console.error('Detailed error fetching data from Google Sheets:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        spreadsheetId,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Failed to fetch leaderboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  sortByFilter(data: LeaderboardEntry[], filter: FilterType): LeaderboardEntry[] {
    const sortedData = [...data].sort((a, b) => {
      switch (filter) {
        case 'YTD':
          return b.ytdSales - a.ytdSales;
        case 'MTD':
          return b.mtdSales - a.mtdSales;
        case 'WTD':
          return b.wtdSales - a.wtdSales;
        default:
          return 0;
      }
    });

    // Update ranks after sorting
    return sortedData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  getSalesValue(entry: LeaderboardEntry, filter: FilterType): number {
    switch (filter) {
      case 'YTD':
        return entry.ytdSales;
      case 'MTD':
        return entry.mtdSales;
      case 'WTD':
        return entry.wtdSales;
      default:
        return 0;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
