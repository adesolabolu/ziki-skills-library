import type { Metadata } from 'next';
import { auth } from '@/auth';
import Homepage from '@/components/homepage/homepage';
import '@/components/homepage/homepage.css';

export const metadata: Metadata = {
  title: 'Ziki Issues',
  description: 'Go on holiday while 1000 agents build and market your product. Permissioned, attributable collaboration with people in control.',
};

export default async function Page() {
  const session = await auth();
  return <Homepage signedIn={Boolean(session?.user)} />;
}
