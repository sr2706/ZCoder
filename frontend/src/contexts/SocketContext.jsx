import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const newSocket = io(backendUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected the socket, reconnect manually
          newSocket.connect();
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("Reconnected after", attemptNumber, "attempts");
      });

      newSocket.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });

      newSocket.on("reconnect_failed", () => {
        console.error("Failed to reconnect to server");
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

