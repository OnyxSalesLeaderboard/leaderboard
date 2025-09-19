import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService, FilterState, TopLevelFilter, SecondLevelFilter } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    console.log('=== API Route Called ===');
    console.log('Request URL:', request.url);
    
    const { searchParams } = new URL(request.url);
    const topLevel = (searchParams.get('topLevel') as TopLevelFilter) || 'SUBMITTED';
    const secondLevel = (searchParams.get('secondLevel') as SecondLevelFilter) || 'YTD';
    const includeZeroSales = searchParams.get('includeZeroSales') === 'true';
    const sheetName = searchParams.get('sheetName') || 'Reps';
    
    const filterState: FilterState = { topLevel, secondLevel };
    console.log('Filter requested:', filterState);
    console.log('Include zero sales:', includeZeroSales);
    
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

    console.log('Calling googleSheetsService.getLeaderboardData...', { sheetName });
    const rawData = await googleSheetsService.getLeaderboardData(spreadsheetId, sheetName);
    console.log('Raw data received:', rawData.length, 'entries');
    
    const sortedData = googleSheetsService.sortByFilterState(rawData, filterState, includeZeroSales);
    console.log('Sorted data:', sortedData.length, 'entries');

    const response = {
      data: sortedData,
      filter: filterState,
      timestamp: new Date().toISOString(),
      sheetName,
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
