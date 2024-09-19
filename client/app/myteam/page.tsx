"use client";

import { Player, PlayerRole } from "@/types/player";
import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import Spinner from "@/components/Spinner/Spinner";
import { showToast, ToastType } from "@/utils/toast";
export default function PlayersPage() {

  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  type MyTeamPlayer = {
    id: number;
    name: string;
    country: string;
    role: PlayerRole;
    rating: number;
    basePrice: number;
    avatarUrl: {
      String: string;
      Valid: boolean;
    }
    teamId: {
      Int64: number;
      Valid: boolean;
    }
    iplTeam: {
      Int64: number;
      Valid: boolean;
    }
    iplTeamName: string;
  }


  useEffect(() => {
    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/team`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(json => {
            throw new Error(json.error || 'Failed to fetch players');
          });
        }
        return res.json();
      })
      .then((data: MyTeamPlayer[]) => {
        const newData: Player[] = data.map((player: MyTeamPlayer) => ({
          id: player.id,
          name: player.name,
          country: player.country,
          role: player.role,
          rating: player.rating,
          basePrice: player.basePrice,
          avatarUrl: player.avatarUrl,
          teamId: player.teamId,
          iplTeam: player.iplTeam,
          iplTeamName: {
            String: player.iplTeamName,
            Valid: player.iplTeamName !== "",
          }
        }));

        setPlayers(newData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        showToast(error.message, ToastType.ERROR);
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
        <div>
          <div className="text-6xl text-center">My Team</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {players?.map((player) => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


