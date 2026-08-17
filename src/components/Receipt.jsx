import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function CartReceipt({ item, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.closest(".receipt-anchor");
    if (parent) {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--rx", `${r.left + r.width / 2}px`);
      el.style.setProperty("--ry", `${r.top}px`);
    }
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div className="cart-receipt" ref={ref}>
      <div className="receipt-paper">
        <div className="receipt-header">Bob's Browniez</div>
        <div className="receipt-divider" />
        <div className="receipt-row">
          <span>{item.name}</span>
          <span>Rs. {item.price}</span>
        </div>
        <div className="receipt-divider" />
        <div className="receipt-footer">Added to cart!</div>
        <div className="receipt-zigzag" />
      </div>
    </div>,
    document.body
  );
}

export function OrderReceipt({ items, total, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div className="order-receipt-overlay" ref={ref}>
      <div className="order-receipt">
        <div className="receipt-paper receipt-paper-full">
          <div className="receipt-header">Bob's Browniez</div>
          <div className="receipt-subheader">Weekend Bake Order</div>
          <div className="receipt-divider" />
          <div className="receipt-stamp">CONFIRMED</div>
          {items.map((item, i) => (
            <div className="receipt-row" key={i}>
              <span>{item.name}</span>
              <span>Rs. {item.price}</span>
            </div>
          ))}
          <div className="receipt-divider" />
          <div className="receipt-row receipt-total">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-footer">Thank you for your order!</div>
          <div className="receipt-footer-small">We'll confirm via WhatsApp / email</div>
          <div className="receipt-zigzag" />
        </div>
      </div>
    </div>,
    document.body
  );
}
