import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import { set } from "mongoose";
import convertIntoTime from "../../utils/convertIntoTime";

const Chat = ({ data }) => {
  const { state, dispatch } = useGlobalState();

  const { selectedChat } = state;

  const setSelectedChat = () => {
    dispatch({ type: "SET_SELECTED_CHAT", payload: data });
  };
  return (
    <div className="cursor-pointer" onClick={setSelectedChat}>
      <div
        className={`flex gap-3 items-center my-4  px-2 py-1 ${
          selectedChat?.user?._id == data?.user?._id && "bg-gray-300 rounded-md"
        }   `}
      >
        <Avatar alt="user image" src={data?.user?.profile_pic} />
        <div className="flex flex-col gap-0  w-full">
          <div className="flex justify-between items-center w-full ">
            <h3 className="text-slate-800 font-medium tracking-wide">
              {data?.user?.name}
            </h3>
            <h3 className="text-gray-500 text-xs">
              {convertIntoTime(data?.latestMessage?.createdAt)}
            </h3>
          </div>
          <h3 className="text-gray-500 text-xs">
            {data?.latestMessage?.message}
          </h3>
        </div>
      </div>
      {/* <hr className=" bg-slate-700 border-t border-gray-300 my-1" /> */}
    </div>
  );
};

const Chats = ({ data, loading }) => {
  const { state, dispatch } = useGlobalState();
  const [userChats, setUserChats] = useState([]);

  const { user } = state;
  console.log(user);
  useEffect(() => {
    const processChats = (data, userIdToRemove) => {
      console.log(data);

      const result = [];

      data.forEach((chat) => {
        console.log(chat);
        let chatInfo = {
          latestMessage: chat?.latestMessage,
          user: null,
          chat_id: chat._id,
        };
        chat?.participants.forEach((user) => {
          if (user._id !== userIdToRemove) {
            chatInfo.user = user;
            result.push(chatInfo);
          }
        });
      });

      return result;
    };

    const processedChats = processChats(data, user._id);
    console.log(processedChats);
    setUserChats(processedChats);
  }, [data]);

  console.log(userChats);
  return (
    <>
      {loading
        ? "Loading..."
        : data.length > 0
        ? userChats.map((chat) => <Chat data={chat} key={chat._id} />)
        : "No Chat Found"}
    </>
  );
};

export default Chats;
