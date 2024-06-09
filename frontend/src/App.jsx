import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <div className="font-popins  h-screen w-full bg-image">
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="chat-page" element={<Chat />} />

          {/* <Route path="profile" element={userData ? <Profile /> : <Login />} />
          <Route path="*" element={<PageNotFound />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
