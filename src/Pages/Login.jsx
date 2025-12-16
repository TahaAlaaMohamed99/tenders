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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to login
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
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
                disabled={isLoading}
                className="w-full bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                size="btn_md"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
