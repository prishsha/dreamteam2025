"use client";

// TODO: Maybe some sort of auth

import ConnectionStatus from "@/components/ConnectionStatus";
import { GameState } from "@/types/game";
import { useEffect, useState } from "react";

export default function Admin() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentGameState, setCurrentGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8069/game/ws');

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const gameState: GameState = JSON.parse(event.data);
        setCurrentGameState(gameState);
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
    if (currentGameState?.IsFinished) {
      window.location.href = '/results';
    }
  }, [currentGameState]);

  const handleStartBidding = () => {
    // TODO: Implement start bidding logic
  };

  const handleFinishBidding = () => {
    // TODO: Implement finish bidding logic
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute top-6 right-6">
        <ConnectionStatus connected={connected} />
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 h-screen relative">
          {currentGameState?.CurrentPlayerInBid.avatarUrl.Valid && (
            <img
              src={currentGameState.CurrentPlayerInBid.avatarUrl.String}
              alt={currentGameState.CurrentPlayerInBid.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-3xl font-bold">{currentGameState?.CurrentPlayerInBid.name}</h2>
            <p className="text-xl">{currentGameState?.CurrentPlayerInBid.country}</p>
            <p className="text-xl">Role: {currentGameState?.CurrentPlayerInBid.role}</p>
            <p className="text-xl">Rating: {currentGameState?.CurrentPlayerInBid.rating}</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-6xl font-bold mb-8">Current Bid</h2>
          <p className="text-8xl font-bold text-green-600">${currentGameState?.CurrentBidAmount}</p>
          <div className="mt-12 space-y-4">
            <button
              onClick={handleStartBidding}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              Start Bidding
            </button>
            <button
              onClick={handleFinishBidding}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              Finish Bidding
            </button>
          </div>
          <div className="mt-8">
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


