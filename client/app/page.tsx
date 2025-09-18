'use client'

import { useRouter } from 'next/navigation';
import UserProfile from '@/components/UserProfile';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="absolute top-4 right-4">
        {/* <UserProfile /> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        <button onClick={() => router.push('/players')} className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 text-xl font-bold">
          All Players List
        </button>
        <button onClick={() => router.push('/auction')} className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-xl font-bold">
          Auction
        </button>
        <button onClick={() => router.push('/rules')} className="w-full px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 text-xl font-bold">
          Rules
        </button>
        <button onClick={() => router.push('/myteam')} className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 text-xl font-bold">
          My Team
        </button>
      </div>
    </div>
  );
}
