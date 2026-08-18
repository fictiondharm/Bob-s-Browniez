import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getOrders,
  updateOrder,
  getSettings,
  saveSettings,
} from "../data/store";
import { products as defaultProducts } from "../data/products";

const PRODUCTS_KEY = "bobs-admin-products";

function getProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    if (stored && stored.length > 0) return stored;
  } catch {}
  return defaultProducts;
}

function saveProducts(p) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

function formatStatus(s) {
  const map = {
    pending_payment: "Pending Payment",
    pending_verification: "Awaiting Verify",
    verified: "Verified",
    confirmed: "Confirmed",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[s] || s;
}

function statusColor(s) {
  const map = {
    pending_payment: "#e0a800",
    pending_verification: "#a3346a",
    verified: "#2196f3",
    confirmed: "#4caf50",
    delivered: "#2a180d",
    cancelled: "#999",
  };
  return map[s] || "#999";
}

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [settings, setSettings] = useState({ upiId: "", adminPassword: "admin123" });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const login = () => {
    const s = getSettings();
    if (pw === s.adminPassword) {
      setLogged(true);
      setOrders(getOrders());
      setAdminProducts(getProducts());
      setSettings(s);
      setPwError("");
    } else {
      setPwError("Wrong password");
    }
  };

  const refreshOrders = () => setOrders(getOrders());

  const handleOrderStatus = (id, newStatus) => {
    updateOrder(id, { status: newStatus });
    setOrders(getOrders());
    showToast(`Order ${id} → ${formatStatus(newStatus)}`);
  };

  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  const orderStats = useMemo(() => {
    const stats = { total: orders.length, pending_payment: 0, pending_verification: 0, verified: 0, confirmed: 0, delivered: 0 };
    orders.forEach((o) => { if (stats[o.status] !== undefined) stats[o.status]++; });
    return stats;
  }, [orders]);

  const handlePriceChange = (slug, newPrice) => {
    const updated = adminProducts.map((p) => p.slug === slug ? { ...p, price: Number(newPrice) } : p);
    setAdminProducts(updated);
    saveProducts(updated);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newProduct = {
      slug: fd.get("slug").toLowerCase().replace(/\s+/g, "-"),
      name: fd.get("name"),
      desc: fd.get("desc"),
      price: Number(fd.get("price")),
      category: fd.get("category"),
      unit: "/ bite",
      badge: fd.get("badge") || "",
      badgeClass: "badge-pink",
      tags: [],
      nutrition: { cal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 },
      notes: "",
      ingredients: [],
      pairings: [],
      fun: "",
      blob: "#ffd9e5",
      img: fd.get("img") || "",
    };
    const updated = [...adminProducts, newProduct];
    setAdminProducts(updated);
    saveProducts(updated);
    setShowAddProduct(false);
    showToast("Product added!");
  };

  const handleDeleteProduct = (slug) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = adminProducts.filter((p) => p.slug !== slug);
    setAdminProducts(updated);
    saveProducts(updated);
    showToast("Product deleted");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newSettings = {
      upiId: fd.get("upiId"),
      adminPassword: fd.get("adminPassword") || settings.adminPassword,
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    showToast("Settings saved!");
  };

  if (!logged) {
    return (
      <section className="section">
        <div className="container center" style={{ maxWidth: 400 }}>
          <span className="eyebrow eyebrow-brown">Admin</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 36 }}>Admin Panel</h1>
          <p className="body-md text-muted mt-stack-sm mb-stack-lg">Enter password to continue</p>
          <div className="form-card" style={{ padding: 32 }}>
            <div className="field">
              <label htmlFor="admin-pw">Password</label>
              <input
                type="password"
                id="admin-pw"
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                autoFocus
              />
              {pwError && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 4 }}>{pwError}</p>}
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={login}>
              Login
            </button>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>Default password: admin123</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "var(--primary)", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <section className="section" style={{ paddingBottom: 16 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="eyebrow eyebrow-brown">Admin</span>
              <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 32 }}>Dashboard</h1>
            </div>
            <Link to="/" className="btn btn-outline btn-sm">Back to Site</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "2px solid #e8e0d0", paddingBottom: 0 }}>
            {["orders", "products", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  background: "none",
                  fontSize: 14,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? "var(--primary)" : "var(--on-surface-variant)",
                  borderBottom: tab === t ? "3px solid var(--primary)" : "3px solid transparent",
                  marginBottom: -2,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "orders" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {["all", "pending_payment", "pending_verification", "verified", "confirmed", "delivered"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`chip ${orderFilter === f ? "chip-active" : ""}`}
                    style={{ fontSize: 12 }}
                  >
                    {formatStatus(f)} {orderStats[f] !== undefined ? `(${orderStats[f]})` : ""}
                  </button>
                ))}
                <button className="btn btn-outline btn-sm" onClick={refreshOrders} style={{ marginLeft: "auto" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle" }}>refresh</span> Refresh
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="form-card" style={{ textAlign: "center", padding: 40 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#ccc" }}>inbox</span>
                  <p className="text-muted" style={{ marginTop: 8 }}>No orders found</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="form-card" style={{ padding: 0, overflow: "hidden" }}>
                      <div
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px 20px",
                          cursor: "pointer",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{order.id}</div>
                          <div style={{ fontSize: 13, color: "#666" }}>{order.name} · {order.phone}</div>
                          <div style={{ fontSize: 12, color: "#999" }}>
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>Rs. {order.total}</div>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              background: statusColor(order.status) + "18",
                              color: statusColor(order.status),
                            }}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#999" }}>
                          {expandedOrder === order.id ? "expand_less" : "expand_more"}
                        </span>
                      </div>

                      {expandedOrder === order.id && (
                        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e8e0d0" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, marginBottom: 16 }}>
                            <div>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>EMAIL</p>
                              <p style={{ fontSize: 13 }}>{order.email || "—"}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>DELIVERY DAY</p>
                              <p style={{ fontSize: 13, textTransform: "capitalize" }}>{order.deliveryDay || "—"}</p>
                            </div>
                            <div style={{ gridColumn: "span 2" }}>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>ADDRESS</p>
                              <p style={{ fontSize: 13 }}>{order.address || "—"}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>ORDER TYPE</p>
                              <p style={{ fontSize: 13, textTransform: "capitalize" }}>{order.orderType || "—"}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>UTR</p>
                              <p style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700 }}>{order.utr || "Not submitted"}</p>
                            </div>
                          </div>

                          {order.notes && (
                            <div style={{ marginBottom: 16 }}>
                              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>NOTES</p>
                              <p style={{ fontSize: 13, fontStyle: "italic" }}>{order.notes}</p>
                            </div>
                          )}

                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>ITEMS</p>
                            {order.items.map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, borderBottom: "1px dashed #eee" }}>
                                <span>{item.name} {item.note && <span style={{ color: "#999", fontStyle: "italic" }}>({item.note})</span>}</span>
                                <span style={{ fontWeight: 600 }}>Rs. {item.price}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {order.status === "pending_verification" && (
                              <button className="btn btn-primary btn-sm" onClick={() => handleOrderStatus(order.id, "verified")}>
                                Verify Payment
                              </button>
                            )}
                            {order.status === "verified" && (
                              <button className="btn btn-primary btn-sm" onClick={() => handleOrderStatus(order.id, "confirmed")}>
                                Confirm Order
                              </button>
                            )}
                            {order.status === "confirmed" && (
                              <button className="btn btn-primary btn-sm" onClick={() => handleOrderStatus(order.id, "delivered")}>
                                Mark Delivered
                              </button>
                            )}
                            {order.status !== "delivered" && order.status !== "cancelled" && (
                              <button className="btn btn-outline btn-sm" style={{ color: "#999" }} onClick={() => handleOrderStatus(order.id, "cancelled")}>
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p className="text-muted" style={{ fontSize: 13 }}>{adminProducts.length} products</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddProduct(true)}>
                  + Add Product
                </button>
              </div>

              {showAddProduct && (
                <div className="form-card" style={{ marginBottom: 20, padding: 24 }}>
                  <h3 className="headline-md mb-stack-md">Add New Product</h3>
                  <form onSubmit={handleAddProduct}>
                    <div className="form-grid-2">
                      <div className="field">
                        <label>Product Name</label>
                        <input type="text" name="name" required placeholder="e.g. Peanut Butter Brownie" />
                      </div>
                      <div className="field">
                        <label>Slug (URL)</label>
                        <input type="text" name="slug" required placeholder="e.g. peanut-butter" />
                      </div>
                    </div>
                    <div className="field">
                      <label>Description</label>
                      <input type="text" name="desc" required placeholder="Short description" />
                    </div>
                    <div className="form-grid-2">
                      <div className="field">
                        <label>Price (Rs.)</label>
                        <input type="number" name="price" required min="1" placeholder="70" />
                      </div>
                      <div className="field">
                        <label>Category</label>
                        <select name="category" required>
                          <option value="brownie">Brownie</option>
                          <option value="blondie">Blondie</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Badge Text (optional)</label>
                      <input type="text" name="badge" placeholder="e.g. Bestseller" />
                    </div>
                    <div className="field">
                      <label>Image URL (optional)</label>
                      <input type="text" name="img" placeholder="https://..." />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button type="submit" className="btn btn-primary btn-sm">Add Product</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddProduct(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {adminProducts.map((p) => (
                  <div key={p.slug} className="form-card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#999", textTransform: "capitalize" }}>{p.category}</div>
                    </div>
                    {editingProduct === p.slug ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13 }}>Rs.</span>
                        <input
                          type="number"
                          defaultValue={p.price}
                          onBlur={(e) => { handlePriceChange(p.slug, e.target.value); setEditingProduct(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { handlePriceChange(p.slug, e.target.value); setEditingProduct(null); }}}
                          style={{ width: 80, padding: "4px 8px", border: "1px solid #ccc", borderRadius: 6, fontSize: 13 }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingProduct(p.slug)}
                        style={{ fontWeight: 700, fontSize: 15, cursor: "pointer", padding: "4px 10px", borderRadius: 6, background: "#f5f0e8" }}
                        title="Click to edit price"
                      >
                        Rs. {p.price}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(p.slug)}
                      style={{ border: "none", background: "none", cursor: "pointer", padding: 4, color: "#ccc" }}
                      title="Delete"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="form-card" style={{ maxWidth: 480, padding: 32 }}>
              <h3 className="headline-md mb-stack-md">Settings</h3>
              <form onSubmit={handleSaveSettings}>
                <div className="field">
                  <label htmlFor="upi-id">UPI ID</label>
                  <input
                    type="text"
                    id="upi-id"
                    name="upiId"
                    defaultValue={settings.upiId}
                    placeholder="yourname@paytm"
                  />
                  <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    This shows in the QR code on the payment page
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="admin-pw-change">Admin Password</label>
                  <input
                    type="text"
                    id="admin-pw-change"
                    name="adminPassword"
                    defaultValue={settings.adminPassword}
                    placeholder="admin123"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
