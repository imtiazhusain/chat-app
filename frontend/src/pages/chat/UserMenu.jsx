import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoSettings } from "react-icons/io5";
import { IconButton } from "@mui/material";
import { IoIosSettings, IoMdMore } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { FaDeleteLeft, FaPencil } from "react-icons/fa6";
import { useGlobalState } from "../../context/globalStateProvider";
import { useNavigate } from "react-router-dom";
import { MdAutoDelete, MdBlock, MdOutlineAccountCircle } from "react-icons/md";
import Snackbar from "../../components/Snackbar";
import axios from "../../config/axios";
import UserProfile from "./UserProfile";

export default function UserMenu({
  setOpenUserMenu,
  chat_id,
  setUserChats,
  userData,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [openProfileModel, setOpenProfileModel] = useState(false);

  const { state, dispatch } = useGlobalState();
  const { user } = state;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteChat = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/chat/delete_chat/${chat_id}`);

      setUserChats((prevChats) =>
        prevChats.filter((chat) => chat.chat_id !== chat_id)
      );
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setMessage(
        error?.response?.data?.message
          ? error.response.data.message
          : "Something went wrong"
      );
      setType("error");
    } finally {
      setLoading(false);
    }
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    setOpenProfileModel(true);
    setAnchorEl(null);
  };

  return (
    <div className="">
      <IconButton
        aria-label="delete"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className=""
      >
        <IoMdMore />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleViewProfile}>
          <div className="flex gap-2 items-center justify-center">
            <MdOutlineAccountCircle size={20} />
            View Profile
          </div>
        </MenuItem>
        <MenuItem onClick={handleDeleteChat}>
          <div className="flex gap-2 items-center justify-center">
            <MdAutoDelete size={20} />
            {loading ? "Deleting Chat ..." : "Delete Chat"}
          </div>
        </MenuItem>
      </Menu>

      {openSnackbar && (
        <Snackbar
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          message={message}
          type={type}
        />
      )}

      {openProfileModel && (
        <UserProfile
          setOpenProfileModel={setOpenProfileModel}
          userData={userData}
        />
      )}
    </div>
  );
}
