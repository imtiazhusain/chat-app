import React from "react";
import ChatBox from "./ChatBox";
import Sidebar from "./Sidebar";

const Chat = () => {
  return (
    <div className="md:p-4  md:grid md:place-content-center h-full  ">
      <div className="grid grid-cols-12  h-full md:h-auto ">
        <div className=" hidden md:block md:col-span-4  rounded-s-md">
          <Sidebar />
        </div>
        <div className="md:max-w-[610px] md:h-[568px] h-screen col-span-12 md:col-span-8 bg-white md:p-4 rounded-e-md">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Chat;
