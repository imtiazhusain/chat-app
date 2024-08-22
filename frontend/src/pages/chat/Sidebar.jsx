import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import SidebarChat from "./SidebarChat";
import axios from "../../config/axios";
import NewChatModel from "./NewChatModel";
import extractSenderData from "../../utils/extractSenderData";
import Snackbar from "../../components/Snackbar";
import UserProfile from "./UserProfile";
import SettingMenu from "./SettingMenu";
import EditUserProfile from "./EditUserProfile";
import useListenNewChat from "../../../hooks/useListenNewChat";

const Sidebar = () => {
  const { state, dispatch } = useGlobalState();

  const { user } = state;

  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openNewChatModel, setOpenNewChatModel] = useState(false);
  const [filteredChats, setFilteredChats] = useState(userChats);

  const [searchQuery, SetSearchQuery] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const [openEditProfileModel, setOpenEditProfileModel] = useState(false);

  useListenNewChat({ userChats, setUserChats });
  console.log("user chats ");
  console.log(userChats);
  console.log(filteredChats);

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

        const processedChats = extractSenderData(
          response?.data?.chats,
          user._id
        );
        setUserChats(processedChats);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    if (user?.access_token) {
      fetchChats();
    }
  }, [user?.access_token]);

  useEffect(() => {
    console.log("filtered chat useeffect run...");
    const lowercasedQuery = searchQuery.toLowerCase();
    const queryWords = lowercasedQuery.split(" ").filter((word) => word);

    const filtered = userChats.filter((user) => {
      const userName = user.user.name.toLowerCase();
      return queryWords.every((queryWord) => {
        const regex = new RegExp(`\\b${queryWord}`, "i");
        return regex.test(userName);
      });
    });

    setFilteredChats(filtered);
  }, [searchQuery, userChats]);

  const searchUsers = (e) => {
    SetSearchQuery(e.target.value);
  };
  const handleCreateNewChat = async (receiver_id) => {
    try {
      const response = await axios.post(
        `chat/create_new_chat/${receiver_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpenNewChatModel(false);
      setFilteredChats((pre) => [response?.data?.chat, ...pre]);
      dispatch({ type: "SET_SELECTED_CHAT", payload: response?.data?.chat });
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setMessage(
        error.response.data.message
          ? error.response.data.message
          : "Something went wrong"
      );
      setType("error");
    }
  };

  return (
    <div className="bg-[#f0f0f0]  px-4 pb-2 pt-4 h-svh md:h-auto">
      {openNewChatModel && (
        <NewChatModel
          setOpenNewChatModel={setOpenNewChatModel}
          handleCreateNewChat={handleCreateNewChat}
        />
      )}
      {openProfileModel && (
        <UserProfile
          setOpenProfileModel={setOpenProfileModel}
          userData={user}
        />
      )}

      {openEditProfileModel && (
        <EditUserProfile
          setOpenEditProfileModel={setOpenEditProfileModel}
          userData={user}
        />
      )}

      <div className="flex  flex-col h-full">
        <div className="flex items-center justify-between  ">
          <div className="flex gap-3 items-center">
            <Avatar
              alt={user.name}
              src={user.profile_pic}
              onClick={() => setOpenProfileModel(true)}
              className="cursor-pointer"
            />
            <h3
              className="text-slate-800 font-semibold tracking-wide cursor-pointer"
              onClick={() => setOpenProfileModel(true)}
            >
              {user.name}
            </h3>
          </div>
          <div
            className="flex justify-between bg-slate-900 hover:bg-slate-950 rounded-full px-3 py-2 shadow-md text-white items-center gap-2"
            onClick={() => setOpenNewChatModel(true)}
          >
            <button className="">New Chat</button>
          </div>
        </div>

        <div className="flex items-center border border-gray-300  bg-white mt-3 rounded-full w-full">
          <div className="pl-3 text-gray-500">
            <FaSearch />
          </div>
          <input
            type="search"
            className=" px-4 py-2 outline-none rounded-full w-full bg-white"
            placeholder="Search..."
            value={searchQuery}
            onChange={searchUsers}
          />
        </div>

        <hr className="  bg-slate-700 border-t border-gray-300 my-4" />

        {/* show chats */}
        <div className=" flex-grow md:h-[370px] overflow-y-auto">
          {loading ? (
            "Loading Chats ..."
          ) : filteredChats.length > 0 ? (
            <>
              {filteredChats.map((chat) => (
                <SidebarChat
                  data={chat}
                  key={chat.chat_id}
                  setUserChats={setUserChats}
                />
              ))}
            </>
          ) : (
            "No Chat Found"
          )}
          {/* </div> */}
        </div>
        <SettingMenu setOpenEditProfileModel={setOpenEditProfileModel} />
      </div>

      {openSnackbar && (
        <Snackbar
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          message={message}
          type={type}
        />
      )}
    </div>
  );
};

export default Sidebar;
