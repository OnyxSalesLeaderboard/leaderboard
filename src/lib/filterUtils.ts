import { LeaderboardEntry, FilterState } from './googleSheets';

export function getSalesValue(entry: LeaderboardEntry, filterState: FilterState): number {
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
