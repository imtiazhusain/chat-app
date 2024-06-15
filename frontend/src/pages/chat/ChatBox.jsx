import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useGlobalState } from "../../context/globalStateProvider";
import axios from "../../config/axios";
import convertIntoTime from "../../utils/convertIntoTime";
const ChatBoxHeader = ({ data }) => {
  return (
    <div className="flex gap-3 items-center my-4">
      <Avatar alt={data?.user?.name} src={data?.user?.profile_pic} />
      <div className="flex flex-col gap-0  w-full">
        <h3 className="text-slate-800 font-semibold tracking-wide">
          {data?.user?.name}
        </h3>
        <h3 className="text-gray-500 text-xs">{data?.user?.email}</h3>
      </div>
    </div>
  );
};

const ChatBoxFooter = ({ addNewMessage }) => {
  const [message, setMessage] = useState("");
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  return (
    <div className="flex items-center border border-gray-300  bg-white mt-3 rounded-full">
      <input
        type="text"
        className=" pl-8 py-2 outline-none w-[90%]  rounded-full"
        placeholder="Search..."
        value={message}
        onChange={handleChange}
        autoFocus
      />
      <div
        className=" text-slate-900 cursor-pointer"
        onClick={() => {
          addNewMessage(message);
          setMessage("");
        }}
      >
        <RiSendPlaneFill size={25} />
      </div>
    </div>
  );
};

const Message = ({ data }) => {
  console.log(data);
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
          <h3 className="text-gray-500 text-xs">{data.message}</h3>
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
        <div className="flex flex-col gap-0  max-w-[50%] min-w-28 bg-blue-300 rounded-md p-2">
          <h3 className="text-gray-500 text-xs">{data.message}</h3>
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
  const { state, dispatch } = useGlobalState();
  console.log(state);
  const { selectedChat, user } = state;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
  console.log(messages);
  return state.selectedChat ? (
    <div className="h-full">
      <ChatBoxHeader data={state.selectedChat} />

      <div className="w-full p-4 border border-gray-300 h-[88%]  rounded-md flex flex-col justify-between ">
        {loading ? (
          "Loading Chats..."
        ) : (
          <>
            <div className="h-[370px] overflow-y-auto">
              <ChatSection messages={messages} />
              <div ref={chatEndRef} />
            </div>
            <ChatBoxFooter addNewMessage={addNewMessage} />
          </>
        )}
      </div>
    </div>
  ) : (
    "Select any chat to start conversation"
  );
};

export default ChatBox;
