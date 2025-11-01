import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Vite API URL
  const API = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired! Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 1500);
        return;
      }

      const data = await res.json();
      setProducts(data.products || data);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editSlug ? "PUT" : "POST";
    const url = editSlug
      ? `${API}/api/products/${editSlug}`
      : `${API}/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error");
        return;
      }

      toast.success(editSlug ? "Product Updated" : "Product Added");

      setForm({
        title: "",
        price: "",
        description: "",
        category: "",
        images: [],
      });

      setEditSlug(null);
      fetchProducts();
    } catch {
      toast.error("Error submitting form");
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      images: p.images,
    });
    setEditSlug(p.slug);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete product?")) return;

    try {
      const res = await fetch(`${API}/api/products/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Product deleted ✅");
      fetchProducts();
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <div className="card p-3 mb-4">
        <h3>{editSlug ? "Update Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Title"
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="number"
              placeholder="Price"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <textarea
              placeholder="Description"
              className="form-control"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Category"
              className="form-control"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Paste Image URLs (comma separated)"
              className="form-control"
              value={form.images.map((i) => i.url).join(",")}
              onChange={(e) =>
                setForm({
                  ...form,
                  images: e.target.value.split(",").map((url) => ({
                    url: url.trim(),
                    public_id: "",
                  })),
                })
              }
              required
            />
          </div>

          <button className="btn btn-success">
            {editSlug ? "Update" : "Add"}
          </button>
        </form>
      </div>

      <h3>Product List</h3>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((p, index) => (
            <tr key={p.slug}>
              <td>{index + 1}</td>
              <td>{p.title}</td>
              <td>₹{p.price}</td>
              <td>{p.description}</td>
              <td>{p.category}</td>
              <td>
                {p.images?.length > 0 ? (
                  <img
                    src={p.images[0].url}
                    alt="product"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.slug)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
