import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import convertIntoTime from "../../utils/convertIntoTime";
import { useSocketContext } from "../../context/SocketContext";
import OnlineDot from "../../components/onlineDot";
import UserMenu from "./UserMenu";

const Chat = ({ data, setUserChats }) => {
  const { state, dispatch } = useGlobalState();

  const { selectedChat } = state;
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(data.user._id);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const setSelectedChat = () => {
    dispatch({ type: "SET_SELECTED_CHAT", payload: data });
  };
  return (
    <div className="cursor-pointer  flex items-center">
      <div
        className={`flex gap-3 items-center my-3  px-2 py-1 w-full ${
          selectedChat?.user?._id == data?.user?._id && "bg-gray-300 rounded-md"
        }   `}
        onClick={setSelectedChat}
      >
        {isOnline ? (
          <OnlineDot
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar alt="user image" src={data?.user?.profile_pic} />
          </OnlineDot>
        ) : (
          <Avatar alt="user image" src={data?.user?.profile_pic} />
        )}

        <div className="flex flex-col gap-0  w-full">
          <div className="flex justify-between items-center w-full ">
            <h3 className="text-slate-800 font-medium tracking-wide">
              {data?.user?.name.length >= 9
                ? data?.user?.name.slice(0, 6) + "..."
                : data?.user?.name}
            </h3>
            <div className="flex items-center">
              <h3 className="text-gray-500 text-xs">
                {convertIntoTime(data?.latestMessage?.createdAt)}
              </h3>
            </div>
          </div>
          <h3 className="text-gray-500 text-xs">
            {data?.latestMessage?.message.length >= 25
              ? data?.latestMessage?.message.slice(0, 25) + "..."
              : data?.latestMessage?.message}
          </h3>
        </div>
      </div>
      <UserMenu
        setOpenUserMenu={setOpenUserMenu}
        chat_id={data?.chat_id}
        setUserChats={setUserChats}
        userData={data?.user}
      />
      {/* <hr className=" bg-slate-700 border-t border-gray-300 my-1" /> */}
    </div>
  );
};

export default Chat;
