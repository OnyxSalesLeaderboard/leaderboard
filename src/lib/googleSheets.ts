import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

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
    let auth;
    
    // Check if we're in a deployment environment (Vercel)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Use environment variable for deployed environments
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
    } else {
      // Use local file for development
      const credentialsPath = path.join(process.cwd(), 'credentials.json');
      if (fs.existsSync(credentialsPath)) {
        auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
      } else {
        throw new Error('Google Sheets credentials not found. Please check your configuration.');
      }
    }

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
