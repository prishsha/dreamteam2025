"use client";

import ConnectionStatus from "@/components/ConnectionStatus";
import { GameState } from "@/types/game";
import { humanizePrice } from "@/utils/humanize";
import { useEffect, useState } from "react";

export default function AuctionPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const wsUrl = backendUrl!.replace(/^https?:\/\//, '');

    const ws = new WebSocket(`ws://${wsUrl}/game/ws`);

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const gameState: GameState = JSON.parse(event.data);
        setGameState(gameState);
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

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ConnectionStatus connected={connected} />
      </div>
      
      {gameState?.IsBiddingActive && gameState.CurrentPlayerInBid ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">Current Player</h1>
          {gameState.CurrentPlayerInBid.avatarUrl.Valid && (
            <img
              src={gameState.CurrentPlayerInBid.avatarUrl.String}
              alt={gameState.CurrentPlayerInBid.name}
              className="w-64 h-64 rounded-full object-cover mx-auto mb-6"
            />
          )}
          <h2 className="text-4xl font-semibold mb-4">{gameState.CurrentPlayerInBid.name}</h2>
          <p className="text-2xl mb-2">{gameState.CurrentPlayerInBid.country}</p>
          <p className="text-2xl mb-2">Role: {gameState.CurrentPlayerInBid.role}</p>
          <p className="text-2xl mb-8">Rating: {gameState.CurrentPlayerInBid.rating}</p>
          
          <div className="text-center">
            <p className="text-6xl font-bold mb-4">Current Bid: <span className="text-green-400">₹{humanizePrice(gameState.CurrentBidAmount)}</span></p>
            <p className="text-4xl">Next Bid: <span className="text-yellow-400">₹{humanizePrice(gameState.NextBidAmount)}</span></p>
          </div>
        </div>
      ) : (
        <p className="text-4xl font-bold">Waiting for the auction to start...</p>
      )}
    </div>
  );
}
