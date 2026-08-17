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

function Toast() {
  const { toast } = useApp();
  return <div className={`toast${toast ? " show" : ""}`}>{toast}</div>;
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main key={pathname} className="page-enter" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
