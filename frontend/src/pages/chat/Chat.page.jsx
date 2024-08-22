import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Sidebar from "./Sidebar";
import { useGlobalState } from "../../context/globalStateProvider";
import useWindowSize from "../../hooks/UseWindowSize";

const Chat = () => {
  const { state } = useGlobalState();
  console.log(state);
  const { selectedChat, user } = state;
  console.log(selectedChat);
  // function useWindowSize() {
  //   const [size, setSize] = useState([window.innerWidth]);

  //   useEffect(() => {
  //     const handleResize = () => {
  //       setSize([window.innerWidth]);
  //     };

  //     window.addEventListener("resize", handleResize);
  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }, []);

  //   return size;
  // }

  const [windowWidth] = useWindowSize();
  const breakpointSm = 768; // Tailwind's 'sm' breakpoint

  const isSmallScreen = windowWidth < breakpointSm;

  console.log(isSmallScreen);
  return (
    <div className="md:p-4  md:grid md:place-content-center h-full  ">
      <div className="grid grid-cols-12  h-full md:h-auto ">
        {/* <div className=" col-span-full md:col-span-4  rounded-s-md">
          <Sidebar />
        </div> */}

        {(!isSmallScreen || selectedChat === null) && (
          <div
            className={`rounded-s-md col-span-12 ${
              isSmallScreen ? "col-span-full" : "col-span-4"
            }`}
          >
            <Sidebar />
          </div>
        )}

        {(!isSmallScreen || selectedChat !== null) && (
          <div
            className={`md:max-w-[610px] md:h-[568px] h-svh bg-white md:p-4 rounded-e-md col-span-12 ${
              isSmallScreen ? "col-span-full" : "col-span-8"
            }`}
          >
            {selectedChat !== null ? (
              <ChatBox />
            ) : (
              <div className="h-full  ">
                <div className="hidden md:grid md:place-content-center h-full">
                  <div className="flex items-center justify-center flex-col  gap-2">
                    <h2 className="text-3xl tracking-widest">
                      Welcome 👋 {user.name}
                    </h2>
                    <h3 className="text-lg">
                      {" "}
                      Select any chat to start conversation
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* <div className="md:max-w-[610px] md:h-[568px] h-svh col-span-full md:col-span-8 bg-white md:p-4 rounded-e-md">
          <ChatBox />
        </div> */}
      </div>
    </div>
  );
};

export default Chat;
