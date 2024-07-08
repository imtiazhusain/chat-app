import { useEffect } from "react";
import { useSocketContext } from "../src/context/SocketContext";
import notificationSound from "../src/assets/sounds/notification.mp3";
const useListenMessages = ({
  messages,
  setMessages,
  setIsTyping,
  isTyping,
}) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    socket?.on("typing", () => {
      setIsTyping(true);
      console.log("typing event received.....");
    });
    socket?.on("stopTyping", () => {
      setIsTyping(false);
      console.log("stop typing event received.....");
    });
    // cleanup function when component unmount we don't want to listen and this line is very important
    return () => {
      socket?.off("newMessage");
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket, messages, setMessages, setIsTyping, isTyping]);
};
export default useListenMessages;
