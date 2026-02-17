import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useSocket(onAlert, setOnline) {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });
    socket.on("connect",    () => setOnline?.(true));
    socket.on("disconnect", () => setOnline?.(false));
    socket.on("zoneAlert",  (alerts) => onAlert?.(alerts));
    return () => socket.disconnect();
  }, []);
}