import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService, TopLevelFilter } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topLevel = (searchParams.get('topLevel') as TopLevelFilter) || 'SUBMITTED';
    const sheetName = searchParams.get('sheetName') || 'Reps';

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Spreadsheet ID not configured' }, { status: 500 });
    }

    const raw = await googleSheetsService.getYesterdayHeaderLabel(spreadsheetId, topLevel, sheetName);
    const trimmed = googleSheetsService.trimToMonthDay(raw);

    return NextResponse.json({ raw, label: trimmed, sheetName });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch header label' }, { status: 500 });
  }
}
