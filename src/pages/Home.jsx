import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heroImages } from "../data/products";
import mainImage from "../assets/main.png";

const BG_COLORS = ["#fff9f0", "#fff0d4", "#f9ebdf"];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hero"
      style={{ backgroundColor: BG_COLORS[index], minHeight: "100vh" }}
    >
      <header className="container hero-inner">
        <div className="hero-text reveal">
          <span className="eyebrow">Sweet Weekend Vibes</span>
          <h1 className="headline-xl">
            Your Weekend Treat,
            <br />
            <span className="text-secondary squiggle-underline">Sorted.</span>
          </h1>
            <p className="body-lg text-muted" style={{ maxWidth: 460 }}>
              Indulge in our small-batch, handcrafted brownies and blondies. We
              bake fresh every weekend to bring you the coziest moments.
            </p>
            <img src={mainImage} alt="" className="hero-stamp" />
            <div className="btn-row">
              <Link to="/shop" className="btn btn-primary" style={{ padding: "14px 40px", transform: "rotate(-3deg)" }}>
                Adopt a Brownie
              </Link>
            </div>
        </div>
        <div className="hero-visual reveal-right" style={{ "--reveal-delay": "0.15s" }}>
          <div className="hero-blob">
            {heroImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Freshly baked brownie"
                className={`hero-slide${i === index ? " active" : ""}`}
              />
            ))}
          </div>
        </div>
      </header>

      <section className="section-tight">
        <div className="container">
          <div className="policy-banner reveal" style={{ "--reveal-delay": "0.3s" }}>
            <span className="material-symbols-outlined">calendar_month</span>
            <div>
              <h3 className="headline-md">Weekend Baking Protocol!</h3>
              <p className="body-md text-muted">
                We bake fresh for the weekend! Orders are delivered exclusively
                every <strong className="text-secondary">Saturday &amp; Sunday</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
