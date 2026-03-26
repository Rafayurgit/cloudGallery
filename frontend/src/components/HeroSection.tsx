const HeroSection = () => {
  return (
    <section className="hero">
      <p className="eyebrow">Unified cloud workspace</p>
      <h1>File management that feels calm, fast, and modern.</h1>
      <p className="hero__copy">
        Connect multiple providers, browse everything from one dashboard, and stay in control with secure tenant-first architecture.
      </p>
      <div className="hero__actions">
        <button type="button" className="btn btn--solid">
          Start Free
        </button>
        <button type="button" className="btn btn--ghost">
          Explore Demo
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
