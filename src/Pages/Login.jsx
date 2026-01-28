import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { loginSchema } from "../utils/validation";

import CustomInput from "../Components/Form/CustomInput";
import CustomBtn from "../Components/CustomBtn";
import {
  LogoName,
  LoginImage,
  LoginDotsRight,
  LoginDots,
} from "../assets/Icons/IconsSvg";

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
    <div className=" relative flex h-screen overflow-hidden bg-white">
      {/* Decorative Dots - Right Edge */}
      <LoginDotsRight className="absolute right-0 top-0 z-10 h-full lg:w-10" />

      {/* Left Panel - Form Section */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white px-6 md:w-2/5 md:px-8 lg:px-12 xl:px-16">
        {/* Decorative Dots - Top Left Corner */}
        <div className="absolute left-[-2%] top-0 z-0">
          <LoginDots className="h-12 w-20 lg:h-16 lg:w-24" />
        </div>

        {/* Decorative Dots - Bottom Right Corner */}
        <div className="absolute bottom-0 right-[-3%] z-0 rotate-90">
          <LoginDots className="lg:h-16 lg:w-24" />
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2">
            <LogoName className="mb-2 w-44 lg:w-48 xl:w-52" />
            <h2 className="text-xl font-semibold text-titleColor lg:text-3xl dark:text-titleColorDark">
              Welcome Back
            </h2>
            <p className="text-sm text-textColor dark:text-textColorDark">
              let's get started.
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, touched, errors }) => {
              const isFormIncomplete = !values.userName || !values.password;

              return (
                <Form className="mt-6 space-y-4 lg:mt-8 lg:space-y-5">
                  <div className="space-y-4">
                    <CustomInput
                      label="Email or username"
                      name="userName"
                      type="text"
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email or username"
                      Required
                      touched={touched.userName}
                      errors={errors.userName}
                      className="[&_.input-field-base]:rounded-lg [&_.input-field-base]:bg-bgColor [&_.input-field-base]:px-4 [&_.input-field-base]:py-3 [&_.input-field-base]:dark:bg-bgColorDark"
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
                      className="[&_.input-field-base]:rounded-lg [&_.input-field-base]:bg-bgColor [&_.input-field-base]:px-4 [&_.input-field-base]:py-3 [&_.input-field-base]:dark:bg-bgColorDark"
                    />
                  </div>

                  <CustomBtn
                    type="submit"
                    title="Sign in"
                    isLoading={isLoading}
                    className="w-full rounded-full bg-primary text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primaryDark dark:text-titleColor"
                    size="btn_lg"
                    disabled={isFormIncomplete}
                    loginDots={true}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {/* Right Panel - Dashboard Preview */}
      <div className="relative hidden w-3/5 flex-col overflow-hidden rounded-tl-[80px] bg-primary md:flex dark:bg-primaryDark">
        {/* Decorative Dots - Center Top */}
        <div className="absolute left-1/3 top-[-1%] z-0">
          <LoginDots className="h-10 w-20 lg:h-12 lg:w-24" />
        </div>
        {/* Content Section */}
        <div className="relative z-10 mb-6 flex flex-col justify-center space-y-3 px-8 py-8 text-white lg:mb-8 lg:mt-4 lg:space-y-4 lg:px-12 xl:mb-12 xl:mt-8 xl:px-16">
          <h2 className="ml-8 max-w-lg text-xl font-semibold leading-tight lg:ml-12 lg:text-4xl xl:max-w-xl xl:text-5xl">
            Control your Finances
            <br />
            With Our Smart Tool
          </h2>

          <p className="ml-8 max-w-sm text-md text-white/90 lg:ml-12 lg:max-w-md lg:text-base xl:max-w-lg">
            Invest intelligently and discover a better way to manage your entire
            wealth easily.
          </p>
        </div>

        {/* Dashboard Image Container */}
        <div className="relative z-20 flex flex-1 items-end justify-center overflow-visible px-4 lg:justify-end lg:px-0">
          <LoginImage className="h-auto w-full max-w-lg object-contain lg:max-w-xl xl:max-w-2xl" />
        </div>
      </div>
    </div>
  );
}
