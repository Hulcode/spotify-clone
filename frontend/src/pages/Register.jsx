import { Input } from "../components/ui/input";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useGetUser } from "../context/GetUserContext";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getUser } = useGetUser();
  const handleRegister = async () => {
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");
    if (!userName.trim()) return toast.error("User name is required");
    try {
      setLoading(true);

      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        email,
        password,
        userName,
        isAdmin: false,
      });

      if (!data.success) {
        return toast.error(data.message || "Register failed");
      }

      toast.success(data.message || "Registration successful");
      navigate("/");
      setEmail("");
      setPassword("");
      setUserName("");
      await getUser();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 h-[calc(100vh-60px)] bg-[#f0faf2] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white border border-[#c5e0c9] rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">SignUp</h1>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            User name
          </label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your User name"
            className="border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20"
          />
        </div>
        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full px-6 py-3 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded-md
          hover:bg-[#1DB954] transition-colors active:scale-95"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className=" text-sm font-semibold text-gray-600 mt-1.5">
          Already have account!{" "}
          <Link to="/login" className="underline text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
