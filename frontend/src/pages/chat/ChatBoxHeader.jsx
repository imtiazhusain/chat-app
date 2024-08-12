import { useState } from "react";
import OnlineDot from "../../components/onlineDot";
import { Avatar, IconButton } from "@mui/material";
import UserProfile from "./UserProfile";
import { useSocketContext } from "../../context/SocketContext";
import { IoMenu } from "react-icons/io5";
import { useGlobalState } from "../../context/globalStateProvider";
import { IoMdArrowBack, IoMdArrowRoundBack } from "react-icons/io";

const ChatBoxHeader = ({ data, isTyping }) => {
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(data.user._id);
  const { dispatch, state } = useGlobalState();
  const { isSidebarOpen } = state;

  const handleSidebar = () => {
    dispatch({ type: "SET_SELECTED_CHAT", payload: null });
  };
  return (
    <div className="flex justify-between items-center">
      <div className="md:hidden  rounded-full" onClick={handleSidebar}>
        <IconButton aria-label="open-sidebar">
          <IoMdArrowRoundBack color="#020617 " />
        </IconButton>
      </div>
      <div className="flex gap-3 items-center my-4">
        {isOnline ? (
          <OnlineDot
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt={data?.user?.name}
              src={data?.user?.profile_pic}
              onClick={() => setOpenProfileModel(true)}
              className="cursor-pointer"
            />
          </OnlineDot>
        ) : (
          <Avatar
            alt={data?.user?.name}
            src={data?.user?.profile_pic}
            onClick={() => setOpenProfileModel(true)}
            className="cursor-pointer"
          />
        )}

        <div className="flex flex-col gap-0  w-full">
          <h3
            className="text-slate-800 font-semibold tracking-wide cursor-pointer"
            onClick={() => setOpenProfileModel(true)}
          >
            {data?.user?.name}
          </h3>

          {isTyping ? (
            <h3
              className="text-green-500 text-xs cursor-pointer tracking-wider"
              onClick={() => setOpenProfileModel(true)}
            >
              typing...
            </h3>
          ) : isOnline ? (
            <h3
              className="text-green-500 text-xs cursor-pointer tracking-wider"
              onClick={() => setOpenProfileModel(true)}
            >
              Online
            </h3>
          ) : (
            <h3
              className="text-gray-500 text-xs cursor-pointer tracking-wider"
              onClick={() => setOpenProfileModel(true)}
            >
              Offline
            </h3>
          )}
        </div>
      </div>
      <div></div>
      {openProfileModel && (
        <UserProfile
          setOpenProfileModel={setOpenProfileModel}
          userData={data?.user}
        />
      )}
    </div>
  );
};

export default ChatBoxHeader;
