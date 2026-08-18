import { useEffect } from "react";
import { createPortal } from "react-dom";

export function CartReceipt({ item, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div className="cart-receipt">
      <div className="receipt-paper">
        <div className="receipt-row">
          <span className="receipt-item-name">{item.name}</span>
          <span className="receipt-item-price">Rs. {item.price}</span>
        </div>
        <div className="receipt-divider" />
        <div className="receipt-footer">Added to cart</div>
      </div>
    </div>,
    document.body
  );
}

export function OrderReceipt({ items, total, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div className="order-receipt-overlay" onClick={onDone}>
      <div className="order-receipt" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-paper receipt-paper-full">
          <div className="receipt-header">Bob&apos;s Browniez</div>
          <div className="receipt-subheader">Weekend Bake Order</div>
          <div className="receipt-divider" />
          <div className="receipt-stamp">PLACED</div>
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
          <div className="receipt-footer">Thank you!</div>
          <div className="receipt-footer-small">We&apos;ll confirm via WhatsApp / email</div>
          <div className="receipt-zigzag" />
        </div>
      </div>
    </div>,
    document.body
  );
}
