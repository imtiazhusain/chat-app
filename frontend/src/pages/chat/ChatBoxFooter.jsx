import { useRef, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useGlobalState } from "../../context/globalStateProvider";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoDocumentAttach } from "react-icons/io5";
import axios from "../../config/axios";
import Spinner from "../../components/Spinner";
import Snackbar from "../../components/Snackbar";

const ChatBoxFooter = ({ setMessages }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const { state, dispatch } = useGlobalState();
  const fileInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState("");

  const { selectedChat, user } = state;
  const handleChange = (event) => {
    setMessage(event.target.value);

    // isT logic
    if (!socket) return;

    socket.emit("typing", selectedChat?.chat_id);

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength) {
        socket.emit("stopTyping", selectedChat?.chat_id);
        // setIsTyping(false);
      }
    }, timerLength);
  };
  const handleSendMessage = async () => {
    setLoading(true);
    const result = await addNewMessages(
      message,
      imagePreviewUrl,
      fileAttachment
    );
  };

  const handleFileAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setFileAttachment(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewMessages = async (message, imagePreviewUrl, fileAttachment) => {
    let messageObj = {
      message: message,
      createdAt: new Date().toISOString(),
      sender: user?._id,
      attachedFile: null,
    };
    if (imagePreviewUrl) {
      messageObj.attachedFile = imagePreviewUrl;
    }

    const createNewMessage = async () => {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("receiver_id", selectedChat?.user?._id);
      if (fileAttachment) {
        formData.append("profile_pic", fileAttachment);
      }

      try {
        // setLoading(true);
        const response = await axios.post(`/message/send_message`, formData, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            // "Content-Type": "application/json", because we are using images so that content-type will be multipart/form-data but you can also remove this axios will decide it automatically
          },
        });

        setMessages((pre) => [...pre, messageObj]);

        setMessage("");
        setFileAttachment(null);
        setImagePreviewUrl(null);

        fileInputRef.current.value = "";
      } catch (error) {
        console.log(error);
        setOpenSnackbar(true);
        setErrorMessage(
          error.response.data.message
            ? error.response.data.message
            : "Something went wrong"
        );
        setType("error");
      } finally {
        setLoading(false);
      }
    };
    createNewMessage();
  };

  return (
    <div className="flex items-center justify-between border border-gray-300  bg-white mt-3 rounded-full px-4">
      <div
        className=" text-slate-900 cursor-pointer"
        onClick={handleFileAttachmentClick}
      >
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-5" />
        ) : (
          <IoDocumentAttach size={25} />
        )}
      </div>
      <input
        type="text"
        className=" pl-8 py-2 outline-none w-full  rounded-full"
        placeholder="Type Message..."
        value={message}
        onChange={handleChange}
        autoFocus
      />
      <button
        className=" text-slate-900 cursor-pointer disabled:cursor-not-allowed"
        onClick={handleSendMessage}
        disabled={loading}
      >
        {loading ? <Spinner /> : <RiSendPlaneFill size={25} />}
      </button>

      {openSnackbar && (
        <Snackbar
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          message={ErrorMessage}
          type={type}
        />
      )}
    </div>
  );
};

export default ChatBoxFooter;
