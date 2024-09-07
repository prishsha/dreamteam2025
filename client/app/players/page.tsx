"use client";

import { Player } from "@/types/player";
import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import Spinner from "@/components/Spinner/Spinner";
export default function PlayersPage() {

  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/all`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setIsLoading(false);
      });
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {players?.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))}
        </div>
      )}
    </div>
  );
}

