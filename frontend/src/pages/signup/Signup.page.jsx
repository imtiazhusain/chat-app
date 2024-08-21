import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "../../config/axios";
import Snackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [inputs, setInputs] = useState({ profile_pic: {} });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isErrors, setIsErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    if (name == "profile_pic") {
      setInputs((values) => ({ ...values, [name]: event.target.files[0] }));
    } else {
      const value = event.target.value;
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  // function isPasswordValid(password) {
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  //   return hasUpperCase && hasLowerCase && hasSpecialChar;
  // }

  function isPasswordValid(password) {
    // Check for at least one uppercase letter
    const hasUpperCase = /[A-Z]/.test(password);

    // Check for at least one lowercase letter
    const hasLowerCase = /[a-z]/.test(password);

    // Check for any character that is not a letter or number, i.e., special characters
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    console.log(hasSpecialChar);

    // Ensure all conditions are met
    return hasUpperCase && hasLowerCase && hasSpecialChar;
  }

  function validateInputs() {
    let newErrors = {};
    if (!inputs.name) {
      newErrors.name = "Name is required";
    }
    if (inputs.name && inputs.name.length <= 2) {
      newErrors.name = "Name should be at least 3 characters";
    }

    if (!inputs.email) {
      newErrors.email = "Email is required";
    }

    if (!inputs.password) {
      newErrors.password = "Password is required";
    }
    if (inputs.password && inputs.password.length <= 7) {
      newErrors.password = "Password must have 7+ characters";
    }

    if (inputs.password && !isPasswordValid(inputs.password)) {
      newErrors.password =
        "Password must have  7+ chars, 1 uppercase, 1 lowercase, 1 special char";
    }

    if (!inputs.confirm_password) {
      newErrors.confirm_password = "Confirm Password is required";
    }

    if (
      inputs.password &&
      inputs.confirm_password &&
      inputs.password != inputs.confirm_password
    ) {
      newErrors.confirm_password = "Passwords do not match!";
    }

    if (!inputs.profile_pic.name) {
      newErrors.profile_pic = "Please upload profile picture";
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
    if (shouldReturn) {
      return;
    }
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    formData.append("profile_pic", inputs.profile_pic);

    try {
      const response = await axios.post("/user/register_user", formData);

      console.log(response);
      navigate("/verify-user", {
        state: {
          tempUser: response.data.user,
        },
      });
    } catch (error) {
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
    <div className=" grid place-items-center h-screen ">
      <div className="bg-white w-[80%]  md:w-[512px]  p-4 rounded-md ">
        <div className="mb-4">
          <h1 className="font-bold text-base sm:text-2xl md:text-xl tracking-wide text-center">
            New Here ? Sign up now!
          </h1>
        </div>
        <form action="" className="" onSubmit={handleSubmit}>
          <div className="grid  md:grid-cols-2 md:gap-4 lg:gap-6 md:gap-y-6   grid-cols-1 gap-2">
            <div className="  space-y-2">
              <label htmlFor="" className="text-xs sm:text-sm md:text-xl ">
                Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                name="name"
                value={inputs.name || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full   p-2.5  outline-none placeholder:italic"
              />

              {isErrors.name && (
                <span className="text-red-600 text-sm">{isErrors.name}</span>
              )}
            </div>
            <div className="space-y-2 ">
              <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                Email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                name="email"
                value={inputs.email || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
              />
              {isErrors.email && (
                <span className="text-red-600 text-sm">{isErrors.email}</span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
              />
              {isErrors.password && (
                <span className="text-red-600 text-sm">
                  {isErrors.password}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="confirm_password"
                value={inputs.confirm_password || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  w-full p-2.5 outline-none placeholder:italic"
              />
              {isErrors.confirm_password && (
                <span className="text-red-600 text-sm">
                  {isErrors.confirm_password}
                </span>
              )}
            </div>

            <div className="space-y-2 ">
              <label htmlFor="" className="text-xs sm:text-sm md:text-xl">
                Upload Profile Pic
              </label>
              <input
                type="file"
                name="profile_pic"
                onChange={handleChange}
                className="  text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-slate-50 file:text-slate-700
      hover:file:bg-slate-100 file:cursor-pointer  "
                accept="image/*"
              />
              {isErrors.profile_pic && (
                <span className="text-red-600 text-sm block">
                  {isErrors.profile_pic}
                </span>
              )}
            </div>
          </div>

          <div>
            <button
              className="w-full bg-slate-900  py-2.5 text-white tracking-wider hover:bg-slate-950 transition-colors duration-300 font-semibold rounded-lg mt-3 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Account"}
            </button>
          </div>

          <div>
            <h3 className="text-gray-500 mt-2  md:text-end text-sm md:text-lg">
              Already having an account ?
              <Link to="/login" className="text-slate-900 font-semibold ">
                {" "}
                Login
              </Link>
            </h3>
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

export default Signup;
