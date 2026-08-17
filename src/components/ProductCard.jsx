import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CartReceipt } from "./Receipt";

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const timer = useRef(null);

  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();
      addToCart(product.slug);
      setAdded(true);
      setReceipt(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), 1600);
    },
    [addToCart, product.slug]
  );

  return (
    <>
      <article
        className="product-card tilt-card"
        onClick={() => navigate(`/product/${product.slug}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/product/${product.slug}`);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <span className={`product-badge ${product.badgeClass}`}>
            {product.badge}
          </span>
        )}
        <div className="product-media">
          <img src={product.img} alt={product.name} loading="lazy" />
          <div className="product-blob" style={{ background: product.blob }} />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-foot">
          <span className="product-price">
            Rs. {product.price} <small>{product.unit}</small>
          </span>
          <button
            className={`btn-pill-icon${added ? " added" : ""}`}
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAdd}
          >
            <span
              key={added ? "check" : "plus"}
              className={`material-symbols-outlined btn-icon-swap${added ? " show-check" : ""}`}
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
            >
              {added ? "check" : "add"}
            </span>
          </button>
        </div>
      </article>
      {receipt && (
        <CartReceipt item={product} onDone={() => setReceipt(false)} />
      )}
    </>
  );
}
