import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import { API } from "../../utils/constants";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function ForgotPassword() {
  const INITIAL_USER_OBJ = {
    email: "",
  };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(false);

    if (userObj.email.trim() === "") {
      return setErrorMessage("Email Id is required! (use any value)");
    }
    if (!isEmailValid(userObj.email)) {
      return setErrorMessage("Email is not valid!");
    }

    try {
      const res = await axios.post(`${API}/auth/forgot-password`, {
        email: userObj.email,
      });
      console.log("response of mail is", res.status);
      if (res.data.message === "User do not exist") {
        toast.error("User not found");
      } else if (res.data.message === "Link Sent Successfully") {
        toast.success("Password Reset Link has been sent to your email");
        setLinkSent(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        "An error occurred while processing your request. Please try again later."
      );
    }
    setLoading(false);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
         <ToastContainer />
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Forgot Password
            </h2>

            {linkSent && (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-32 text-success" />
                </div>
                <p className="my-4 text-xl font-bold text-center">Link Sent</p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  Check your email to reset password
                </p>
                <div className="text-center mt-4">
                  <Link to="/login">
                    <button className="btn btn-block btn-primary ">
                      Login
                    </button>
                  </Link>
                </div>
              </>
            )}

            {!linkSent && (
              <>
                <p className="my-8 font-semibold text-center">
                  We will send password reset link on your email Id
                </p>
                <form onSubmit={(e) => submitForm(e)}>
                  <div className="mb-4">
                    <InputText
                      type="email"
                      defaultValue={userObj.email}
                      updateType="email"
                      containerStyle="mt-4"
                      labelTitle="Email Id"
                      updateFormValue={updateFormValue}
                    />
                  </div>

                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={
                      "btn mt-2 w-full btn-primary" +
                      (loading ? " loading" : "")
                    }
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center mt-4">
                    Don't have an account yet?{" "}
                    <Link to="/register">
                      <button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        Register
                      </button>
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
