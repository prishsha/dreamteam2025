"use client";

// TODO: Maybe some sort of auth

import ConnectionStatus from "@/components/ConnectionStatus";
import { GameState } from "@/types/game";
import { ParticipatingTeam } from "@/types/teams";
import { humanizePrice } from "@/utils/humanize";
import TeamLogos from "@/utils/teamlogos";
import { showToast, ToastType } from "@/utils/toast";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Admin() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [participatingTeams, setParticipatingTeams] = useState<ParticipatingTeam[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => { });

  const fetchTeamData = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/all`)
      .then((response) => response.json())
      .then((data) => {
        setParticipatingTeams(data);
      })
      .catch(() => {
        showToast("Failed to fetch updated team data", ToastType.ERROR)
      });
  }

  const handleStartBidding = () => {
    setModalText("Are you sure you want to start bidding?");
    setModalAction(() => () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          showToast("Bidding started successfully", ToastType.SUCCESS)
        } else {
          showToast("Failed to start bidding", ToastType.ERROR)
        }
      }).catch((error) => {
        showToast("Failed to start bidding: " + error, ToastType.ERROR)
      });
    });
    setIsModalOpen(true);
  };

  const handleEndBidding = () => {
    setModalText("Are you sure you want to finish bidding?");
    setModalAction(() => () => {
      // TODO: Implement finish bidding logic
      showToast("Finish bidding logic not implemented", ToastType.ERROR)
    });
    setIsModalOpen(true);
  };

  const assignPlayerToTeam = async (team: ParticipatingTeam) => {
    setModalText(`Are you sure you want to assign ${gameState?.CurrentPlayerInBid?.name} to ${team.name} for ${humanizePrice(gameState!.CurrentBidAmount)} ?`);
    setModalAction(() => () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/assign-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: team.id,
        }),
      }).then((response) => {
        if (response.ok) {
          fetchTeamData();
          showToast(`${gameState?.CurrentPlayerInBid?.name} assigned to ${team.name} for ${humanizePrice(gameState!.CurrentBidAmount)}`, ToastType.SUCCESS)
        } else {
          response.json().then((data) => {
            showToast("Failed to assign player to team: " + data.error, ToastType.ERROR)
          });
        }
      }).catch((error) => {
        showToast("Failed to assign player to team: " + error, ToastType.ERROR)
      });
    });
    setIsModalOpen(true);
  }

  const handleBidIncrement = () => {
    setModalText("Do you want to increment the bid?");
    setModalAction(() => () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/increment-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          showToast("Bid incremented successfully", ToastType.SUCCESS)
        } else {
          showToast("Failed to increment bid", ToastType.ERROR)
        }
      }).catch((error) => {
        showToast("Failed to increment bid: " + error, ToastType.ERROR)
      });
    });
    setIsModalOpen(true);
  }

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const wsUrl = backendUrl!.replace(/^https?:\/\//, '');

    const ws = new WebSocket(`ws://${wsUrl}/game/ws`);

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      console.log(socket?.readyState)
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const gameState: GameState = JSON.parse(event.data);
        setGameState(gameState);
        setGameStarted(gameState.IsBiddingActive);
        if (gameState.IsFinished) {
          console.log("game is finished")
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    setSocket(ws);

    return () => {
      setConnected(false);
      ws.close();
    };
  }, []);


  useEffect(() => {
    if (gameState?.IsFinished) {
      alert("Game is finished! Restarting...");
      // TODO: Implement logic to restart the database
    }
  }, [gameState]);


  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute top-6 right-6">
        <ConnectionStatus connected={connected} />
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 h-screen flex">
          <div className="w-1/2 h-full relative">
            {gameState?.CurrentPlayerInBid?.avatarUrl.Valid && (
              <img
                src={gameState.CurrentPlayerInBid.avatarUrl.String}
                alt={gameState.CurrentPlayerInBid.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">Current Player</h2>
              <h3 className="text-xl font-semibold">{gameState?.CurrentPlayerInBid?.name}</h3>
              <p className="text-lg">{gameState?.CurrentPlayerInBid?.country}</p>
              <p className="text-lg">Role: {gameState?.CurrentPlayerInBid?.role}</p>
              <p className="text-lg">Rating: {gameState?.CurrentPlayerInBid?.rating}</p>
            </div>
          </div>
          <div className="w-1/2 h-full relative">
            {gameState?.NextPlayerInBid?.avatarUrl.Valid && (
              <img
                src={gameState.NextPlayerInBid.avatarUrl.String}
                alt={gameState.NextPlayerInBid.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">Next Player</h2>
              <h3 className="text-xl font-semibold">{gameState?.NextPlayerInBid?.name}</h3>
              <p className="text-lg">{gameState?.NextPlayerInBid?.country}</p>
              <p className="text-lg">Role: {gameState?.NextPlayerInBid?.role}</p>
              <p className="text-lg">Rating: {gameState?.NextPlayerInBid?.rating}</p>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-between p-8 h-screen overflow-y-auto">
          <div>
            {gameStarted ? (
              <>
                <h2 className="text-4xl font-bold mb-4">Current Bid</h2>
                <div className="flex flex-col items-start justify-center mb-4">
                  <div className="flex items-center mb-2">
                    <p className="text-xl font-bold mr-4">Current Bid:</p>
                    <p className="text-5xl font-bold text-green-600">₹{humanizePrice(gameState!.CurrentBidAmount)}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold mr-4">Next Bid:</p>
                    <p className="text-3xl font-bold text-yellow-500">₹{humanizePrice(gameState!.NextBidAmount)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleBidIncrement}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-lg w-full"
                  >
                    Increment Player Bid
                  </button>
                  <button
                    onClick={handleEndBidding}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-lg w-full"
                  >
                    End Bidding
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleStartBidding}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-lg w-full"
                >
                  Start Bidding
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold mb-4">Participating Teams</h2>
            <div className="grid grid-cols-3 gap-3">
              {participatingTeams?.map((team) => (
                <button
                  key={team.id}
                  onClick={() => assignPlayerToTeam(team)}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg flex flex-col items-center justify-center"
                >
                  <img
                    src={TeamLogos(team.name)}
                    alt={team.name}
                    className="w-12 h-12 object-cover rounded-full mb-1"
                  />
                  <h3 className="text-sm text-black font-bold text-center">{team.name}</h3>
                  <p className="text-xs text-black">₹{humanizePrice(team.balance)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          modalAction();
          setIsModalOpen(false);
        }}
        text={modalText}
      />
    </div>
  );
}


