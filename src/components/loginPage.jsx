import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      setMessage(response.data.message);

      // Backend response mein 'isVerified' status check karein
      if (response.data.user.isVerified) {
        // Agar verified hai, to dashboard par redirect karein
        navigate("/dashboard");
      } else {
        // Agar verified nahi hai, to verification page par bhej dein
        navigate("/verify-email");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login mein error hui.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Apna email enter karein"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Apna password enter karein"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default Login;
