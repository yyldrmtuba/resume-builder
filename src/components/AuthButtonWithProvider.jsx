import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import React, { useCallback, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { auth } from "../config/firebase.config";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const handleClick = async () => {
    switch (provider) {
      case "GitHubAuthProvider":
        await signInWithRedirect(auth, githubProvider)
          .then((result) => {
            console.log(result);
          })
          .catch(() => {
            console.log("Error");
          });
        break;

      default:
        await signInWithRedirect(auth, googleProvider)
          .then((result) => {
            console.log(result);
          })
          .catch(() => {
            console.log("Error");
          });

        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white" />
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
    </div>
  );
};

export default AuthButtonWithProvider;
