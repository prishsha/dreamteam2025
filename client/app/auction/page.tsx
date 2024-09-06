"use client";

import ConnectionStatus from "@/components/ConnectionStatus";
import { useEffect, useState } from "react";

export default function AuctionPage() {

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8069/game/ws');

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
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
    <div className="flex justify-center items-center min-h-screen text-3xl">
      <ConnectionStatus connected={connected} />
    </div>
  );
}

