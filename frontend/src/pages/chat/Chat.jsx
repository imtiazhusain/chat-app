import { Avatar } from "@mui/material";
import React from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import convertIntoTime from "../../utils/convertIntoTime";

const Chat = ({ data }) => {
  const { state, dispatch } = useGlobalState();

  const { selectedChat } = state;
  console.log(data);
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

export default Chat;
