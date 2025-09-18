import { Player } from "@/types/player";
import PlayerCard from "@/components/PlayerCard";

async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/all`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  return res.json();
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {players.map((player) => (
          <PlayerCard key={player.id} {...player} />
        ))}
      </div>
    </div>
  );
}

