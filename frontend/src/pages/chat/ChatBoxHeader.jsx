import { useState } from "react";
import OnlineDot from "../../components/onlineDot";
import { Avatar } from "@mui/material";
import UserProfile from "./UserProfile";
import { useSocketContext } from "../../context/SocketContext";

const ChatBoxHeader = ({ data, isTyping }) => {
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(data.user._id);

  return (
    <>
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

      {openProfileModel && (
        <UserProfile
          setOpenProfileModel={setOpenProfileModel}
          userData={data?.user}
        />
      )}
    </>
  );
};

export default ChatBoxHeader;
