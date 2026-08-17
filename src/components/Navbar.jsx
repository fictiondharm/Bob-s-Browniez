import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/build-a-box", label: "Build a Box" },
  { to: "/gifting", label: "Gifting" },
  { to: "/order", label: "Order" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { cartCount } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          Bob&rsquo;s Browniez
        </Link>

        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className="nav-icon-btn"
            aria-label="Shopping Cart"
            title="Cart"
            onClick={() => navigate("/order")}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <Link to="/order" className="nav-cta">
            Order Now
          </Link>
          <button
            className="nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu open">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={close}>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <div className="drip">
        <svg
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 V10 C50,10 80,45 120,45 C160,45 180,15 220,15 C260,15 290,50 330,50 C370,50 390,20 430,20 C470,20 500,40 540,40 C580,40 600,10 640,10 C680,10 710,54 750,54 C790,54 810,25 850,25 C890,25 920,45 960,45 C1000,45 1020,15 1060,15 C1100,15 1130,50 1170,50 C1210,50 1230,20 1270,20 C1310,20 1340,40 1380,40 C1410,40 1430,20 1440,20 V0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </nav>
  );
}
