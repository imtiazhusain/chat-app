import { useEffect } from "react";
import { useSocketContext } from "../src/context/SocketContext";
import notificationSound from "../src/assets/sounds/notification.mp3";
import { useGlobalState } from "../src/context/globalStateProvider";
const useListenMessages = ({
  messages,
  setMessages,
  setIsTyping,
  isTyping,
}) => {
  const { socket } = useSocketContext();
  const { state } = useGlobalState();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      if (state?.selectedChat?.chat_id == newMessage.chat_id) {
        setMessages([...messages, newMessage.newMessage]);
        const sound = new Audio(notificationSound);

        sound.play().catch((err) => console.error("Error playing sound:", err));
      }
    });

    socket?.on("typing", (chat_id) => {
      if (state?.selectedChat?.chat_id == chat_id) {
        setIsTyping(true);
      }
    });
    socket?.on("stopTyping", (chat_id) => {
      if (state?.selectedChat?.chat_id == chat_id) {
        setIsTyping(false);
      }
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
