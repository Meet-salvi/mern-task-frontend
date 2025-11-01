import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Login Successful");

      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }

      setTimeout(() => {
        navigate("/product");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: 400 }}>
          <h2 className="text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100">Login</button>

            <p className="text-center mt-3">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
