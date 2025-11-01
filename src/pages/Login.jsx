import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.accessToken);
      toast.success("Login Successful ✅");
      setTimeout(() => navigate("/product"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: 400 }}>
          <h2 className="text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-control mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
