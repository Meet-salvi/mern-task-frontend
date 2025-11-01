import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const API = "https://mern-task-backend-e65k.onrender.com";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    images: [],
  });
  const [editSlug, setEditSlug] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Session expired! Login again.");
        localStorage.removeItem("token");
        return (window.location.href = "/login");
      }

      const data = await res.json();
      setProducts(data.products || data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editSlug ? "PUT" : "POST";
    const url = editSlug ? `${API}/api/products/${editSlug}` : `${API}/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(editSlug ? "Updated ✅" : "Added ✅");
      setForm({ title: "", price: "", description: "", category: "", images: [] });
      setEditSlug(null);
      fetchProducts();
    } catch {
      toast.error("Error submitting form");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await fetch(`${API}/api/products/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product deleted ✅");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditSlug(p.slug);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      {/* Form */}
      <div className="card p-3 mb-4">
        <h3>{editSlug ? "Update Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <input className="form-control mb-2" placeholder="Price" type="number"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />

          <textarea className="form-control mb-2" placeholder="Description"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <input className="form-control mb-2" placeholder="Category"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />

          <input className="form-control mb-2" placeholder="Image URLs (comma separated)"
            value={form.images.map(i => i.url).join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                images: e.target.value.split(",").map((url) => ({ url: url.trim() })),
              })
            }
            required
          />

          <button className="btn btn-success">
            {editSlug ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* Table */}
      <h3>Product List</h3>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th><th>Title</th><th>Price</th><th>Description</th><th>Category</th><th>Image</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p, i) => (
              <tr key={p.slug}>
                <td>{i + 1}</td>
                <td>{p.title}</td>
                <td>₹{p.price}</td>
                <td>{p.description}</td>
                <td>{p.category}</td>
                <td>
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} width="50" height="50"
                      style={{ objectFit: "cover", borderRadius: 5 }} />
                  ) : "No image"}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.slug)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="text-center">No Products Found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
