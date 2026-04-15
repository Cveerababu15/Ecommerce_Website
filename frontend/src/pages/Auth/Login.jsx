import { useState } from "react";
import { authAPI } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

function Login() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({
        email,
        password
      });

      // save token & user role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role || "user");

      toast.success("Login Successful");

      // redirect based on role
      if (res.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 flex justify-center"
          >
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold transition">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;