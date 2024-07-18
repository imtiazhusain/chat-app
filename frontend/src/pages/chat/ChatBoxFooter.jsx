import { useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useGlobalState } from "../../context/globalStateProvider";
import { RiSendPlaneFill } from "react-icons/ri";

const ChatBoxFooter = ({ addNewMessage, isTyping, setIsTyping }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const { state, dispatch } = useGlobalState();

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
    const result = await addNewMessage(message);
    setMessage("");
    setLoading(false);
  };
  return (
    <div className="flex items-center border border-gray-300  bg-white mt-3 rounded-full">
      <input
        type="text"
        className=" pl-8 py-2 outline-none w-[90%]  rounded-full"
        placeholder="Search..."
        value={message}
        onChange={handleChange}
        autoFocus
      />
      <div
        className=" text-slate-900 cursor-pointer"
        onClick={handleSendMessage}
      >
        {loading ? "Loading..." : <RiSendPlaneFill size={25} />}
      </div>
    </div>
  );
};

export default ChatBoxFooter;
