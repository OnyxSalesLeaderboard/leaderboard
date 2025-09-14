import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService, FilterType } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get('filter') as FilterType) || 'YTD';
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Spreadsheet ID not configured' },
        { status: 500 }
      );
    }

    const rawData = await googleSheetsService.getLeaderboardData(spreadsheetId);
    const sortedData = googleSheetsService.sortByFilter(rawData, filter);

    return NextResponse.json({
      data: sortedData,
      filter,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
