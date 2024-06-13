import React from "react";
import { useGlobalState } from "../../context/globalStateProvider";
import ChatBox from "./ChatBox";
import Sidebar from "./Sidebar";

const Chat = () => {
  const { state, dispatch } = useGlobalState();

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 bg-[#f0f0f0] p-4 rounded-s-md">
          <Sidebar />
        </div>
        <div className="col-span-8 bg-white p-4 rounded-e-md">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Chat;
