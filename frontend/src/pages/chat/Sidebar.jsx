import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GoPencil } from "react-icons/go";
import { useGlobalState } from "../../context/globalStateProvider";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import SidebarChat from "./SidebarChat";
import axios from "../../config/axios";
import NewChatModel from "./NewChatModel";
import extractSenderData from "../../utils/extractSenderData";
import Snackbar from "../../components/Snackbar";
import UserProfile from "./UserProfile";
import OnlineDot from "../../components/onlineDot";
import SettingMenu from "./SettingMenu";
import EditUserProfile from "./EditUserProfile";

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
        console.log(processedChats);
        setUserChats(processedChats);
        // setUserChats([
        //   {
        //     latestMessage: {
        //       _id: "6690e64fa74174abc17bbf7d",
        //       sender: {
        //         _id: "6690e514a74174abc17bbf4f",
        //         name: "Guest",
        //         email: "guest@gmail.com",
        //         profile_pic: "profile_pic_1720772269614.jpg",
        //       },
        //       receiver: "666620199245ff3af8c5269b",
        //       message: "i am fine what about you?asdf",
        //       createdAt: "2024-07-12T08:16:15.430Z",
        //       updatedAt: "2024-07-12T08:16:15.430Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "6690e514a74174abc17bbf4f",
        //       name: "Guest",
        //       email: "guest@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1720772269614.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "6690e5e3a74174abc17bbf64",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668fb7e9397b6c23b10ffb55",
        //       sender: {
        //         _id: "666ae08eb11e4fd46fa90c3e",
        //         name: "Max",
        //         email: "max@gmail.com",
        //         profile_pic: "profile_pic_1718280333397.jpg",
        //       },
        //       receiver: "666620199245ff3af8c5269b",
        //       message: "hi",
        //       createdAt: "2024-07-11T10:46:01.027Z",
        //       updatedAt: "2024-07-11T10:46:01.027Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666ae08eb11e4fd46fa90c3e",
        //       name: "Max",
        //       email: "max@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b099e885f65fdac66a802",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        //   {
        //     latestMessage: {
        //       _id: "668aa3ac9fe477ab292dcc09",
        //       sender: {
        //         _id: "666620199245ff3af8c5269b",
        //         name: "kate",
        //         email: "kate@gmail.com",
        //         profile_pic: "profile_pic_1720694666605.jpg",
        //       },
        //       receiver: "666adb9a27f68c16ce8abbe0",
        //       message: "hi",
        //       createdAt: "2024-07-07T14:18:20.488Z",
        //       updatedAt: "2024-07-07T14:18:20.488Z",
        //       __v: 0,
        //     },
        //     user: {
        //       _id: "666adb9a27f68c16ce8abbe0",
        //       name: "John Doe",
        //       email: "john@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718279062904.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666b09c3885f65fdac66a806",
        //   },
        //   {
        //     latestMessage: null,
        //     user: {
        //       _id: "666e025d815261a8ead51d9f",
        //       name: "Chris",
        //       email: "chris@gmail.com",
        //       profile_pic:
        //         "http://localhost:2100/public/uploads/profile_pic_1718280333397.jpg",
        //       is_verified: false,
        //       __v: 0,
        //     },
        //     chat_id: "666e169073142c265bd4329a",
        //   },
        // ]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.access_token]);

  useEffect(() => {
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
      console.log(response);
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
    <div className="bg-[#f0f0f0]  px-4 pb-2 pt-4 ">
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

      <div className="">
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
            {/* <GoPencil size={20} /> */}

            <button className="">New Chat</button>
          </div>
        </div>

        <div className="flex items-center border border-gray-300  bg-white mt-3 rounded-full w-full">
          <div className="pl-3 text-gray-500">
            <FaSearch />
          </div>
          <input
            type="search"
            className=" px-4 py-2 outline-none rounded-full w-full"
            placeholder="Search..."
            value={searchQuery}
            onChange={searchUsers}
          />
        </div>

        <hr className="  bg-slate-700 border-t border-gray-300 my-4" />

        {/* show chats */}
        <div className=" h-[900px] md:h-[370px] overflow-y-auto">
          {loading ? (
            "Loading Chats ..."
          ) : filteredChats.length > 0 ? (
            <>
              {filteredChats.map((chat) => (
                <SidebarChat data={chat} key={chat._id} />
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
