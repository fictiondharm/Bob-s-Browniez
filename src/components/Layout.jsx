import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useApp } from "../context/AppContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [useLocation().pathname]);

  return null;
}

function Toast() {
  const { toast } = useApp();
  return <div className={`toast${toast ? " show" : ""}`}>{toast}</div>;
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <main key={pathname} className="page-enter" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
