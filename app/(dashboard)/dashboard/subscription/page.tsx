import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getProductsForUser, getUser } from '@/lib/db/queries';

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // const teamData = await getTeamForUser(user.id);
  const userProducts = await getProductsForUser(user.id);

  // if (!userProducts.length) {
  //   throw new Error('Products not found');
  // }

  return <Settings userProducts={userProducts} />;
}
