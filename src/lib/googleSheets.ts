import { google } from 'googleapis';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  teamName: string;
  // Submitted columns (D, E, F, G)
  submittedYtd: number;
  submittedMtd: number;
  submittedWtd: number;
  submittedYesterday: number;
  // Verified columns (H, I, J)
  verifiedYtd: number;
  verifiedMtd: number;
  verifiedWtd: number;
  // Installed columns (K, L)
  installedYtd: number;
  installedMtd: number;
  // Legacy fields for backward compatibility
  ytdSales: number;
  mtdSales: number;
  wtdSales: number;
  yesterdaySales: number;
}

export type TopLevelFilter = 'SUBMITTED' | 'VERIFIED' | 'INSTALLED';
export type SecondLevelFilter = 'YTD' | 'MTD' | 'WTD' | 'YESTERDAY';

export interface FilterState {
  topLevel: TopLevelFilter;
  secondLevel: SecondLevelFilter;
}

// Legacy type for backward compatibility
export type FilterType = 'YTD' | 'MTD' | 'WTD' | 'YESTERDAY';

class GoogleSheetsService {
  private sheets: ReturnType<typeof google.sheets>;

  constructor() {
    // Use environment variables only
    console.log('Initializing Google Sheets Service...');
    console.log('Environment check:', {
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasPrivateKeyBase64: !!process.env.GOOGLE_PRIVATE_KEY_BASE64,
      hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKeyId: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    });

    if ((!process.env.GOOGLE_PRIVATE_KEY && !process.env.GOOGLE_PRIVATE_KEY_BASE64) || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      const missingVars = [];
      if (!process.env.GOOGLE_PRIVATE_KEY && !process.env.GOOGLE_PRIVATE_KEY_BASE64) missingVars.push('GOOGLE_PRIVATE_KEY or GOOGLE_PRIVATE_KEY_BASE64');
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      if (!process.env.GOOGLE_PRIVATE_KEY_ID) missingVars.push('GOOGLE_PRIVATE_KEY_ID');
      
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    try {
      // Handle private key from either regular or base64 format
      let privateKey: string;
      
      if (process.env.GOOGLE_PRIVATE_KEY_BASE64) {
        console.log('Using base64 encoded private key');
        try {
          privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
          console.log('Base64 decode successful');
        } catch (base64Error) {
          throw new Error('Failed to decode base64 private key');
        }
      } else if (process.env.GOOGLE_PRIVATE_KEY) {
        console.log('Using regular private key format');
        privateKey = process.env.GOOGLE_PRIVATE_KEY;
        
        console.log('Raw private key info:', {
          length: privateKey.length,
          startsWithQuote: privateKey.startsWith('"'),
          endsWithQuote: privateKey.endsWith('"'),
          hasEscapedNewlines: privateKey.includes('\\n'),
          hasActualNewlines: privateKey.includes('\n'),
          firstChars: privateKey.substring(0, 30),
          lastChars: privateKey.substring(privateKey.length - 30)
        });
        
        // Remove quotes if present
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
          console.log('Removed surrounding quotes');
        }
        
        // Replace escaped newlines with actual newlines
        if (privateKey.includes('\\n')) {
          privateKey = privateKey.replace(/\\n/g, '\n');
          console.log('Replaced escaped newlines');
        }
      } else {
        throw new Error('No private key found in environment variables');
      }
      
      // Ensure proper formatting
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Private key does not contain proper BEGIN marker');
      }
      if (!privateKey.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Private key does not contain proper END marker');
      }
      
      console.log('Final private key format check:', {
        hasBeginMarker: privateKey.includes('-----BEGIN PRIVATE KEY-----'),
        hasEndMarker: privateKey.includes('-----END PRIVATE KEY-----'),
        length: privateKey.length,
        startsCorrectly: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
        endsCorrectly: privateKey.endsWith('-----END PRIVATE KEY-----\n') || privateKey.endsWith('-----END PRIVATE KEY-----'),
        lineCount: privateKey.split('\n').length
      });

      const credentials = {
        type: 'service_account',
        project_id: 'onyx-leaderboard',
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
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
      console.log('Using range: Reps!A:R');

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Reps!A:R',
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
        if (row.length >= 12) { // Ensure we have at least 12 columns (A-L)
          const name = row[1] || ''; // Column B (index 1)
          const teamName = row[2] || ''; // Column C (index 2)
          
          // Submitted columns (D, E, F, G)
          const submittedYtd = parseFloat(row[3]) || 0; // Column D (index 3)
          const submittedMtd = parseFloat(row[4]) || 0; // Column E (index 4)
          const submittedWtd = parseFloat(row[5]) || 0; // Column F (index 5)
          const submittedYesterday = parseFloat(row[6]) || 0; // Column G (index 6)
          
          // Verified columns (H, I, J)
          const verifiedYtd = parseFloat(row[7]) || 0; // Column H (index 7)
          const verifiedMtd = parseFloat(row[8]) || 0; // Column I (index 8)
          const verifiedWtd = parseFloat(row[9]) || 0; // Column J (index 9)
          
          // Installed columns (K, L)
          const installedYtd = parseFloat(row[10]) || 0; // Column K (index 10)
          const installedMtd = parseFloat(row[11]) || 0; // Column L (index 11)
          
          // Skip entries with empty names (but keep all sales data for filtering later)
          if (name.trim() === '') {
            console.log(`Row ${index + 1} skipped - empty name`);
            return;
          }
          
          const entry: LeaderboardEntry = {
            rank: index + 1,
            name: name,
            teamName: teamName,
            // New structure
            submittedYtd,
            submittedMtd,
            submittedWtd,
            submittedYesterday,
            verifiedYtd,
            verifiedMtd,
            verifiedWtd,
            installedYtd,
            installedMtd,
            // Legacy fields for backward compatibility
            ytdSales: submittedYtd,
            mtdSales: submittedMtd,
            wtdSales: submittedWtd,
            yesterdaySales: submittedYesterday,
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

  // Helper function to get sales value based on filter state
  getSalesValue(entry: LeaderboardEntry, filterState: FilterState): number {
    const { topLevel, secondLevel } = filterState;
    
    switch (topLevel) {
      case 'SUBMITTED':
        switch (secondLevel) {
          case 'YTD': return entry.submittedYtd;
          case 'MTD': return entry.submittedMtd;
          case 'WTD': return entry.submittedWtd;
          case 'YESTERDAY': return entry.submittedYesterday;
          default: return 0;
        }
      case 'VERIFIED':
        switch (secondLevel) {
          case 'YTD': return entry.verifiedYtd;
          case 'MTD': return entry.verifiedMtd;
          case 'WTD': return entry.verifiedWtd;
          default: return 0;
        }
      case 'INSTALLED':
        switch (secondLevel) {
          case 'YTD': return entry.installedYtd;
          case 'MTD': return entry.installedMtd;
          default: return 0;
        }
      default:
        return 0;
    }
  }

  sortByFilterState(data: LeaderboardEntry[], filterState: FilterState, includeZeroSales: boolean = false): LeaderboardEntry[] {
    // Filter out entries with 0 sales for the selected filter (unless includeZeroSales is true)
    const filteredData = includeZeroSales ? data : data.filter((entry) => {
      return this.getSalesValue(entry, filterState) > 0;
    });

    // Then sort the filtered data
    const sortedData = filteredData.sort((a, b) => {
      const aValue = this.getSalesValue(a, filterState);
      const bValue = this.getSalesValue(b, filterState);
      return bValue - aValue; // Descending order
    });

    // Add ranks
    return sortedData.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  // Legacy method for backward compatibility
  sortByFilter(data: LeaderboardEntry[], filter: FilterType, includeZeroSales: boolean = false): LeaderboardEntry[] {
    // Convert legacy filter to new filter state (defaults to SUBMITTED)
    const filterState: FilterState = {
      topLevel: 'SUBMITTED',
      secondLevel: filter
    };
    return this.sortByFilterState(data, filterState, includeZeroSales);
  }
}

export const googleSheetsService = new GoogleSheetsService();
