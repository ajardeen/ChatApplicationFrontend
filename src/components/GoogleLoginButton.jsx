import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function GoogleLoginButton() {
    const navigate = useNavigate()
    const handleGoogleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded)
        const email = decoded.email;
        const name = decoded.name;
        const googleId = decoded.sub;
       const loginGoogle = async ()=>{
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/google-login`,{ googleId,email,name});
        const decodedToken = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", decodedToken.id);
        localStorage.setItem("name", decodedToken.name);
        toast.success("GoogleLogin  Successful!");
        setTimeout(() => navigate("/chat"), 1000);
       }
       loginGoogle();
    };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => toast.error("Google Login Failed!")}
      />
    </div>
  );
}
export default GoogleLoginButton;
