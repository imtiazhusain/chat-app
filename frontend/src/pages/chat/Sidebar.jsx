import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GoPencil } from "react-icons/go";
import { useGlobalState } from "../../context/globalStateProvider";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import Chats from "./Chats";
import axios from "../../config/axios";
import { Promise } from "mongoose";
const Sidebar = () => {
  const { state, dispatch } = useGlobalState();

  const { user } = state;

  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`chat/get_all_chats`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        });
        setUserChats(response?.data?.chats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.access_token]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Avatar alt={user.name} src={user.profile_pic} />
          <h3 className="text-slate-800 font-semibold tracking-wide">Kate</h3>
        </div>
        <div className="flex justify-between bg-slate-900 hover:bg-slate-950 rounded-full p-3 shadow-md text-white items-center gap-2">
          <GoPencil size={20} />

          <button className="">New Chat</button>
        </div>
      </div>

      <div className="flex items-center border border-gray-300  bg-white mt-3 rounded-full">
        <div className="pl-3 text-gray-500">
          <FaSearch />
        </div>
        <input
          type="search"
          className=" px-4 py-2 outline-none"
          placeholder="Search..."
        />
      </div>

      <hr className="  bg-slate-700 border-t border-gray-300 my-4" />
      <Chats data={userChats} loading={loading} />
    </div>
  );
};

export default Sidebar;
