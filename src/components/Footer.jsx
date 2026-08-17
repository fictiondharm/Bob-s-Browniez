import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              Bob&rsquo;s Browniez
            </Link>
            <p className="footer-tagline">
              Weekend-baked, small-batch brownies delivered fresh to your door.
            </p>
          </div>

          <nav className="footer-nav-col">
            <h4>Menu</h4>
            <Link to="/shop">Shop</Link>
            <Link to="/build-a-box">Build a Box</Link>
            <Link to="/gifting">Gifting</Link>
            <Link to="/order">Shipping Policy</Link>
          </nav>

          <nav className="footer-nav-col">
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/contact#faq">FAQs</Link>
          </nav>

          <div className="footer-contact-col">
            <h4>Get in touch</h4>
            <a href="mailto:hello@bobsbrowniez.com">
              <span className="material-symbols-outlined">mail</span>
              hello@bobsbrowniez.com
            </a>
            <a href="tel:+15551234567">
              <span className="material-symbols-outlined">phone</span>
              +1 (555) 123-4567
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Bob&rsquo;s Browniez</span>
          <span className="footer-bottom-sep">&middot;</span>
          <span>Baked with love every weekend</span>
        </div>
      </div>
    </footer>
  );
}
