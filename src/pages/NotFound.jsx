import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container center">
        <span className="eyebrow eyebrow-brown">404</span>
        <h1 className="headline-xl mt-stack-md">This page is a crumb short.</h1>
        <p className="body-lg text-muted mt-stack-sm">
          The page you&rsquo;re looking for went missing. Let&rsquo;s get you back to the good stuff.
        </p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 24 }}>
          <Link to="/" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
