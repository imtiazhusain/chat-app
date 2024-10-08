import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { useGlobalState } from "../../context/globalStateProvider";
import { useNavigate } from "react-router-dom";

export default function SettingMenu({ setOpenEditProfileModel }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { dispatch } = useGlobalState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditProfile = () => {
    setOpenEditProfileModel(true);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");

    dispatch({ type: "LOGOUT_USER" });
    setAnchorEl(null);
    navigate("/login");
  };

  return (
    <div className="mt-2 bg-slate-900 shadow-lg w-14 rounded-e-xl  relative right-4 ">
      <IconButton
        aria-label="delete"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IoSettingsOutline color="white" />
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
        <MenuItem onClick={handleEditProfile}>
          <div className="flex gap-2 items-center justify-center">
            <FaPencil size={20} />
            Edit Profile
          </div>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <div className="flex gap-2 items-center justify-center">
            <IoMdLogOut size={20} />
            Logout
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
