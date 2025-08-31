// // ...
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const navigate = useNavigate();
//   // ... baaki state
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/register", {
//         name,
//         email,
//         password,
//       });
//       console.log(response.data);
//       // Registration successful hone par user ko redirect karein
//       navigate("/verify-email");
//     } catch (error) {
//       console.error(error.response?.data?.message);
//     }
//   };
//   // ...
// };
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/register", {
//         name,
//         email,
//         password,
//       });
//       setMessage(response.data.message);
//       // Registration successful hone par user ko redirect karein
//       navigate("/verify-email");
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message || "Registration mein error hui."
//       );
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
//       <form onSubmit={handleRegister} className="space-y-4">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Apna naam enter karein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Apna email enter karein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Apna password enter karein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Register
//         </button>
//       </form>
//       {message && <p className="mt-4 text-center text-sm">{message}</p>}
//     </div>
//   );
// };

// export default Register;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Register = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/register", {
//         name,
//         email,
//         password,
//       });
//       toast.success(response.data.message);
//       setLoading(false);
//       // Registration successful hone par user ko verification page par bhej dein
//       navigate("/verify-email");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Registration mein error hui."
//       );
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
//       <form onSubmit={handleRegister} className="space-y-4">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Apna naam enter karein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Apna email enter karein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password banayein"
//           required
//           className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Change function name to reflect that it sends OTP, not registers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Frontend sends a request to the backend to send OTP
      const response = await axios.post(
        "http://localhost:5000/api/otp/send-otp",
        {
          name,
          email,
          password,
        }
      );

      toast.success(response.data.message);
      setLoading(false);

      // Step 2: Navigate to the OTP verification page
      navigate("/verify-email", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP bhejne mein error hui."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSendOtp} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Apna naam enter karein"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
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
          placeholder="Password banayein"
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Sending OTP..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
