import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/register", formData, {
        withCredentials: true
      });

      toast.success(res.data?.message || "Signup Successful ✅");

      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }

      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      console.error("Signup Error:", err);

      toast.error(
        err?.response?.data?.message ||
        "Signup failed, but user may be created ✅ try login"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: 400 }}>
          <h2 className="text-center mb-4">Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" name="name" placeholder="Full Name"
                className="form-control" value={formData.name}
                onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <input type="email" name="email" placeholder="Email"
                className="form-control" value={formData.email}
                onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <input type="password" name="password" placeholder="Password"
                className="form-control" value={formData.password}
                onChange={handleChange} required />
            </div>

            <button className="btn btn-success w-100">Sign Up</button>

            <p className="text-center mt-3">
              Already have an account? <a href="/">Login</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
