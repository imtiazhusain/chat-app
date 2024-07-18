import Login from "./pages/login/Login.page";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup.page";
import Chat from "./pages/chat/Chat.page";
import { useGlobalState } from "./context/globalStateProvider";
import VerifyUser from "./pages/verify_user/VerifyUser.page";

function App() {
  const { state } = useGlobalState();
  const { user } = state;
  return (
    <div className="font-popins  h-screen w-full bg-image">
      <Routes>
        <Route path="/">
          <Route index element={user ? <Chat /> : <Login />} />
          <Route path="login" element={user ? <Chat /> : <Login />} />
          <Route path="signup" element={user ? <Chat /> : <Signup />} />
          <Route path="chat-page" element={user ? <Chat /> : <Login />} />
          <Route
            path="verify-user"
            // element={user ? <VerifyUser /> : <Login />}
            element={<VerifyUser />}
          />

          {/* <Route path="profile" element={userData ? <Profile /> : <Login />} />
          <Route path="*" element={<PageNotFound />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
