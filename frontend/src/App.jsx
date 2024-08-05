import Login from "./pages/login/Login.page";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup.page";
import Chat from "./pages/chat/Chat.page";
import { useGlobalState } from "./context/globalStateProvider";
import VerifyUser from "./pages/verify_user/VerifyUser.page";
import ProtectedRoutes from "./auth/ProtectedRoutes";

function App() {
  const { state } = useGlobalState();
  const { user } = state;
  return (
    <div className="font-popins  h-screen w-full bg-image">
      <Routes>
        {/* Routes visible only to unauthorized users */}
        <Route
          path="/"
          element={
            !user ? <Navigate to="/login" /> : <Navigate to="/chat-page" />
          }
        />
        <Route
          path="login"
          element={!user ? <Login /> : <Navigate to="/chat-page" />}
        />
        <Route
          path="signup"
          element={!user ? <Signup /> : <Navigate to="/chat-page" />}
        />
        <Route
          path="verify-user"
          element={!user ? <Navigate to="/login" /> : <VerifyUser />}
        />

        <Route
          path="chat-page"
          element={!user ? <Navigate to="/login" /> : <Chat />}
        />

        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;
