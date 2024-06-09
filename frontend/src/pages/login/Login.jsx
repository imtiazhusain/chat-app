import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "../../components/Snackbar";
import axios from "../../config/axios";
const Login = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isErrors, setIsErrors] = useState({ email: "", password: "" });

  const location = useLocation();
  const navigate = useNavigate();

  console.log(inputs);
  // if user come form signup form show msg to login
  useEffect(() => {
    console.log("navigated from signup page");
    if (location.state) {
      setOpenSnackbar(true);

      setMessage("Account Created Please Login");
      setType("success");
    }
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.log(inputs);
  };

  function validateInputs() {
    let newErrors = {};
    if (!inputs.email) {
      newErrors.email = "Email is required";
    }
    if (!inputs.password) {
      newErrors.password = "Password is required";
    }

    setIsErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) {
      setLoading(false);
      return true;
    }
    return false;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // for input validation
    const shouldReturn = validateInputs();
    console.log(shouldReturn);
    console.log(isErrors);
    if (shouldReturn) {
      return;
    }

    console.log(inputs);
    try {
      const response = await axios.post("/user/login", inputs);
      // Handle the response data here
      console.log(response.data);

      localStorage.setItem("userInfo", JSON.stringify(response.data.data));

      navigate("/chat-page");
    } catch (error) {
      console.log(error);
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
    <div className=" grid place-items-center h-screen">
      <div className="bg-white w-80  p-4 rounded-md ">
        <h1 className=" text-center font-bold text-2xl tracking-wide">
          Welcome Back!
        </h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mt-9">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="name@company.com"
                value={inputs.email || ""}
                onChange={handleChange}
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg  w-full p-2.5 outline-none"
              />
              {isErrors.email && (
                <span className="text-red-600 text-sm">{isErrors.email}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={inputs.password || ""}
                onChange={handleChange}
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 s rounded-lg  w-full p-2.5 outline-none"
              />
              {isErrors.password && (
                <span className="text-red-600 text-sm">
                  {isErrors.password}
                </span>
              )}
            </div>
            <button className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300 font-semibold rounded-lg mt-2">
              Login
            </button>
            <div>
              <h3 className="text-gray-500">
                Don't have an account ?
                <Link to="/signup" className="text-slate-900 font-semibold ">
                  {" "}
                  Signup
                </Link>
              </h3>
            </div>
          </div>
        </form>
      </div>

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

export default Login;
