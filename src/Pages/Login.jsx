import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { loginSchema } from "../utils/validation";

import CustomInput from "../Components/Form/CustomInput";
import CustomeBtn from "../Components/CustomeBtn";
import { LogoName } from "../assets/Icons/IconsSvg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    userName: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    setTimeout(() => {
      const success = login(values.userName, values.password);

      if (success) {
        toast.success("Login successful!");
        navigate("/vendors");
      } else {
        toast.error("Login failed!");
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Left Side */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-4 md:px-12 lg:px-16 bg-white">
        <div className="max-w-md w-full space-y-6">
          <div className="flex flex-col items-center">
               <LogoName className="w-40 mb-6" />
             <h2 className="mt-2 text-2xl font-semibold text-gray-700">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">Let's get started.</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, touched, errors }) => {
              const isFormIncomplete = !values.userName || !values.password;
              return (
                <Form className="mt-8 space-y-6">
                  <div className="space-y-4">
                    <CustomInput
                      label="Username"
                      name="userName"
                      type="text"
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your username"
                      Required
                      touched={touched.userName}
                      errors={errors.userName}
                    />

                    <CustomInput
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your password"
                      Required
                      touched={touched.password}
                      errors={errors.password}
                    />
                  </div>

                  <CustomeBtn
                    type="submit"
                    title="Sign In"
                    isLoading={isLoading}
                    className="w-full bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="btn_md"
                    disabled={isFormIncomplete}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden md:flex flex-col w-3/5 relative overflow-hidden  bg-gradient-to-br from-teal-500 to-teal-600 rounded-tl-[80px]">
  

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-8 text-white mt-12">
          <h2 className="text-3xl font-semibold leading-tight mb-4">
            Control your Finances  
            With Our Smart Tool
          </h2>

          <p className="text-white/80 max-w-md ">
            Invest intelligently and discover a better way to manage your entire
            wealth easily.
          </p>

        
        </div>
          {/* Dashboard Image */}
          <img
            src="/TenderApp.png"
            alt="Dashboard Preview"
            className=" w-full relative -end-16 drop-shadow-2xl"
          />
      </div>
    </div>
  );
}
