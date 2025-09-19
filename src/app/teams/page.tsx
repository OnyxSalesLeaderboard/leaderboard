import Leaderboard from '@/components/Leaderboard';

export const metadata = {
  title: 'Onyx Leaderboard - Teams',
  description: 'Team performance leaderboard',
};

export default function TeamsPage() {
  return <Leaderboard sheetName="Teams" />;
}
