import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://mern-task-backend-e65k.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        (data.errors || []).forEach((er) => toast.error(er.msg));
        return toast.error(data.message);
      }

      toast.success("Signup Successful ✅");
      setTimeout(() => navigate("/login"), 500);
    } catch (err) {
      toast.error("Signup failed ❌",err.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: 400 }}>
          <h2 className="text-center mb-4">Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <input className="form-control mb-2" placeholder="Name" name="name"
              value={formData.name} onChange={handleChange} required />

            <input className="form-control mb-2" placeholder="Email" name="email"
              value={formData.email} onChange={handleChange} required />

            <input className="form-control mb-2" placeholder="Password" name="password" type="password"
              value={formData.password} onChange={handleChange} required />

            <button className="btn btn-success w-100">Sign Up</button>

            <p className="text-center mt-3">Already have an account? <a href="/">Login</a></p>
          </form>
        </div>
      </div>
    </>
  );
}
