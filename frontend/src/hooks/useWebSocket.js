import { useEffect, useRef, useState, useCallback } from "react";

function useWebSocket({ onLobbyCreated, onLobbyUpdate, onGameStarted, onGameEnded, onRevealImposter }) {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Store callbacks in refs so they don't cause reconnections
  const callbacksRef = useRef({ onLobbyCreated, onLobbyUpdate, onGameStarted, onGameEnded, onRevealImposter });

  useEffect(() => {
    callbacksRef.current = { onLobbyCreated, onLobbyUpdate, onGameStarted, onGameEnded, onRevealImposter };
  }, [onLobbyCreated, onLobbyUpdate, onGameStarted, onGameEnded, onRevealImposter]);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
      (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
    const wsUrl = `${BACKEND_URL}/ws`;
    
    console.log("Connecting to WebSocket:", wsUrl);
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      switch (data.type) {
        case "lobby_created":
          callbacksRef.current.onLobbyCreated?.(data.payload);
          break;
        case "lobby_update":
          callbacksRef.current.onLobbyUpdate?.(data.payload);
          break;
        case "error":
          alert(data.payload.message);
          break;
        case "game_started":
          callbacksRef.current.onGameStarted?.(data.payload);
          break;
        case "game_ended":
          callbacksRef.current.onGameEnded?.(data.payload);
          break;
        case "reveal_imposter":
          callbacksRef.current.onRevealImposter?.(data.payload);
          break;
        case "connected":
          console.log("Server says:", data.payload);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      console.log("Cleaning up WebSocket...");
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []); // Empty dependency array - only connect once

  const sendMessage = useCallback((type, payload) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.log("Sending:", { type, payload });
      socket.current.send(JSON.stringify({ type, payload }));
    } else {
      console.error("WebSocket not connected. ReadyState:", socket.current?.readyState);
    }
  }, []);

  return {
    isConnected,
    sendMessage
  };
}

export default useWebSocket;