import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useApp } from "../context/AppContext";
import { CartReceipt } from "../components/Receipt";

const SIZES = {
  6: { label: "6 bites", price: 390, perBite: 65 },
  12: { label: "12 bites", price: 750, perBite: 62.5 },
};

export default function BuildABox() {
  const { showToast, addToCart } = useApp();
  const navigate = useNavigate();
  const [size, setSize] = useState(6);
  const [selected, setSelected] = useState([]);
  const [receipt, setReceipt] = useState(false);

  const available = useMemo(() => products.filter((p) => p.category !== "giftbox"), []);

  const toggle = (slug) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= size) {
        showToast("Box is full! Remove a flavor first.");
        return prev;
      }
      return [...prev, slug];
    });
  };

  const addFlavor = (slug) => {
    setSelected((prev) => {
      if (prev.length >= size) {
        showToast("Box is full! Remove a flavor first.");
        return prev;
      }
      return [...prev, slug];
    });
  };

  const removeFlavor = (slug) => {
    setSelected((prev) => {
      const idx = prev.lastIndexOf(slug);
      if (idx === -1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const countFor = (slug) => selected.filter((s) => s === slug).length;

  const removeSlot = (index) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const surpriseMe = () => {
    const needs = size - selected.length;
    if (needs <= 0) {
      showToast("Box is already full!");
      return;
    }
    const picks = Array.from(
      { length: needs },
      () => available[Math.floor(Math.random() * available.length)].slug
    );
    setSelected((prev) => [...prev, ...picks]);
  };

  const clearBox = () => setSelected([]);

  const filledCount = selected.length;
  const total = Math.round(filledCount * SIZES[size].perBite);
  const isFull = filledCount >= size;
  const fillPercent = Math.round((filledCount / size) * 100);

  const continueOrder = () => {
    if (filledCount === 0) {
      showToast("Pick at least one flavor first.");
      return;
    }
    addToCart(`box-${size}`, `Custom box: ${selected.filter(Boolean).join(", ")}`);
    setReceipt(true);
    showToast("Box added to cart!");
  };

  return (
    <>
      <section className="section" style={{ paddingBottom: 16 }}>
        <div className="container">
          <span className="eyebrow">Custom Treats</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 40 }}>
            Build your perfect box.
          </h1>
          <p className="body-lg text-muted mt-stack-sm" style={{ maxWidth: 560 }}>
            Pick a size, then tap flavors to fill your box. Perfect for sharing
            (or keeping all to yourself).
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="box-builder">
            <div>
              <h2 className="headline-lg mb-stack-md">Step 1 - Pick your size</h2>
              <div className="size-picker">
                {Object.entries(SIZES).map(([key, s]) => (
                  <button
                    key={key}
                    className={`size-option${size === Number(key) ? " active" : ""}`}
                    onClick={() => {
                      setSize(Number(key));
                      setSelected((prev) => prev.slice(0, Number(key)));
                    }}
                  >
                    <strong>{s.label}</strong>
                    <span>
                      Rs. {s.price} &middot; Rs. {s.perBite} / bite
                    </span>
                  </button>
                ))}
              </div>

              <h2 className="headline-lg mb-stack-md">Step 2 - Choose your flavors</h2>
              <div className="mini-grid">
                {available.map((p) => {
                  const count = countFor(p.slug);
                  return (
                    <div
                      key={p.slug}
                      className={`mini-card${count > 0 ? " active" : ""}`}
                      onClick={() => addFlavor(p.slug)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          addFlavor(p.slug);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Add ${p.name}`}
                    >
                      {count > 0 && <span className="mini-count">× {count}</span>}
                      <span className="mini-media">
                        <img src={p.img} alt={p.name} loading="lazy" />
                      </span>
                      <span className="mini-card-body">
                        <strong>{p.name}</strong>
                        <span>
                          Rs. {p.price} {p.unit}
                        </span>
                        {count > 0 && (
                          <span className="qty-row">
                            <button
                              type="button"
                              className="qty-btn"
                              aria-label={`Remove one ${p.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFlavor(p.slug);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                remove
                              </span>
                            </button>
                            <span className="qty-val">{count}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              aria-label={`Add one ${p.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                addFlavor(p.slug);
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                add
                              </span>
                            </button>
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className={`box-summary${isFull ? " box-full" : ""}`}>
              <h3 className="headline-lg mb-stack-sm">Your Box</h3>
              <div className="box-progress">
                <div className="box-progress-track">
                  <div
                    className="box-progress-fill"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
                <span className="box-progress-label">
                  {isFull ? "Box full!" : `${filledCount}/${size} bites chosen`}
                </span>
              </div>
              <div className="box-slots">
                {Array.from({ length: size }).map((_, i) => {
                  const slug = selected[i];
                  const item = slug ? available.find((p) => p.slug === slug) : null;
                  return (
                    <div className={`box-slot${item ? "" : " empty"}`} key={i}>
                      {item ? (
                        <>
                          <span className="slot-main">
                            <img className="slot-thumb" src={item.img} alt="" />
                            <span className="slot-name">{item.name}</span>
                          </span>
                          <button
                            className="slot-remove"
                            onClick={() => removeSlot(i)}
                          >
                            remove
                          </button>
                        </>
                      ) : (
                        <span className="slot-empty">Pick a flavor...</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="box-tools">
                <button className="box-tool" onClick={surpriseMe}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    shuffle
                  </span>
                  Surprise me
                </button>
                <button
                  className="box-tool"
                  onClick={clearBox}
                  disabled={filledCount === 0}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    delete
                  </span>
                  Clear
                </button>
              </div>
              <div className="box-total">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
              <button
                className={`btn btn-primary btn-block${isFull ? " pulse-full" : ""}`}
                style={{ marginTop: 20 }}
                onClick={continueOrder}
              >
                {isFull ? "Add Box to Cart" : "Add Box to Cart"}
              </button>
            </aside>
          </div>
        </div>
      </section>
      {receipt && (
        <CartReceipt
          item={{ name: `${size} Bites Custom Box`, price: total }}
          onDone={() => setReceipt(false)}
        />
      )}
    </>
  );
}
