import { useState } from "react";
// import {Link} from 'react-router-dom'
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import { API, pdfCompanyName, smHyphenName } from "../../utils/constants";
import axios from "axios";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    email: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (!isEmailValid(loginObj.email)) {
      return setErrorMessage("Phone number not valid!");
    } else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      try {
        const response = await axios.post(`${API}/auth/signin`, loginObj);
        console.log("erepsonse is",response)
        if (response.status === 200) {
          const user = response.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAdmin", JSON.stringify(user.isAdmin));

          const tokenExpiry = new Date().getTime() + 5 * 24 * 60 * 60 * 1000; // 5 days
          const tokenData = {
            token: user.accessToken,
            expiry: tokenExpiry,
          };
          localStorage.setItem("accessToken", JSON.stringify(tokenData));
          window.location.href = "/app/welcome";
        } else {
          return setErrorMessage("Phone number or Password is Wrong");
        }
      } catch (error) {
        if (error.response) {
          setErrorMessage("Phone number id or Password is Wrong");
          // console.log("error", error.response);
        }
      }
      setLoading(false);
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // const isEmailValid = (email) => {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="hidden md:block">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <div className="md:hidden">
              <h1 className="text-2xl md:text-3xl text-center whitespace-wrap font-bold ">
                <img
                  src="/logo192.png"
                  className="w-12 hidden md:block h-12 object-contain mr-2 mask mask-circle"
                  alt={`${smHyphenName}-logo`}
                />
                {pdfCompanyName}
              </h1>
            </div>

            <h2 className="text-2xl md:block hidden font-semibold mb-2 text-center">
              Login
            </h2>

            <h2 className="text-2xl font-semibold mb-2 text-center">
              <span className="md:hidden block">
                <img
                  src="/logo192.png"
                  className="w-12 h-12 object-contain inline-block mr-2 mask mask-circle"
                  alt={`${smHyphenName}-logo`}
                />
                Login
              </span>
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />

                <div className="relative">
                  <InputText
                    type={showPassword ? "text" : "password"}
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                  <button
                    className="text-sm absolute right-0 top-[62%] mr-2"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {!showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                }
              >
                Login
              </button>

              <div className="text-center mt-4">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Register
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
