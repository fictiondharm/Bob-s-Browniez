import { Link } from "react-router-dom";
import { giftBoxes, occasions, products } from "../data/products";
import { useApp } from "../context/AppContext";
import { useState, useCallback } from "react";
import ownerImage from "../assets/owner.jpg";
import { CartReceipt } from "../components/Receipt";

const GIFT_IMAGES = {
  "gift-mini": products.find((p) => p.slug === "sea-salt")?.img,
  "gift-party": products.find((p) => p.slug === "oreo-cheesecake")?.img,
  "gift-grand": products.find((p) => p.slug === "triple-fudge")?.img,
};

const GIFT_COLORS = {
  "gift-mini": "#e8f0e4",
  "gift-party": "#f9ebdf",
  "gift-grand": "#f0e6d8",
};

function GiftCard({ tier }) {
  const { addToCart } = useApp();
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  const [receipt, setReceipt] = useState(false);

  const handleAdd = useCallback(() => {
    addToCart(tier.slug, note);
    setNote("");
    setAdded(true);
    setReceipt(true);
    setTimeout(() => setAdded(false), 1600);
  }, [addToCart, tier.slug, note]);

  return (
    <>
    <div className="gift-card" data-gift={tier.slug}>
      <div
        className="gift-card-visual"
        style={{ background: GIFT_COLORS[tier.slug] }}
      >
        <img src={GIFT_IMAGES[tier.slug]} alt={tier.name} />
      </div>
      <div className="gift-card-body">
        <div className="gift-card-header">
          <h2>{tier.name}</h2>
          <span className="gift-card-price">Rs. {tier.price}</span>
        </div>
        <p className="gift-card-desc">{tier.desc}</p>
        <div className="gift-card-features">
          {tier.features.map((f) => (
            <span key={f} className="gift-feature-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                check_circle
              </span>
              {f}
            </span>
          ))}
        </div>
        <label className="gift-note-box">
          <span className="gift-note-label">Gift note (optional)</span>
          <input
            type="text"
            placeholder="Write something sweet..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button
          className={`btn btn-primary btn-block gift-add${added ? " added" : ""}`}
          onClick={handleAdd}
        >
          Add to Cart &middot; Rs. {tier.price}
        </button>
      </div>
    </div>
    {receipt && (
      <CartReceipt item={{ name: tier.name, price: tier.price }} onDone={() => setReceipt(false)} />
    )}
    </>
  );
}

export default function Gifting() {
  return (
    <>
      <section className="section" style={{ paddingBottom: 16 }}>
        <div className="container">
          <span className="eyebrow eyebrow-yellow">Gifting</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 40 }}>
            Send a box.
          </h1>
          <p className="body-lg text-muted mt-stack-sm" style={{ maxWidth: 560 }}>
            Pick a gift size, add a note, and we&rsquo;ll box it up with a
            handwritten touch. Baked fresh and delivered on the weekend.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16, paddingBottom: 0 }}>
        <div className="container">
          <div className="gift-grid stagger-children">
            {giftBoxes.map((tier) => (
              <GiftCard key={tier.slug} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32, paddingBottom: 0 }}>
        <div className="container center">
          <p className="body-lg text-muted" style={{ marginBottom: 16 }}>
            Want to pick the exact flavors yourself?
          </p>
          <Link to="/build-a-box" className="btn btn-outline">
            Build your own box instead
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32, paddingBottom: 0 }}>
        <div className="container">
          <div className="occasion-strip">
            <div className="occasion-head">
              <span className="eyebrow eyebrow-brown">Occasions</span>
              <h2 className="headline-lg">Something for every day</h2>
            </div>
            <div className="occasion-grid">
              {occasions.map((o) => (
                <div className="occasion-card" key={o.title}>
                  <span className="material-symbols-outlined">{o.icon}</span>
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-feature">
            <div className="split-media">
              <img src={ownerImage} alt="Founder" />
            </div>
            <div className="split-content">
              <span className="eyebrow" style={{ marginBottom: 16 }}>
                Corporate Gifting
              </span>
              <h2 className="headline-lg">Client gifts, done right.</h2>
              <p>
                Branded boxes, bulk orders, and scheduled deliveries for teams
                and clients. We handle the baking, packaging, and the
                &ldquo;wow&rdquo;.
              </p>
              <div className="btn-row">
                <Link to="/contact" className="btn btn-dark">
                  Talk to us{" "}
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
