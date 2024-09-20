"use client";

import { Player } from "@/types/player";
import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import Spinner from "@/components/Spinner/Spinner";
import { showToast, ToastType } from "@/utils/toast";
import { humanizePrice } from "@/utils/humanize";
import { AllTeamPlayerResponse, MyTeamPlayer, MyTeamStats } from "@/types/teams";
import EligibilityChecker from "@/components/EligibilityChecker";
export default function PlayersPage() {

  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<AllTeamPlayerResponse[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/team/all`, {
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
      .then((data: AllTeamPlayerResponse[]) => {
        setTeams(data);
        if (data.length > 0) {
          setSelectedTeamId(data[0].teamId);
          updatePlayersAndStats(data[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        showToast(error.message, ToastType.ERROR);
        setIsLoading(false);
      });
  }, []);

  const updatePlayersAndStats = (team: AllTeamPlayerResponse) => {
    setTeamBalance(team.teamBalance);
    setTeamStats({
      bowlerCount: team.bowlerCount,
      batsmanCount: team.batsmanCount,
      allRounderCount: team.allRounderCount,
      wicketKeeperCount: team.wicketKeeperCount,
      internationalCount: team.internationalCount,
      bowlerCountSatisfied: team.bowlerCountSatisfied,
      batsmanCountSatisfied: team.batsmanCountSatisfied,
      allRounderCountSatisfied: team.allRounderCountSatisfied,
      wicketKeeperCountSatisfied: team.wicketKeeperCountSatisfied,
      internationalCountSatisfied: team.internationalCountSatisfied
    });

    const newPlayers: Player[] = team.players.map((player: MyTeamPlayer) => ({
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

    setPlayers(newPlayers);
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(event.target.value);
    setSelectedTeamId(teamId);
    const selectedTeam = teams.find(team => team.teamId === teamId);
    if (selectedTeam) {
      updatePlayersAndStats(selectedTeam);
    }
  };

  const [teamBalance, setTeamBalance] = useState<number>(0);
  const [teamStats, setTeamStats] = useState<MyTeamStats>({
    bowlerCount: 0,
    batsmanCount: 0,
    allRounderCount: 0,
    wicketKeeperCount: 0,
    internationalCount: 0,
    bowlerCountSatisfied: false,
    batsmanCountSatisfied: false,
    allRounderCountSatisfied: false,
    wicketKeeperCountSatisfied: false,
    internationalCountSatisfied: false
  });


  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-6xl font-bold text-center mb-4">Teams</h1>
            <div className="text-center mb-6">
              <select 
                className="text-black text-xl p-2 rounded"
                value={selectedTeamId || ''}
                onChange={handleTeamChange}
              >
                {teams.map(team => (
                  <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
                ))}
              </select>
            </div>
            <div className="text-5xl font-semibold text-center mb-6">
              Current Team Balance: <span className="text-yellow-300">{humanizePrice(teamBalance)}</span>
            </div>
          </div>
          {selectedTeamId && <EligibilityChecker teamStats={teamStats} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {players?.map((player) => (
              <div key={player.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
                <PlayerCard {...player} />
                <div className="bg-gray-100 p-4">
                  <div className="text-lg font-semibold text-gray-800">
                    Sold for: <span className="text-green-600">{humanizePrice(player.soldForAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )
      }
    </div >
  );
}


