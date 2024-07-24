import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const GlobalStateContext = createContext();

// Create a custom hook to use the context
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};

// Reducer function for updates
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT_USER":
      return { ...state, user: null };

    case "SET_SIDEBAR":
      return { ...state, isSidebarOpen: action.payload };

    case "SET_SELECTED_CHAT":
      return { ...state, selectedChat: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const GlobalStateProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [state, dispatch] = useReducer(globalReducer, {
    user: userInfo ? userInfo : null,
    selectedChat: null,
    isSidebarOpen: false,
  });

  // Value to be passed to context consumers
  const value = { state, dispatch };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};
