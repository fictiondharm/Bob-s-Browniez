import { useState } from "react";
import { faqs } from "../data/products";

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((v) => !v)}>
        {item.q}
        <span className="material-symbols-outlined">expand_more</span>
      </button>
      <div className="faq-a">{item.a}</div>
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow eyebrow-blue">Contact</span>
          <h1 className="headline-xl mt-stack-sm" style={{ fontSize: 40 }}>
            Say hello.
          </h1>
          <p className="body-lg text-muted mt-stack-sm" style={{ maxWidth: 560 }}>
            Questions about an order, corporate gifting, or just craving
            brownies? We reply fast.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info-side">
              <h3 className="headline-md mb-stack-sm">Get in touch</h3>
              <p className="text-muted mb-stack-md" style={{ fontSize: 15, lineHeight: 1.6 }}>
                Whether it&rsquo;s a question about your order, a corporate gifting
                inquiry, or just saying hi &mdash; we&rsquo;d love to hear from you.
              </p>
              <div className="contact-channels">
                <div className="contact-channel">
                  <div className="contact-channel-icon icon-pink">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <span className="label-bold">Email</span>
                    <a href="mailto:hello@bobsbrowniez.com">hello@bobsbrowniez.com</a>
                  </div>
                </div>
                <div className="contact-channel">
                  <div className="contact-channel-icon icon-blue">
                    <span className="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <span className="label-bold">Phone / WhatsApp</span>
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="contact-channel">
                  <div className="contact-channel-icon icon-brown">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <span className="label-bold">Bakehouse hours</span>
                    <span>Sat &amp; Sun, 9am &ndash; 4pm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card contact-form-side">
              {sent ? (
                <div className="form-success">
                  <span className="material-symbols-outlined">mark_email_read</span>
                  <h3 className="headline-lg">Message sent!</h3>
                  <p>Thanks for reaching out. We&rsquo;ll get back to you within a day.</p>
                </div>
              ) : (
                <>
                  <h2 className="headline-lg mb-stack-md">Send a message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                      <div className="field">
                        <label htmlFor="c-name">Name</label>
                        <input type="text" id="c-name" name="name" required placeholder="Jane Doe" />
                      </div>
                      <div className="field">
                        <label htmlFor="c-email">Email</label>
                        <input type="email" id="c-email" name="email" required placeholder="jane@email.com" />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="c-subject">Subject</label>
                      <select id="c-subject" name="subject" required defaultValue="">
                        <option value="" disabled>Choose a topic</option>
                        <option value="order">Order help</option>
                        <option value="gifting">Corporate / bulk gifting</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="c-message">Message</label>
                      <textarea id="c-message" name="message" required placeholder="Tell us everything..." />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head-row">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="eyebrow eyebrow-brown">FAQs</span>
                <h2 className="headline-lg" style={{ margin: 0 }}>Good to know</h2>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 760 }}>
            {faqs.map((f) => (
              <FaqItem key={f.q} item={f} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
