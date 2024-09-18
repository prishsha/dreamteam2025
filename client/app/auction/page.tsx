"use client";

import { GameState } from "@/types/game";
import { AssignPlayerMessage, ServerMessage } from "@/types/server";
import { humanizePrice } from "@/utils/humanize";
import getTeamColours, { TeamColours } from "@/utils/teamColours";
import { showToast, ToastType } from "@/utils/toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import RatingHolder from '@/assets/RatingHolder.svg';

export default function AuctionPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [teamColour, setTeamColour] = useState<TeamColours>();

  const getGradient = () => {
    return {
      background: `linear-gradient(to right, ${teamColour?.start}, ${teamColour?.end})`
    };
  };

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const wsUrl = backendUrl!.replace(/^https?:\/\//, '');
    const wsProtocol = backendUrl!.startsWith("https") ? "wss" : "ws";

    let ws: WebSocket | null = null;
    let retryInterval: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket(`${wsProtocol}://${wsUrl}/game/ws`);

      ws.onopen = () => {
        console.log(socket)
        console.log('Connected to WebSocket');
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const serverMessage: ServerMessage = JSON.parse(event.data);

          if (serverMessage.message) {
            // @ts-expect-error: We're not checking for the message type here.
            const assignPlayerMessage: AssignPlayerMessage = serverMessage.message;
            if (assignPlayerMessage.type === "assignPlayer") {

              // TODO: Maybe show a modal for 3 seconds with confetti.
              showToast(`${assignPlayerMessage.player.name} has been assigned to ${assignPlayerMessage.participatingTeam.name} for ${humanizePrice(assignPlayerMessage.bidAmount)}!`, ToastType.SUCCESS);
            }
          }

          if (serverMessage.gameState) {
            setGameState(serverMessage.gameState);
            setTeamColour(getTeamColours(serverMessage.gameState.CurrentPlayerInBid?.iplTeamName.String || ""))
          }

        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        if (!retryInterval) {
          retryInterval = setInterval(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 5000);
        }
      };

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen text-white p-8 flex flex-col items-center justify-center" style={getGradient()}>
      {gameState?.IsBiddingActive && gameState.CurrentPlayerInBid ? (
        <>

          <div className="absolute top-8 left-8 z-10">
            <div className="relative w-36 h-36">
              <Image src={RatingHolder} alt="Star" layout="fill" className="text-yellow-300" />
              <span className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white">{gameState.CurrentPlayerInBid.rating}</span>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-10">
            <div className="relative w-48 h-48">
              <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/dreamteamsmall.png`} alt={gameState.CurrentPlayerInBid.country} layout="fill" objectFit="cover" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">
            <div className="flex-1 flex flex-col items-center justify-center h-full z-10 relative">
              <div className="absolute inset-0 z-0 m-6">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/cardbg.png`}
                  alt="Dream Team Logo"
                  className='opacity-30'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              {gameState.CurrentPlayerInBid.avatarUrl.Valid && (
                <Image
                  width={512}
                  height={512}
                  src={`${gameState.CurrentPlayerInBid.avatarUrl.String}`}
                  alt={gameState.CurrentPlayerInBid.name}
                  className="w-full h-4/5 md:h-3/5 object-contain mb-4 relative z-10"
                  style={{ maxHeight: '80vh' }}
                />
              )}
              <div className="w-full border-t-2 border-b-2 border-white py-4 text-center relative z-10">
                <h2 className="text-6xl md:text-5xl font-bold">{gameState.CurrentPlayerInBid.name}</h2>
              </div>
            </div>
            <div className="text-left flex-1 mt-8 md:mt-0 z-10">
              <h1 className="text-5xl font-bold mb-8">Current Player</h1>
              <p className="text-2xl mb-2">{gameState.CurrentPlayerInBid.country}</p>
              <p className="text-2xl mb-2">Role: {gameState.CurrentPlayerInBid.role}</p>
              <p className="text-2xl mb-8">Rating: {gameState.CurrentPlayerInBid.rating}</p>

              <div>
                <p className="text-6xl font-bold mb-4">Current Bid: <span className="text-green-400">₹{humanizePrice(gameState.CurrentBidAmount)}</span></p>
                <p className="text-4xl">Next Bid: <span className="text-yellow-400">₹{humanizePrice(gameState.NextBidAmount)}</span></p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-4xl font-bold">Waiting for the auction to start...</p>
      )}
    </div>
  );
}
