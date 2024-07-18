import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import axios from "../../config/axios";
import convertIntoTime from "../../utils/convertIntoTime";
import { useSocketContext } from "../../context/SocketContext";
import useListenMessages from "../../../hooks/useListenMessages";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxFooter from "./ChatBoxFooter";

const Message = ({ data }) => {
  const { state, dispatch } = useGlobalState();
  const { user, selectedChat } = state;
  const [isSenderMessage, setIsSenderMessage] = useState(false);

  useEffect(() => {
    if (data.sender == user._id) {
      setIsSenderMessage(true);
    }
  }, [state]);

  const SenderMessage = () => {
    return (
      <div className="flex gap-3 items-center my-4 justify-end">
        <Avatar
          alt={user?.name}
          src={user?.profile_pic}
          sx={{ width: 25, height: 25 }}
        />
        <div className="flex flex-col gap-0  max-w-[50%] min-w-28 bg-gray-300 rounded-md p-2">
          <h3 className="text-slate-800 text-xs">{data.message}</h3>
          <h3 className="text-gray-500 text-[10px] text-end">
            {convertIntoTime(data?.createdAt)}
          </h3>
        </div>
      </div>
    );
  };

  const ReceiverMessage = () => {
    return (
      <div className="flex gap-3 items-center my-4 ">
        <Avatar
          alt={selectedChat?.user?.name}
          src={selectedChat?.user?.profile_pic}
          sx={{ width: 25, height: 25 }}
        />
        <div className="flex flex-col gap-0  max-w-[50%] min-w-28 bg-green-200 rounded-md p-2">
          <h3 className="text-slate-800 text-xs">{data.message}</h3>
          <h3 className="text-gray-500  text-[10px]  text-end">
            {convertIntoTime(data?.createdAt)}
          </h3>
        </div>
      </div>
    );
  };

  return <>{isSenderMessage ? <SenderMessage /> : <ReceiverMessage />}</>;
};
const ChatSection = ({ messages }) => {
  return (
    <div>
      {messages?.map((message, index) => (
        <Message data={message} key={index} />
      ))}
    </div>
  );
};
const ChatBox = () => {
  const { state } = useGlobalState();

  const { selectedChat, user } = state;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const { socket } = useSocketContext();

  useListenMessages({ messages, setMessages, setIsTyping, isTyping });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/chat/get_chat/${selectedChat?.chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessages(response?.data?.data?.messages);

        socket.emit("joinChat", selectedChat?.chat_id);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedChat) {
      fetchChat();
    }
  }, [state.selectedChat]);

  const addNewMessage = async (message) => {
    let messageObj = {
      message: message,
      createdAt: new Date().toISOString(),
      sender: user?._id,
    };
    const createNewMessage = async () => {
      try {
        // setLoading(true);
        const response = await axios.post(
          `/message/send_message`,
          {
            message: message,
            receiver_id: selectedChat?.user?._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages((pre) => [...pre, messageObj]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    createNewMessage();
  };

  return state.selectedChat ? (
    <div className="h-full">
      <ChatBoxHeader data={state.selectedChat} isTyping={isTyping} />

      <div className="w-full p-4 border border-gray-300 h-[88%]  rounded-md flex flex-col justify-between">
        {loading ? (
          "Loading Chats..."
        ) : (
          <>
            <div className="h-[370px] overflow-y-auto">
              <ChatSection messages={messages} />

              <div ref={chatEndRef} />
            </div>
            <ChatBoxFooter
              addNewMessage={addNewMessage}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
            />
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center flex-col h-full gap-2">
      <h2 className="text-3xl tracking-widest">Welcome 👋 {user.name}</h2>
      <h3 className="text-lg"> Select any chat to start conversation</h3>
    </div>
  );
};

export default ChatBox;
