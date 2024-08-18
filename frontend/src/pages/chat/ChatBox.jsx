import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import axios from "../../config/axios";
import convertIntoTime from "../../utils/convertIntoTime";
import { useSocketContext } from "../../context/SocketContext";
import useListenMessages from "../../../hooks/useListenMessages";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxFooter from "./ChatBoxFooter";
import Sidebar from "./Sidebar";
import useListenNewChat from "../../../hooks/useListenNewChat";

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
        <div className="flex flex-col gap-0  max-w-[50%] min-w-28 bg-gray-300 rounded-md ">
          {data.attachedFile && (
            <a href={data.attachedFile} download target="__blank">
              <img
                src={data.attachedFile}
                className="mb-2 cursor-pointer rounded-e-md "
                alt="file"
              />
            </a>
          )}
          <div className="p-2">
            <h3 className="text-slate-800 text-xs">{data.message}</h3>
            <h3 className="text-gray-500 text-[10px] text-end">
              {convertIntoTime(data?.createdAt)}
            </h3>
          </div>
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
        <div className="flex flex-col gap-0  max-w-[50%] min-w-28 bg-green-200 rounded-md ">
          {data.attachedFile && (
            <a href={data.attachedFile} download target="__blank">
              <img
                src={data.attachedFile}
                className="mb-2 cursor-pointer rounded-e-md "
                alt="file"
              />
            </a>
          )}
          <div className="p-2">
            <h3 className="text-slate-800 text-xs">{data.message}</h3>
            <h3 className="text-gray-500  text-[10px]  text-end">
              {convertIntoTime(data?.createdAt)}
            </h3>
          </div>
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

  return state.selectedChat ? (
    <div className="h-full px-4 py-2 md:p-0 flex flex-col">
      <ChatBoxHeader data={state.selectedChat} isTyping={isTyping} />

      <div className=" p-2 border border-gray-300 flex-grow  rounded-md flex flex-col justify-between overflow-y-auto">
        {loading ? (
          <h2 className="text-center">Loading chats...</h2>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-3">
              <ChatSection messages={messages} />

              <div ref={chatEndRef} />
            </div>
            <div className="pb-3 md:pb-0">
              <ChatBoxFooter setMessages={setMessages} />
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="h-full  ">
      <div className="hidden md:grid md:place-content-center h-full">
        <div className="flex items-center justify-center flex-col  gap-2">
          <h2 className="text-3xl tracking-widest">Welcome 👋 {user.name}</h2>
          <h3 className="text-lg"> Select any chat to start conversation</h3>
        </div>
      </div>
      <div className="md:hidden  ">
        <Sidebar />
      </div>
    </div>
  );
};

export default ChatBox;
