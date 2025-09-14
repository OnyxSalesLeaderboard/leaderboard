import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService, FilterType } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    console.log('=== API Route Called ===');
    console.log('Request URL:', request.url);
    
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get('filter') as FilterType) || 'YTD';
    console.log('Filter requested:', filter);
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    console.log('Spreadsheet ID available:', !!spreadsheetId);
    console.log('Spreadsheet ID (masked):', spreadsheetId ? `${spreadsheetId.substring(0, 10)}...` : 'NOT SET');

    if (!spreadsheetId) {
      console.error('Spreadsheet ID not configured in environment variables');
      return NextResponse.json(
        { error: 'Spreadsheet ID not configured' },
        { status: 500 }
      );
    }

    console.log('Calling googleSheetsService.getLeaderboardData...');
    const rawData = await googleSheetsService.getLeaderboardData(spreadsheetId);
    console.log('Raw data received:', rawData.length, 'entries');
    
    const sortedData = googleSheetsService.sortByFilter(rawData, filter);
    console.log('Sorted data:', sortedData.length, 'entries');

    const response = {
      data: sortedData,
      filter,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Returning successful response with', sortedData.length, 'entries');
    return NextResponse.json(response);
  } catch (error) {
    console.error('=== API Route Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Environment variables check:', {
      hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKeyId: !!process.env.GOOGLE_PRIVATE_KEY_ID
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
