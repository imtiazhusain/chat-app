import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "../../components/Snackbar";
import axios from "../../config/axios";

const VerifyUser = () => {
  const [otpValue, setStopValue] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [type, setType] = useState("");
  const [resendCodeLoading, setResendCodeLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { tempUser } = location.state;
      console.log(tempUser);
      setUser(tempUser);
    }
  }, []);

  const handleChange = (event) => {
    setStopValue(event.target.value);
  };

  const verifyUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (otpValue === undefined) {
        setSnackbarMsg("Please provide OTP");
        setOpenSnackbar(true);
        setType("error");
        setLoading(false);

        return;
      }
      const data = {
        userId: user._id,
        OTP: otpValue,
      };

      const response = await axios.post("/user/verify_user", data);

      console.log(response);

      navigate("/login", {
        state: {
          signupSuccess: true,
        },
      });
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setSnackbarMsg(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Something went wrong"
      );
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (e) => {
    setResendCodeLoading(true);
    try {
      const data = {
        userId: user?._id,
        userEmail: user?.email,
      };

      const response = await axios.post("/user/send_otp", data);

      console.log(response);

      setType("success");
      setSnackbarMsg("Code resent successfully");
      setOpenSnackbar(true);
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setSnackbarMsg(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Something went wrong"
      );
      setType("error");
    } finally {
      setResendCodeLoading(false);
    }
  };

  return (
    <div className=" grid place-items-center h-screen">
      <div className="bg-white w-[512px]  p-4 rounded-md mt-3 ">
        <h1 className="text-center font-medium text-lg mb-3">
          User Verification
        </h1>
        <h2 className="mb-3">
          We have send an OTP at{" "}
          {user?.email?.substring(0, 3) +
            "*****" +
            user?.email?.substring(user?.email.indexOf("@"))}
        </h2>
        <form action="" onSubmit={verifyUser}>
          <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
            Enter Verification Code
          </label>
          <input
            type="text"
            placeholder="John Doe"
            name="otp"
            value={otpValue || ""}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
          />
          <button className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300 font-semibold rounded-lg mt-3">
            {loading ? "Loading..." : "Verify"}
          </button>
        </form>

        <button
          className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300 font-semibold rounded-lg mt-3"
          onClick={resendCode}
        >
          {resendCodeLoading ? "Loading..." : "Resend Code"}
        </button>
      </div>

      {openSnackbar && (
        <Snackbar
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          message={snackbarMsg}
          type={type}
        />
      )}
    </div>
  );
};

export default VerifyUser;
