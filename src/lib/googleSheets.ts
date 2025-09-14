import { google } from 'googleapis';
import path from 'path';

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
    // Use environment variables for production deployment
    let credentials;
    
    if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      // Production environment - use environment variables
      credentials = {
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
    } else {
      // Development environment - use credentials file
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        credentials = require(path.join(process.cwd(), 'credentials.json'));
      } catch (error) {
        throw new Error('Google service account credentials not found. Please check your environment variables or credentials.json file.');
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getLeaderboardData(spreadsheetId: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'All Reps!A:R',
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Skip header row and process data
      const dataRows = rows.slice(1);
      const leaderboardData: LeaderboardEntry[] = [];

      dataRows.forEach((row: string[], index: number) => {
        if (row.length >= 6) {
          const entry: LeaderboardEntry = {
            rank: index + 1,
            name: row[0] || '', // Name is in column A (index 0)
            ytdSales: parseFloat(row[3]) || 0, // Column D (YTD)
            mtdSales: parseFloat(row[4]) || 0, // Column E (MTD)
            wtdSales: parseFloat(row[5]) || 0, // Column F (WTD)
          };
          leaderboardData.push(entry);
        }
      });

      return leaderboardData;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      throw new Error('Failed to fetch leaderboard data');
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
