"use client";

import { Player, PlayerRole } from "@/types/player";
import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import Spinner from "@/components/Spinner/Spinner";
import { showToast, ToastType } from "@/utils/toast";
import { humanizePrice } from "@/utils/humanize";
export default function PlayersPage() {

  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamBalance, setTeamBalance] = useState(0);

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
    teamBalance: number;
    isUnsold: boolean;
    soldForAmount: number;
  }


  useEffect(() => {
    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/team`, {
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
        const teamBalance = data[0].teamBalance;
        setTeamBalance(teamBalance);

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
          },
          isUnsold: player.isUnsold,
          soldForAmount: player.soldForAmount
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
          <div className="text-6xl text-center mb-4">My Team</div>
          <div className="text-3xl text-center mb-6">Current Team Balance: {humanizePrice(teamBalance)}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {players?.map((player) => (
              <div key={player.id} className="text-center m-1">
                <PlayerCard {...player} />
                <div className="mt-2 text-lg font-semibold">
                  Sold for: {humanizePrice(player.soldForAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


