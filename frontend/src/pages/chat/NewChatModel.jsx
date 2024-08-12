import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Dialog from "../../components/Dialog";
import { IoCloseOutline } from "react-icons/io5";
import axios from "../../config/axios";
import { useGlobalState } from "../../context/globalStateProvider";
import { Avatar } from "@mui/material";
import Snackbar from "../../components/Snackbar";

const AllUsers = ({ data, handleCreateNewChat }) => {
  const [loading, setLoading] = useState(false);
  const handleAddUserClick = async () => {
    setLoading(true);
    const result = await handleCreateNewChat(data?._id);
    setLoading(false);
  };
  return (
    <div>
      <div
        className={`flex gap-3 items-center justify-between my-4  px-2 py-1 
           rounded-md `}
      >
        <Avatar alt="user image" src={data?.profile_pic} />
        <div className="flex flex-col gap-0  ">
          <div className="flex flex-col justify-start  ">
            <h3 className="text-slate-800 font-medium tracking-wide">
              {data.name}
            </h3>
            <h3 className="text-gray-500 text-xs">
              {/* {data?.email.length >= 12
                ? data?.email.slice(0, 12) + "..."
                : data?.email} */}

              {data?.email.length >= 12
                ? data?.email.slice(0, 5) + "..." + data?.email.slice(-7)
                : data?.email}
            </h3>
          </div>
        </div>

        <button
          className="ml-auto bg-slate-900 hover:bg-slate-950 rounded-full py-2 px-4  text-white text-sm"
          onClick={handleAddUserClick}
        >
          {loading ? "Loading..." : "Start Chat"}
        </button>
      </div>
      <hr className=" bg-slate-700 border-t border-gray-300 my-1" />
    </div>
  );
};
const NewChatModel = ({ setOpenNewChatModel, handleCreateNewChat }) => {
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useGlobalState();
  const [users, setUsers] = useState([]);
  const [searchQuery, SetSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const { user } = state;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`user/get_all_users`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        });
        setUsers(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const queryWords = lowercasedQuery.split(" ").filter((word) => word);

    const filtered = users.filter((user) => {
      const userName = user.name.toLowerCase();
      return queryWords.every((queryWord) => {
        const regex = new RegExp(`\\b${queryWord}`, "i");
        return regex.test(userName);
      });
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const searchUsers = (e) => {
    SetSearchQuery(e.target.value);
  };

  return (
    <>
      <Dialog>
        <div className="bg-white w-80  h-96 p-2 rounded-md ">
          <div className="grid place-content-end">
            <IoCloseOutline
              onClick={() => setOpenNewChatModel(false)}
              className="cursor-pointer bg-red-500 rounded-full p-1 text-white"
              size={25}
            />
          </div>
          <div className="flex items-center justify-between border border-gray-300  bg-white mt-3 rounded-full">
            <input
              type="search"
              className=" px-4 py-2 outline-none rounded-full w-full"
              placeholder="Search..."
              value={searchQuery}
              onChange={searchUsers}
            />
            <div className="mr-3 text-gray-500 cursor-pointer">
              <FaSearch />
            </div>
          </div>
          <div className="mt-3 overflow-y-auto h-64">
            {loading ? (
              "Fetching Users..."
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <AllUsers
                  data={user}
                  handleCreateNewChat={handleCreateNewChat}
                  key={user._id}
                />
              ))
            ) : (
              <div className="mt-3">
                <h3 className="text-center"> No Users Found</h3>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NewChatModel;
