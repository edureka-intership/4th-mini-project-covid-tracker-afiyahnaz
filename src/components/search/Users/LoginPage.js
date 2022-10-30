import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "../Nav/Navbar";

export default function LoginPage() {
  let [userLogin, setUserLogin] = useState(null);

  let onSuccess = (response) => {
    localStorage.setItem("auth_token", response.credential); //can be like token= response.cred..
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Login Successful!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => window.location.assign("/quick-search"));
  };

  let onError = () => {
    alert("Login Failed");
  };

  useEffect(() => {
    let token = localStorage.getItem("auth_token");
    if (token) {
      let decoded = jwt_decode(token);
      setUserLogin(decoded);
    } else {
      setUserLogin(null);
    }
  }, []);
  return (
    <>
      <Navbar bg="bg-danger" login="d-none" />
      <div className="d-flex justify-content-between align-content-center marginSearch  mt-5 Poppins fw-bolder ">
        <h1>Login with Google to continue</h1>{" "}
      </div>
      <div className="d-flex justify-content-center shadow marginLeft col-7   mt-5 ">
        {/* <GoogleOAuthProvider clientId="263148022359-f2gtatcn7s3afukeqjf877ooee8rmgjg.apps.googleusercontent.com"> */}
        <GoogleOAuthProvider clientId="586235440455-7esd81dskqcnntqpibv06jkti5fonkku.apps.googleusercontent.com">
          <div className=" d-flex flex-column align-items-center py-3">
            {
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  onSuccess(credentialResponse);
                }}
                onError={() => {
                  onError();
                }}
              />
            }
          </div>
        </GoogleOAuthProvider>
      </div>
    </>
  );
}