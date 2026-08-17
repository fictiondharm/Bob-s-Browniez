import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const STEPS = [
  { icon: "shopping_cart", title: "Pick your bites", desc: "Choose from the menu or build a box." },
  { icon: "calendar_month", title: "Choose a weekend", desc: "Saturday or Sunday, always fresh." },
  { icon: "local_shipping", title: "We deliver", desc: "Fresh to your door, no fuss." },
];

export default function Order() {
  const location = useLocation();
  const box = location.state || null;
  const { cartItems, cartCount, removeFromCart, clearCart } = useApp();
  const [placed, setPlaced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <section className="section">
        <div className="container">
          <div className="form-card">
            <div className="form-success">
              <span className="material-symbols-outlined">check_circle</span>
              <h3 className="headline-lg">Order received!</h3>
              <p>
                We&rsquo;ll confirm your weekend slot on WhatsApp / email within a
                few hours. See you Saturday!
              </p>
              <Link to="/" className="btn btn-outline">
                Back to home
              </Link>
            </div>
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
          <div className="policy-banner mb-stack-lg bg-soft-yellow">
            <span className="material-symbols-outlined" style={{ color: "var(--primary-container)" }}>
              info
            </span>
            <div>
              <h3 className="headline-md" style={{ color: "var(--primary-container)" }}>
                Order by Friday noon
              </h3>
              <p className="body-md text-muted">
                Orders placed after <strong>Friday 12:00 PM</strong> roll over to
                the following weekend.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="order-layout">
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
                  {cartCount > 0 && (
                    <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={clearCart}>
                      Clear cart
                    </button>
                  )}
                </>
              )}
            </div>

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
                    <input type="tel" id="phone" name="phone" required placeholder="+91 98765 43210" />
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
                <button type="submit" className="btn btn-primary btn-block">
                  Place My Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
