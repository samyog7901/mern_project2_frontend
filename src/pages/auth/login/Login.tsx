

import { useNavigate } from "react-router-dom";
import Form from "../../../assets/globals/components/form/Form";
import { login, resetStatus } from "../../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Status } from "../../../assets/globals/types/types";
import { useEffect } from "react";
import type { userLoginType } from "../type";
import toast from "react-hot-toast";



const Login = () => {
  const {status} = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const LoginFields = [
  
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "johnsmith@example.com",
      icon: "mdi-email-outline",
      fullWidth: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "************",
      icon: "mdi-lock-outline",
      fullWidth: true,
    }
  ];



  const handleLogin = async(formData: userLoginType) => {
   
    dispatch(login(formData))
  }

  useEffect(() => {
    if (status === Status.SUCCESS) {
      // Show first toast
      toast.success("Logged in successfully, welcome User! 😊🙏🏻", { duration: 2000 });
  
      // Navigate after a small delay to let toast appear
      const timer = setTimeout(() => {
        navigate("/");
        toast.success("Enjoy Shopping!")
        dispatch(resetStatus());
      }, 2100);
  
      return () => clearTimeout(timer);
    }
  }, [status, dispatch, navigate]);
  

  return (
  <Form formType="Login" fields={LoginFields} onSubmit={handleLogin} />
  )
};

export default Login;
