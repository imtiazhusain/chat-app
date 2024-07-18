import React from "react";
import Dialog from "../../components/Dialog";
import { IoCloseOutline } from "react-icons/io5";
import { Avatar } from "@mui/material";
import { useSocketContext } from "../../context/SocketContext";
import OnlineDot from "../../components/onlineDot";

const UserProfile = ({ setOpenProfileModel, userData }) => {
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(userData._id);

  return (
    <div>
      <Dialog>
        <div className="bg-white w-80  h-96 p-2 rounded-md ">
          <div className="grid place-content-end">
            <IoCloseOutline
              onClick={() => setOpenProfileModel(false)}
              className="cursor-pointer bg-red-500 rounded-full p-1 text-white"
              size={25}
            />
          </div>
          <div className="flex items-center flex-col gap-3">
            {isOnline ? (
              <OnlineDot
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={userData.name}
                  src={userData.profile_pic}
                  sx={{ width: 156, height: 156 }}
                  className="shadow-lg"
                />
              </OnlineDot>
            ) : (
              <Avatar
                alt={userData.name}
                src={userData.profile_pic}
                sx={{ width: 156, height: 156 }}
                className="shadow-lg"
              />
            )}
            <div className="mt-5">
              <h3 className="text-slate-800  tracking-wide text-center font-semibold text-2xl">
                {userData.name}
              </h3>
              <h3 className="text-gray-600  tracking-wide text-center">
                {userData.email}
              </h3>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
