import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiCheckCircle } from "react-icons/hi2";
import isValidEmail from "./../util/isValidEmail";
import { useAuth } from "../context/authentication";
import { firebase_auth } from "./../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

export default function Login() {
  const [details, setDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onSignin = () => {
    setLoading(true);
    signInWithEmailAndPassword(firebase_auth, details.email, details.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast.success(`You've successfully logged in`);

        setLoading(false);

        login({
          token: user.uid,
          userInfo: {
            uid: user.uid,
            emailAddress: user.email,
            phoneNumbers: user.phoneNumber,
            isVerified: user.emailVerified,
            fullName: user.displayName,
            photoURL: user.photoURL,
          },
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);

        setLoading(false);
      });
  };
  return (
    <div className="flex flex-1 h-screen overflow-hidden w-screen">
      <div className="w-2/3 items-center justify-center flex flex-col space-y-5 bg-white">
        <div className="flex flex-col-reverse items-center justify-center relative">
          <div className="flex flex-col space-y-2 items-center justify-center">
            <p className="text-3xl font-bold">Welcome Back :)</p>
            <p className="text-gray-500 text-sm">Sign in to continue</p>
          </div>

          <img
            src={"https://www.phdc.gov.gh/img/logo/phdc-logo-simple.svg"}
            alt="Logo"
            className="w-32 h-32  object-fit rounded-full  left-50 "
          ></img>
        </div>
        <div className="flex items-center justify-center w-1/2 ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSignin();
            }}
            action="#"
            className="flex flex-col  justify-center items-center gap-3 w-full   p-2"
          >
            <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-3/4 relative">
              <HiOutlineEnvelope size={20} />
              <input
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, email: e.target.value }))
                }
                id="email"
                className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/email"
                type="email"
                placeholder="Store ID"
              />

              {isValidEmail(details.email) && (
                <HiCheckCircle className="border border-white h-5 w-5 text-yellow-400" />
              )}

              <label
                htmlFor="email"
                className="absolute text-gray-600 left-0 ml-9 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/email:text-xs peer-focus/email:-translate-y-5 ease-linear peer-placeholder-shown/email:translate-y-0 peer-placeholder-shown/email:text-base peer-placeholder-shown/email:text-gray-500 "
              >
                Email address
              </label>
            </div>

            <div className="flex flex-row items-center border py-6 px-3 pt-7 rounded-md w-3/4 relative">
              <HiOutlineEnvelope size={20} />
              <input
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, password: e.target.value }))
                }
                id="password"
                className=" ml-2 focus:border-0 focus:ring-0 placeholder:text-transparent transition focus:outline-0 flex-1 peer/password"
                type="password"
                placeholder="Store ID"
              />
              <label
                htmlFor="password"
                className="absolute text-gray-600 left-0 ml-9 -translate-y-5 bg-white px-1 text-xs duration-100 peer-focus/password:text-xs peer-focus/password:-translate-y-5 ease-linear peer-placeholder-shown/password:translate-y-0 peer-placeholder-shown/password:text-base peer-placeholder-shown/password:text-gray-500 "
              >
                Password
              </label>
            </div>

            <div className="flex justify-between w-3/4 flex-col space-y-2 items-center mt-2">
              <button
                disabled={loading}
                type="submit"
                className="bg-yellow-500 w-full flex items-center justify-center p-4 rounded-md font-medium text-white text-sm"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="flex-1 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1616166358812-784a766b5762?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        }}
      ></div>
    </div>
  );
}
