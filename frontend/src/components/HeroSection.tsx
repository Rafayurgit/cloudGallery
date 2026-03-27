const HeroSection = () => {
  return (
    <section className="hero">
      <p className="eyebrow">Unified cloud workspace</p>
      <h1>File management that feels calm, fast, and modern.</h1>
      <p className="hero__copy">
        Connect multiple providers, browse everything from one dashboard, and stay in control with secure tenant-first architecture.
      </p>
      <div className="hero__actions">
        <a className="btn btn--solid" href="#flow">
          Start Free
        </a>
        <a className="btn btn--ghost" href="#features">
          Explore Demo
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
