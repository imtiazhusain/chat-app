import { createContext, useContext, useEffect, useState } from "react";
import { useGlobalState } from "./globalStateProvider";
import { io } from "socket.io-client";
const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { state } = useGlobalState();

  useEffect(() => {
    if (state?.user) {
      const socket = io(import.meta.env.VITE_SOCKET_URL, {
        query: {
          userId: state?.user?._id,
        },
      });
      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [state?.user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
