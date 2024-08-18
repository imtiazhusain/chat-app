import React, { useEffect, useRef, useState } from "react";
import Dialog from "../../components/Dialog";
import { IoCloseOutline } from "react-icons/io5";
import { Avatar } from "@mui/material";
import axios from "../../config/axios";
import Snackbar from "../../components/Snackbar";
import { useGlobalState } from "../../context/globalStateProvider";
import { FaCamera } from "react-icons/fa";
const EditUserProfile = ({ setOpenEditProfileModel, userData }) => {
  const [userInputs, setUserInputs] = useState({});
  const [hovered, setHovered] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(userData?.profile_pic);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const { state, dispatch } = useGlobalState();

  const { user } = state;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setUserInputs((values) => ({ ...values, profile_pic: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setUserInputs({
      name: userData?.name,
      email: userData?.email,
      profile_pic: userData?.profile_pic,
      user_id: userData?._id,
    });
  }, [userData]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserInputs((values) => ({ ...values, [name]: value }));
  };
  const EditProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", userInputs?.name);
    formData.append("email", userInputs?.email);
    formData.append("profile_pic", userInputs?.profile_pic);
    formData.append("user_id", userInputs?.user_id);
    try {
      const response = await axios.put("/user/edit_user", formData);
      setOpenSnackbar(true);
      setMessage("User updated Successfully");
      setType("success");

      let dataFromApi = response?.data?.data;

      let tempUser = {
        ...user,
        profile_pic: dataFromApi.profile_pic,
        email: dataFromApi.email,
        name: dataFromApi.name,
      };

      dispatch({ type: "SET_USER", payload: tempUser });
      localStorage.setItem("userInfo", JSON.stringify(tempUser));
    } catch (error) {
      setOpenSnackbar(true);
      setMessage(
        error.response.data.message
          ? error.response.data.message
          : "Something went wrong"
      );
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <div className="bg-white w-80  h-96 p-2 rounded-md ">
          <div className="grid place-content-end">
            <IoCloseOutline
              onClick={() => setOpenEditProfileModel(false)}
              className="cursor-pointer bg-red-500 rounded-full p-1 text-white"
              size={25}
            />
          </div>
          <div className="flex items-center flex-col gap-3">
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative w-40 h-40"
            >
              <Avatar
                alt={userInputs?.name}
                src={imagePreviewUrl}
                sx={{ width: 156, height: 156 }}
                className={` w-full h-full object-cover rounded-full shadow-lg ${
                  hovered ? "blur-sm " : ""
                } transition duration-300`}
              />

              {hovered && (
                <div
                  onClick={handleButtonClick}
                  className="absolute inset-0 flex items-center justify-center  text-white text-sm font-bold cursor-pointer rounded-full "
                >
                  <FaCamera size={30} />
                </div>
              )}

              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-3 gap-2 flex flex-col">
              <input
                type="text"
                placeholder="name@company.com"
                value={userInputs.name || ""}
                onChange={handleChange}
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2 outline-none"
              />

              <input
                type="text"
                placeholder="name@company.com"
                value={userInputs.email || ""}
                onChange={handleChange}
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2 outline-none"
              />

              <button
                className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300  rounded-lg mt-2 disabled:cursor-not-allowed"
                onClick={EditProfile}
                disabled={loading}
              >
                {loading ? "Loading..." : " Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

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

export default EditUserProfile;
