"use client";

import { Player } from "@/types/player";
import { useEffect, useState } from "react";

export default function PlayersPage() {

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch("http://localhost:8069/players/all")
      .then((res) => res.json())
      .then((data) => {setPlayers(data)});
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players?.map((player) => (
          <div key={player.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl text-black font-semibold">{player.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

