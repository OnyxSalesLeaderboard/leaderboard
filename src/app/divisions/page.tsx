import Leaderboard from '@/components/Leaderboard';

export const metadata = {
  title: 'Onyx Leaderboard - Divisions',
  description: 'Divisions performance leaderboard',
};

export default function DivisionsPage() {
  return <Leaderboard sheetName="Divisions" />;
}

