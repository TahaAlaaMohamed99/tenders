import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import CustomInput from "../Components/Form/CustomInput";
import CustomeBtn from "../Components/CustomeBtn";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const success = login(email, password);

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
            Enter any email and password to login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              Required
            />

            <CustomInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              Required
            />
          </div>

          <CustomeBtn
            type="submit"
            title="Sign In"
            isLoading={isLoading}
            disabled={isLoading || !email || !password}
            className="w-full bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            size="btn_md"
          />
        </form>
      </div>
    </div>
  );
}
