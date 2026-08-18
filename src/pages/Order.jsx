import { useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { useApp } from "../context/AppContext";
import { saveOrder, generateOrderId, getSettings } from "../data/store";

const STEPS = [
  { icon: "shopping_cart", title: "Pick your bites", desc: "Choose from the menu or build a box." },
  { icon: "calendar_month", title: "Choose a weekend", desc: "Saturday or Sunday, always fresh." },
  { icon: "local_shipping", title: "We deliver", desc: "Fresh to your door, no fuss." },
];

export default function Order() {
  const location = useLocation();
  const box = location.state || null;
  const { cartItems, cartCount, removeFromCart, clearCart } = useApp();
  const [step, setStep] = useState("form"); // form | payment | done
  const [orderData, setOrderData] = useState(null);
  const [utr, setUtr] = useState("");
  const settings = getSettings();
  const total = cartItems.reduce((s, i) => s + i.price, 0);

  const upiId = settings.upiId || "your-upi@paytm";
  const upiUrl = `upi://pay?pa=${upiId}&pn=Bob's Browniez&am=${total}&cu=INR`;

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const id = generateOrderId();
      const order = {
        id,
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email"),
        address: fd.get("address"),
        deliveryDay: fd.get("delivery-day"),
        orderType: fd.get("order-type"),
        notes: fd.get("notes"),
        items: cartItems.map((i) => ({ name: i.name, price: i.price, slug: i.slug, note: i.note || "" })),
        total,
        status: "pending_payment",
        utr: "",
        createdAt: new Date().toISOString(),
      };
      saveOrder(order);
      setOrderData(order);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [cartItems, total]
  );

  const handleUtrSubmit = () => {
    if (utr.trim().length < 6) return;
    saveOrder({ id: orderData.id, utr: utr.trim(), status: "pending_verification" });
    clearCart();
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "done") {
    return (
      <section className="section">
        <div className="container center">
          <div className="form-card" style={{ maxWidth: 480, margin: "0 auto" }}>
            <div className="form-success">
              <span className="material-symbols-outlined">check_circle</span>
              <h3 className="headline-lg">Order placed!</h3>
              <p style={{ marginBottom: 8 }}>
                Order ID: <strong>{orderData.id}</strong>
              </p>
              <p style={{ marginBottom: 8 }}>
                UTR: <strong>{utr}</strong>
              </p>
              <p className="text-muted" style={{ fontSize: 14, marginBottom: 20 }}>
                We&apos;ll verify your payment and confirm via WhatsApp / email within a few hours.
              </p>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (step === "payment") {
    return (
      <section className="section">
        <div className="container center">
          <span className="eyebrow eyebrow-brown">Payment</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 36 }}>
            Scan &amp; Pay
          </h1>
          <p className="body-md text-muted mt-stack-sm" style={{ maxWidth: 480, marginBottom: 32 }}>
            Scan the QR code with any UPI app. Amount: <strong>Rs. {total}</strong>
          </p>

          <div className="form-card" style={{ maxWidth: 380, margin: "0 auto", padding: 32, textAlign: "center" }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 12, display: "inline-block", marginBottom: 16 }}>
              <QRCode value={upiUrl} size={200} />
            </div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>UPI ID</p>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: "monospace" }}>{upiId}</p>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Rs. {total}</p>

            <div className="field" style={{ textAlign: "left" }}>
              <label htmlFor="utr">UTR / Transaction ID</label>
              <input
                type="text"
                id="utr"
                placeholder="Enter 12-digit UTR number"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
                inputMode="numeric"
                pattern="[0-9]{6,12}"
                maxLength={12}
                required
              />
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              onClick={handleUtrSubmit}
              disabled={utr.trim().length < 6}
            >
              Confirm Payment
            </button>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>
              Order ID: {orderData.id}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow eyebrow-brown">Order</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 40 }}>
            Get your fix this weekend.
          </h1>
          <p className="body-lg text-muted mt-stack-sm" style={{ maxWidth: 560 }}>
            We bake Saturday &amp; Sunday and deliver fresh to your door.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="order-steps">
            {STEPS.map((s, i) => (
              <div className="order-step" key={s.title}>
                <div className="order-step-icon">
                  <span className="material-symbols-outlined">{s.icon}</span>
                  <span className="order-step-num">{i + 1}</span>
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="order-layout">
            <div className="form-card order-form">
              <h2 className="headline-lg mb-stack-md">Checkout details</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input type="text" id="name" name="name" required placeholder="Jane Doe" />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="98765 43210"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      title="Phone number must be exactly 10 digits"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required placeholder="jane@email.com" />
                </div>
                <div className="field">
                  <label htmlFor="address">Delivery address</label>
                  <textarea id="address" name="address" required placeholder="Flat / house no., street, area, city" />
                </div>
                <div className="form-grid-2">
                  <div className="field">
                    <label htmlFor="delivery-day">Delivery day</label>
                    <select id="delivery-day" name="delivery-day" required defaultValue="">
                      <option value="" disabled>Pick a day</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="order-type">Order type</label>
                    <select
                      id="order-type"
                      name="order-type"
                      required
                      defaultValue={box ? (box.boxSize === 12 ? "party" : "mini") : cartCount > 0 ? "menu" : ""}
                    >
                      <option value="" disabled>Choose</option>
                      <option value="menu">Pick from menu</option>
                      <option value="mini">The Mini gift (6 bites)</option>
                      <option value="party">The Party gift (12 bites)</option>
                      <option value="grand">The Grand gift (24 bites)</option>
                      <option value="custom">Custom box</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="notes">
                    Order notes <span className="text-muted" style={{ fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea id="notes" name="notes" placeholder="Flavors you'd love, allergies, gift message..." />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={cartCount === 0}>
                  Proceed to Payment
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h3 className="headline-md mb-stack-sm">Your Order</h3>
              {cartCount === 0 && !box ? (
                <div className="order-empty">
                  <span className="material-symbols-outlined">shopping_basket</span>
                  <p>Your cart is empty</p>
                  <Link to="/shop" className="btn btn-outline btn-sm">
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="order-items">
                    {box && (
                      <div className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">Custom Box</span>
                          <span className="order-item-meta">
                            {box.flavors.length} of {box.boxSize} flavors
                          </span>
                        </div>
                      </div>
                    )}
                    {cartItems.map((item, i) => (
                      <div className="order-item" key={`${item.slug}-${i}`}>
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-meta">{item.category}</span>
                          {item.note && (
                            <span className="order-item-note">&ldquo;{item.note}&rdquo;</span>
                          )}
                        </div>
                        <button
                          className="order-item-remove"
                          onClick={() => removeFromCart(i)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total</span>
                    <span>Rs. {total}</span>
                  </div>
                  {cartCount > 0 && (
                    <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={clearCart}>
                      Clear cart
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
