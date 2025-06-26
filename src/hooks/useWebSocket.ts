import { useState, useEffect, useRef, useCallback } from "react";

const WS_BASE_URL = "wss://127.0.0.1:8000/ws";

export function useWebSocket(jwtToken: string, url: string = "") {
  const socketRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState<Event | null>(null);

  const connect = useCallback(() => {
    if (!jwtToken) {
      throw new Error("Please login");
    }
    const fullUrl: string = WS_BASE_URL + url;
    const socket = new WebSocket(fullUrl, jwtToken);

    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log(e.data);
      setMessages(msg);
    };

    socket.onclose = () => {
      setIsConnected(false);
      // Retry/reconnect logic with max number ot tries
    };

    socket.onerror = (error) => {
      setError(error);
      socket.close();
    };
  }, [jwtToken]);

  useEffect(() => {
    connect();
  }, [connect]);

  const send = (data: unknown) => {
    if (isConnected && socketRef.current) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      throw new Error(
        "You are trying to send a new message but you have no handshake with the backend socket"
      );
    }
  };

  return {
    isConnected,
    messages,
    send,
    error,
  };
}
