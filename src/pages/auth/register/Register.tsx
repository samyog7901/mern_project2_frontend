

import { useNavigate } from "react-router-dom";
import Form from "../../../assets/globals/components/form/Form";
import { register, resetStatus, type RegisterData } from "../../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Status } from "../../../assets/globals/types/types";
import { useEffect } from "react";
import toast from "react-hot-toast";



const Register = () => {
  const {status} = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const registerFields = [
    {
      name: "username",
      label: "User Name",
      type: "text",
      placeholder: "John",
      icon: "mdi-account-outline",
      fullWidth : true,
    },
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



  const handleRegister = async(formData: RegisterData) => {
    // console.log("Register data:", data);
    
    dispatch(register(formData))
  };
  useEffect(()=>{
    if(status == Status.SUCCESS){
      toast.success("User registered successfully, Please login with your credentials" );
      dispatch(resetStatus())
      navigate("/login")
    }
  },[status, navigate, dispatch])

  return (
  <Form formType="Register" fields={registerFields} onSubmit={handleRegister} />
  )
};

export default Register;
