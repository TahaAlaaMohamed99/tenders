import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { loginSchema } from "../utils/validation";

import CustomInput from "../Components/Form/CustomInput";
import CustomeBtn from "../Components/CustomeBtn";

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
        navigate("/");
      } else {
        toast.error("Login failed!");
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 bg-white">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Tenders</h1>
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
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        {/* Curved Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-tl-[80px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-16 text-white mt-12">
          <h2 className="text-4xl font-semibold leading-tight mb-4">
            Control your Finances <br />
            With Our Smart Tool
          </h2>

          <p className="text-white/80 max-w-md ">
            Invest intelligently and discover a better way to manage your entire
            wealth easily.
          </p>

          {/* Dashboard Image */}
          <img
            src="/TenderApp.png"
            alt="Dashboard Preview"
            className="max-w-xl drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
