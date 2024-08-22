import { useEffect } from "react";
import { useSocketContext } from "../src/context/SocketContext";
import notificationSound from "../src/assets/sounds/notification.mp3";
import { useGlobalState } from "../src/context/globalStateProvider";
const useListenNewChat = ({ userChats, setUserChats }) => {
  const { socket } = useSocketContext();
  const { state } = useGlobalState();

  const { user } = state;

  useEffect(() => {
    socket?.on("newChat", (newChat) => {
      console.log("new chat");
      console.log(newChat);
      // Extract chat_ids into an array
      const chatIds = userChats.map((chat) => chat.chat_id);
      // Check if the idToCompare is included in the chatIds array
      console.log(chatIds);
      if (chatIds.includes(newChat._id)) {
        console.log("chat exists now message is going to add");
        // const sound = new Audio(notificationSound);

        // sound.play().catch((err) => console.error("Error playing sound:", err));

        setUserChats((currentChats) => {
          let updatedChats = [];
          let matchedChat = null;

          // Iterate over currentChats to find the matching chat and update it
          currentChats.forEach((chat) => {
            if (chat.chat_id === newChat._id) {
              // Update and store the matched chat separately
              matchedChat = { ...chat, latestMessage: newChat.latestMessage };
            } else {
              // Collect non-matching chats
              updatedChats.push(chat);
            }
          });

          // Check if a match was found and place it at the start of the array
          if (matchedChat) {
            updatedChats.unshift(matchedChat); // Place the updated chat at the beginning
          }

          console.log("updated chat.....");
          console.log(updatedChats);
          return updatedChats; // Return the newly arranged array
        });
      } else {
        let processedChat = {
          latestMessage: newChat.latestMessage,
          chat_id: newChat._id,
          user: null,
        };

        newChat?.participants.forEach((participant) => {
          if (participant._id !== user._id) {
            processedChat.user = participant;
          }
        });

        setUserChats((pre) => [processedChat, ...pre]);
        // const sound = new Audio(notificationSound);
        // sound.play().catch((err) => console.error("Error playing sound:", err));
      }
    });

    // cleanup function when component unmount we don't want to listen and this line is very important
    return () => {
      socket?.off("newChat");
    };
  }, [socket, userChats, setUserChats]);
};
export default useListenNewChat;
