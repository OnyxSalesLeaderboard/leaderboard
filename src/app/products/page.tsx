import Leaderboard from '@/components/Leaderboard';

export const metadata = {
  title: 'Onyx Leaderboard - Products',
  description: 'Products performance leaderboard',
};

export default function ProductsPage() {
  return <Leaderboard sheetName="Products" />;
}
