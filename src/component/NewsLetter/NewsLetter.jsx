import "./NewsLetter.css";

function Newsletter() {
  return (
    <section className="newsletter">
      <h2>Join Our Newsletter</h2>
      <p>Get exclusive offers and new arrivals.</p>
      <div className="newsletter-form">
        <input placeholder="Email Address" type="email" required />
        <button type="submit">Subscribe</button>
      </div>
    </section>
  );
}

export default Newsletter;