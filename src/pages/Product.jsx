import { useEffect, useState } from "react";
import api from "../axios";
import { toast, ToastContainer } from "react-toastify";

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

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired! Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        toast.error("Failed to load products");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editSlug) {
        await api.put(`/api/products/${editSlug}`, form);
        toast.success("Product Updated ✅");
      } else {
        await api.post(`/api/products`, form);
        toast.success("Product Added ✅");
      }

      setEditSlug(null);
      setForm({ title: "", price: "", description: "", category: "", images: [] });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting form");
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
      await api.delete(`/api/products/${slug}`);
      toast.success("Product deleted ✅");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <div className="card p-3 mb-4">
        <h3>{editSlug ? "Update Product" : "Add Product"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Image URLs (comma separated)"
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
            <th>Actions</th>
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
                    width="50"
                    height="50"
                    alt="product"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.slug)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
