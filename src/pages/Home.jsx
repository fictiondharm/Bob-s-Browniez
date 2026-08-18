import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/h2.mp4";

const BG_COLORS = ["#fff9f0", "#fff0d4", "#f9ebdf"];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % BG_COLORS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hero"
      style={{ backgroundColor: BG_COLORS[index], minHeight: "100vh" }}
    >
      <header className="container hero-inner">
        <div className="hero-text">
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
          <div className="btn-row">
            <Link to="/shop" className="btn btn-primary" style={{ padding: "14px 40px", transform: "rotate(-3deg)" }}>
              Shop Now
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
            />
          </div>
        </div>
      </header>

      <section className="section-tight">
        <div className="container">
          <div className="policy-banner">
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
