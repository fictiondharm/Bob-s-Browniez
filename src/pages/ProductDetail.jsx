import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useApp } from "../context/AppContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useApp();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <section className="section">
        <div className="container center">
          <h1 className="headline-xl">Treat not found.</h1>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 24 }}>
            <Link to="/shop" className="btn btn-primary">
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const facts = [
    { label: "Calories", value: product.nutrition.cal, unit: "kcal" },
    { label: "Protein", value: product.nutrition.protein, unit: "g" },
    { label: "Carbs", value: product.nutrition.carbs, unit: "g" },
    { label: "Fat", value: product.nutrition.fat, unit: "g" },
    { label: "Sugar", value: product.nutrition.sugar, unit: "g" },
  ];

  return (
    <section className="section">
      <div className="container">
        <Link to="/shop" className="section-head-link mb-stack-md" style={{ display: "inline-flex", marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_back
          </span>
          Back to Shop
        </Link>

        <div className="product-detail" style={{ marginTop: 4 }}>
          <div className="product-detail-media reveal-left">
            <div className="hero-blob" style={{ borderWidth: 6, boxShadow: "var(--shadow-soft-lg)" }}>
              <img src={product.img} alt={product.name} />
            </div>
          </div>

          <div className="product-detail-info reveal-right" style={{ "--reveal-delay": "0.1s" }}>
            {product.badge && (
              <span className={`product-badge ${product.badgeClass}`} style={{ position: "static", transform: "rotate(-6deg)" }}>
                {product.badge}
              </span>
            )}
            <h1 className="headline-xl" style={{ marginTop: 12 }}>
              {product.name}
            </h1>
            <p className="body-lg text-muted" style={{ marginTop: 8 }}>
              {product.desc}
            </p>

            {product.tags.length > 0 && (
              <div className="chips" style={{ marginTop: 14 }}>
                {product.tags.map((t) => (
                  <span key={t} className="chip" style={{ cursor: "default" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="nutrition-box">
              <div className="nutrition-grid">
                {facts.map((f) => (
                  <div className="nutrition-fact" key={f.label}>
                    <span className="nutrition-value">
                      {f.value}
                      <small>{f.unit}</small>
                    </span>
                    <span className="nutrition-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-extra">
              <div className="detail-row">
                <span className="detail-icon material-symbols-outlined">restaurant</span>
                <div>
                  <span className="detail-label">Tasting notes</span>
                  <p className="detail-text">{product.notes}</p>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon material-symbols-outlined">bakery_dining</span>
                <div>
                  <span className="detail-label">Made with</span>
                  <div className="chips chips-compact">
                    {product.ingredients.map((ing) => (
                      <span key={ing} className="chip" style={{ cursor: "default" }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon material-symbols-outlined">local_cafe</span>
                <div>
                  <span className="detail-label">Perfect with</span>
                  <div className="chips chips-compact">
                    {product.pairings.map((p) => (
                      <span key={p} className="chip chip-pink" style={{ cursor: "default" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-fun">
                <span className="material-symbols-outlined">auto_awesome</span>
                <p>{product.fun}</p>
              </div>
            </div>

            <div className="product-foot" style={{ marginTop: 20 }}>
              <span className="product-price" style={{ fontSize: 26 }}>
                Rs. {product.price} <small style={{ fontSize: 14 }}>{product.unit}</small>
              </span>
              <button
                className="btn btn-primary"
                onClick={() => addToCart(product.slug)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  shopping_cart
                </span>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
