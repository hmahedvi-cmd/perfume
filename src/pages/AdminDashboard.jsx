import { useState, useEffect } from "react";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "Men",
    rating: "4.5",
    image: "",
    description: "",
    notes: "",
    volume: "100ml",
    stock: "10",
    isNew: false,
    scentProfile: "",
    sourcing: "",
    maceration: "",
  });

  // Load products and orders
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const prodData = await fetchProducts();
        setProducts(prodData);

        let orderData = [];
        try {
          const ordersSnapshot = await getDocs(collection(db, "orders"));
          ordersSnapshot.forEach((doc) => {
            orderData.push({ id: doc.id, ...doc.data() });
          });
        } catch (err) {
          console.warn("Failed to fetch orders from Firestore:", err);
        }

        // Merge with locally placed orders
        const localOrders = JSON.parse(localStorage.getItem("luxe_local_orders") || "[]");
        localOrders.forEach((localOrder) => {
          if (!orderData.some((o) => o.id === localOrder.id)) {
            orderData.push(localOrder);
          }
        });

        // Sort by newest order
        orderData.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setOrders(orderData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image file size should be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      name: "",
      brand: "",
      price: "",
      category: "Men",
      rating: "4.5",
      image: "",
      description: "",
      notes: "",
      volume: "100ml",
      stock: "10",
      isNew: false,
      scentProfile: "",
      sourcing: "",
      maceration: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price || "",
      category: product.category || "Men",
      rating: product.rating || "4.5",
      image: product.image || "",
      description: product.description || "",
      notes: Array.isArray(product.notes) ? product.notes.join(", ") : product.notes || "",
      volume: product.volume || "100ml",
      stock: product.stock || "10",
      isNew: product.isNew || false,
      scentProfile: product.scentProfile || "",
      sourcing: product.sourcing || "",
      maceration: product.maceration || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price || !form.image) {
      toast.error("Please fill in all required fields (Name, Brand, Price, Image)");
      return;
    }

    const priceNum = Number(form.price);
    const ratingNum = Number(form.rating);
    const stockNum = Number(form.stock);
    const notesArray = typeof form.notes === "string" 
      ? form.notes.split(",").map(n => n.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: form.name,
      brand: form.brand,
      price: priceNum,
      category: form.category,
      rating: ratingNum,
      image: form.image,
      description: form.description,
      notes: notesArray,
      volume: form.volume,
      stock: stockNum,
      isNew: form.isNew,
      scentProfile: form.scentProfile,
      sourcing: form.sourcing,
      maceration: form.maceration,
    };

    try {
      if (isEditing) {
        await updateProduct(editId, productPayload);
        setProducts(
          products.map((p) => (p.id === editId ? { ...productPayload, id: editId } : p))
        );
        toast.success("Product updated successfully!");
      } else {
        const newProduct = await addProduct(productPayload);
        setProducts([...products, newProduct]);
        toast.success("Product added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Operation failed. Try again.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const isMock = typeof orderId === "string" && orderId.startsWith("order_mock_");
    
    if (isMock) {
      const localOrders = JSON.parse(localStorage.getItem("luxe_local_orders") || "[]");
      const updatedLocal = localOrders.map((o) => 
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem("luxe_local_orders", JSON.stringify(updatedLocal));
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
      return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.warn("Failed to update Firestore order status, updating locally:", err);
      // Fallback: save status change override in local storage
      const localOrders = JSON.parse(localStorage.getItem("luxe_local_orders") || "[]");
      const existingIdx = localOrders.findIndex((o) => o.id === orderId);
      
      const foundOrder = orders.find((o) => o.id === orderId);
      if (foundOrder) {
        const updatedOrder = { ...foundOrder, status: newStatus };
        if (existingIdx !== -1) {
          localOrders[existingIdx] = updatedOrder;
        } else {
          localOrders.push(updatedOrder);
        }
        localStorage.setItem("luxe_local_orders", JSON.stringify(localOrders));
      }

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Tabs Menu */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <FaBoxOpen /> Products Management
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <FaClipboardList /> Customer Orders
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <div className="admin-content-area">
          <AnimatePresence mode="wait">
            {activeTab === "products" && (
              <motion.div
                key="products-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tab-content"
              >
                {/* Form to Add/Edit Product */}
                <form className="product-form" onSubmit={handleSubmit}>
                  <h3>{isEditing ? "Edit Product" : "Add New Perfume"}</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Dior Sauvage"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Brand *</label>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="e.g. Dior"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="e.g. 120"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={form.category} onChange={handleChange}>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        name="rating"
                        value={form.rating}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Volume</label>
                      <input
                        type="text"
                        name="volume"
                        value={form.volume}
                        onChange={handleChange}
                        placeholder="e.g. 100ml"
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock Qty</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group full-width image-upload-group">
                      <label>Product Image *</label>
                      <div className="image-upload-container">
                        <div className="image-upload-wrapper">
                          {form.image ? (
                            <div className="image-preview-container">
                              <img src={form.image} alt="Preview" className="image-preview" />
                              <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => setForm({ ...form, image: "" })}
                              >
                                Remove Image
                              </button>
                            </div>
                          ) : (
                            <label className="upload-dropzone">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                              />
                              <FaPlus className="upload-icon" />
                              <span>Click to select perfume image file</span>
                            </label>
                          )}
                        </div>
                        <div className="image-url-fallback">
                          <span>Or paste image URL:</span>
                          <input
                            type="text"
                            name="image"
                            value={form.image || ""}
                            onChange={handleChange}
                            placeholder="e.g. /images/dior.jpg or https://example.com/perfume.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Notes (comma separated)</label>
                      <input
                        type="text"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Bergamot, Pepper, Amberwood"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Fresh woody fragrance..."
                        rows="3"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Scent Profile (Details Tab)</label>
                      <textarea
                        name="scentProfile"
                        value={form.scentProfile}
                        onChange={handleChange}
                        placeholder="A premium orchestration featuring top notes of sweet bergamot..."
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Sourcing Details (Details Tab)</label>
                      <textarea
                        name="sourcing"
                        value={form.sourcing}
                        onChange={handleChange}
                        placeholder="We partner directly with sustainable bio-farms..."
                        rows="2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Maceration Details (Details Tab)</label>
                      <textarea
                        name="maceration"
                        value={form.maceration}
                        onChange={handleChange}
                        placeholder="Each bottle is matured and macerated for exactly twelve weeks..."
                        rows="2"
                      />
                    </div>
                    <div className="form-group checkbox-group full-width">
                      <label>
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={form.isNew}
                          onChange={handleChange}
                        />
                        <span>Mark as New Arrival</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {isEditing ? "Update Product" : "Add Product"}
                    </button>
                    {(isEditing || form.name) && (
                      <button type="button" className="cancel-btn" onClick={resetForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Products List Table */}
                <div className="products-table-wrapper">
                  <h3>Existing Perfumes ({products.length})</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th></th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <img src={product.image} alt={product.name} className="table-img" />
                          </td>
                          <td>
                            <strong>{product.name}</strong>
                            {product.isNew && <span className="admin-new-badge">NEW</span>}
                          </td>
                          <td>{product.brand}</td>
                          <td>{product.category}</td>
                          <td>₹{product.price}</td>
                          <td>{product.stock}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditClick(product)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteClick(product.id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tab-content"
              >
                <div className="orders-table-wrapper">
                  <h3>Customer Orders ({orders.length})</h3>
                  {orders.length === 0 ? (
                    <p>No customer orders found.</p>
                  ) : (
                    <table className="admin-table text-left-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <span className="order-id-label">{order.id}</span>
                            </td>
                            <td>
                              <div>{order.shipping?.fullName}</div>
                              <div className="subtext">{order.email}</div>
                              <div className="subtext">{order.shipping?.phone}</div>
                            </td>
                            <td>
                              <div className="table-items-cell">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="table-item-detail">
                                    {item.name} <strong>(x{item.quantity})</strong>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <strong>₹{order.total}</strong>
                              <div className="subtext">{order.paymentMethod || "COD"}</div>
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${order.status?.toLowerCase() || "pending"}`}
                              >
                                {order.status || "Pending"}
                              </span>
                            </td>
                            <td>
                              <select
                                className="status-select"
                                value={order.status || "Pending"}
                                onChange={(e) =>
                                  handleOrderStatusChange(order.id, e.target.value)
                                }
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
