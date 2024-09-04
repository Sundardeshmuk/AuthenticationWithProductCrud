import React, { useState, useEffect } from "react";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import axios from "axios";
import {
  API,
  API_TOKEN,
  lgHyphenName,
  pdfCompanyName,
} from "../../utils/constants";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function ChangePassword() {
  const INITIAL_REGISTER_OBJ = {
    password: "",
    verify_password: "",
  };
  const {id, token} = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const [ph, setPh] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    setRegisterObj((prevState) => ({
      ...prevState,
      contact: ph,
    }));
  }, [ph]);

  useEffect(() => {
    let interval;
    if (timer > 0 && showOTP) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, showOTP]);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (registerObj.verify_password.trim() === "")
      return setErrorMessage("Confirm Password is required");
    if (registerObj.verify_password.trim() !== registerObj.password.trim())
        return setErrorMessage("Password do not match");
    if (!isPasswordValid(registerObj.password)) {
      return setErrorMessage("Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
    } else {
      registerObj.password = registerObj.password.trim();
      registerObj.contact = registerObj.contact.trim();
      try {
        const userData = {
          password: registerObj.password,
        };
        // take the userData obj find the user through their contact number and then update password
        const response = await axios.post(
          `${API}/auth/reset-password/${id}/${token}`,
          userData,
        );
        if (response.status === 200) {
          toast.success("Password Updated Successfully!");
          window.location.href = "/login";
        }
      } catch (error) {
        window.location.href = "/login";

        toast.error("Error updating password. Please try again later.");
        // toast.error(`${error.response.data.message}`);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const isPasswordValid = (password) => {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
      );
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
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
              <h1 className="text-2xl md:text-3xl text-center font-bold ">
                <img
                  src="/logo192.png"
                  className="w-12 h-12 object-contain inline-block mr-2 mask mask-circle"
                  alt={`${lgHyphenName}-logo`}
                />
                {pdfCompanyName}
              </h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center ">
              Change Password
            </h2>

            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <div className="relative">
                  <InputText
                    defaultValue={registerObj.password}
                    type={showNewPassword ? "text" : "password"}
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="New Password"
                    updateFormValue={updateFormValue}
                  />
                  <button
                    className="text-sm absolute right-0 top-[62%] mr-2"
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {!showNewPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <InputText
                    defaultValue={registerObj.verify_password}
                    type={showPassword ? "text" : "password"}
                    updateType="verify_password"
                    containerStyle="mt-4"
                    labelTitle="Confirm Password"
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

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                Reset Password
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Log In
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
