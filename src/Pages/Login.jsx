import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "../assets/Icons";
import TranslationText from "../Components/TranslationText";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const initialValues = {
    userName: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const result = await login(values.userName, values.password, values.rememberMe);

      if (result.success) {
        toast.success("Login successful!");
        // Navigate to the originally requested page or dashboard
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || "Login failed!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" relative flex h-screen overflow-hidden bg-white rtl:flex-row-reverse">
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
            <h2 className="text-xl font-semibold text-titleColor lg:text-3xl">
               <TranslationText title="welcome_back" />
            </h2>
            <p className="text-sm text-textColor">
               <TranslationText title="lets_get_started" />
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
                      label="email_or_username" // Passing key directly as CustomInput handles TranslationText
                      name="userName"
                      type="text"
                      value={values.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="enter_email_username" // Passing key directly
                      Required
                      touched={touched.userName}
                      errors={errors.userName}
                      labelBgColor="bg-white" // Force white background
                      forceLightMode={true} // Enforce light mode colors
                      // Force light mode colors
                      className="[&_.input-field-base]:rounded-lg [&_.input-field-base]:bg-bgColor [&_.input-field-base]:px-4 [&_.input-field-base]:py-3" 
                    />

                    <CustomInput
                      label="password" // Passing key directly
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="enter_password" // Passing key directly
                      Required
                      touched={touched.password}
                      errors={errors.password}
                      labelBgColor="bg-white" // Force white background
                      forceLightMode={true} // Enforce light mode colors
                      className="[&_.input-field-base]:rounded-lg [&_.input-field-base]:bg-bgColor [&_.input-field-base]:px-4 [&_.input-field-base]:py-3"
                    />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm text-textColor select-none">
                        <TranslationText title="remember_me" />
                      </span>
                    </label>
                  </div>

                  <CustomBtn
                    type="submit"
                    title="sign_in" 
                    isLoading={isLoading}
                    className="w-full rounded-full bg-primary text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="relative hidden w-3/5 flex-col overflow-hidden rounded-tl-[80px] bg-primary md:flex">
        {/* Decorative Dots - Center Top */}
        <div className="absolute left-1/3 top-[-1%] z-0">
          <LoginDots className="h-10 w-20 lg:h-12 lg:w-24" />
        </div>
        {/* Content Section */}
        <div className="relative z-10 mb-6 flex flex-col justify-center space-y-3 px-8 py-8 text-white lg:mb-8 lg:mt-4 lg:space-y-4 lg:px-12 xl:mb-12 xl:mt-8 xl:px-16">
          <h2 className="ms-8 max-w-lg text-xl font-semibold leading-tight lg:ms-12 lg:text-4xl xl:max-w-xl xl:text-5xl rtl:text-right">
            <TranslationText title="control_finances" />
            
            <br className="mb-4"/>
            <TranslationText title="with_smart_tool" />
          </h2>

          <p className="ms-8 max-w-sm text-md text-white/90 lg:ms-12 lg:max-w-md lg:text-base xl:max-w-lg rtl:text-right">
             <TranslationText title="invest_intelligently" />
          </p>
        </div>

        {/* Dashboard Image Container */}
        <div className="relative z-20 flex flex-1 items-end justify-center overflow-visible px-4 lg:justify-end rtl:lg:justify-start lg:px-0">
          <LoginImage className="h-auto w-full max-w-lg object-contain lg:max-w-xl xl:max-w-2xl" />
        </div>
      </div>
    </div>
  );
}
