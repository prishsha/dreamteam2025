"use client";

import { GameState } from "@/types/game";
import { AssignPlayerMessage, ServerMessage, UnsoldPlayerMessage } from "@/types/server";
import { humanizePrice } from "@/utils/humanize";
import getTeamColours, { TeamColours } from "@/utils/teamColours";
import { showToast, ToastType } from "@/utils/toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import RatingHolder from '@/assets/RatingHolder.svg';
import GetCountryFlagIcon from "@/utils/flags";

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
            // @ts-expect-error: We're not checking for the message type here
            const unsoldPlayerMessage: UnsoldPlayerMessage = serverMessage.message;

            if (assignPlayerMessage.type === "assignPlayer") {
              // TODO: Maybe show a modal for 3 seconds with confetti.
              showToast(`${assignPlayerMessage.player.name} has been assigned to ${assignPlayerMessage.participatingTeam.name} for ${humanizePrice(assignPlayerMessage.bidAmount)}!`, ToastType.SUCCESS);
            }

            if (assignPlayerMessage.type === "unsoldPlayer") {
              showToast(`${unsoldPlayerMessage.player.name} went unsold!`, ToastType.WARNING);
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
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-8">
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
            <div className="absolute top-12 left-8 z-10">
              <div className="relative w-24 h-24 md:w-24 md:h-24 sm:w-12 sm:h-12">
                <Image src={RatingHolder} alt="Star" layout="fill" className="text-yellow-300" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">{gameState.CurrentPlayerInBid.rating}</span>
              </div>
            </div>

            <div className="absolute top-12 right-8 z-10">
              <div className="relative w-24 h-24 md:w-24 md:h-24 sm:w-12 sm:h-12">
                <Image src={GetCountryFlagIcon(gameState.CurrentPlayerInBid.country)} alt={gameState.CurrentPlayerInBid.country} layout="fill" objectFit="cover" />
              </div>
            </div>
            {gameState.CurrentPlayerInBid.avatarUrl.Valid && (
              <Image
                width={512}
                height={512}
                src={`${gameState.CurrentPlayerInBid.avatarUrl.String}`}
                alt={gameState.CurrentPlayerInBid.name}
                className="w-full h-4/5 md:h-3/5 object-contain relative z-10"
                style={{ maxHeight: '80vh' }}
              />
            )}
            <div className="w-full py-4 text-center relative z-10" style={{ backgroundColor: teamColour?.end }}>
              <h2 className="text-6xl md:text-5xl font-bold">{gameState.CurrentPlayerInBid.name}</h2>
            </div>
          </div>
          <div className="text-left flex-1 mt-8 md:mt-0 z-10 md:ml-8">
            <div className="absolute top-8 right-8 z-10">
              <div className="relative w-48 h-48">
                <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/dreamteamsmall.png`} alt={gameState.CurrentPlayerInBid.country} layout="fill" objectFit="cover" className="hidden md:block" />
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-8 text-yellow-400">{gameState.CurrentPlayerInBid.country}</h1>
            <p className="text-5xl mb-8 text-green-400">{gameState.CurrentPlayerInBid.role}</p>
            <div className="bg-opacity-50 bg-black p-6 rounded-lg">
              <p className="text-7xl font-bold mb-4">Current Bid: <span className="text-green-400">₹{humanizePrice(gameState.CurrentBidAmount)}</span></p>
              <p className="text-4xl">Next Bid: <span className="text-yellow-400">₹{humanizePrice(gameState.NextBidAmount)}</span></p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-4xl font-bold">Waiting for the auction to start...</p>
      )}
    </div>
  );
}
