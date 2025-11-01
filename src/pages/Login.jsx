import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://mern-task-backend-e65k.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Login Failed");

      localStorage.setItem("token", data.accessToken);
      toast.success("Login Successful");

      setTimeout(() => navigate("/product"), 800);
    } catch (err) {
      toast.error("Server error",err.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: 400 }}>
          <h2 className="text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit}>
            <input className="form-control mb-2" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />

            <input className="form-control mb-2" placeholder="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button className="btn btn-primary w-100">Login</button>

            <p className="text-center mt-3">Don't have an account? <a href="/signup">Sign Up</a></p>
          </form>
        </div>
      </div>
    </>
  );
}
