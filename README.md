# ONYX Leaderboard

A Next.js leaderboard application that displays sales performance data from Google Sheets, designed to match the provided Figma design.

## Features

- 🏆 Beautiful leaderboard with top 3 podium display
- 📊 Filter by YTD (Year to Date), MTD (Month to Date), and WTD (Week to Date)
- 🔄 Real-time data from Google Sheets
- 📱 Responsive design matching Figma specifications
- 🔐 Secure Google Sheets API integration via service account

## Setup Instructions

### 1. Google Sheets Setup

1. Create a Google Spreadsheet with a sheet named "All Reps"
2. Structure your data with columns A through R, where:
   - Column A: Representative Name
   - Column D: YTD Sales
   - Column E: MTD Sales
   - Column F: WTD Sales

### 2. Google Service Account Setup

1. Make sure to share your Google Spreadsheet with the service account email:
   `onyx-leaderboard-service-accou@onyx-leaderboard.iam.gserviceaccount.com`
2. Give the service account "Viewer" permissions

### 3. Environment Configuration

1. Update the `.env.local` file with your Google Spreadsheet ID and service account credentials:
   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=onyx-leaderboard-service-accou@onyx-leaderboard.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY_ID=your_private_key_id_here
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
   ```

2. To find your Spreadsheet ID, look at the URL of your Google Sheet:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### 4. Installation and Running

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the leaderboard.

## Project Structure

```
src/
├── app/
│   ├── api/leaderboard/     # API route for fetching data
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── Leaderboard.tsx      # Main leaderboard component
│   ├── FilterButtons.tsx    # YTD/MTD/WTD filter buttons
│   ├── TopThreeCards.tsx    # Podium cards for top 3
│   └── LeaderboardList.tsx  # List for remaining entries
└── lib/
    └── googleSheets.ts      # Google Sheets API service
```

## Data Format

The application expects data in Google Sheets with the following structure:

| Column | Description |
|--------|-------------|
| A      | Name        |
| D      | YTD Sales   |
| E      | MTD Sales   |
| F      | WTD Sales   |

## Deployment

This app can be deployed on Vercel, Netlify, or any other platform that supports Next.js.

For Vercel deployment:
1. Connect your GitHub repository
2. Add the environment variables in the Vercel dashboard:
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY_ID`
   - `GOOGLE_PRIVATE_KEY`
3. Deploy

## Security Notes

- Never commit service account credentials to version control
- Use environment variables for sensitive configuration
- Keep your `.env.local` file secure and never share it publicly
