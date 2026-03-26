const features = [
  { title: "Provider Hub", text: "Google Drive today, Dropbox and OneDrive ready in the same clean architecture." },
  { title: "Tenant Isolation", text: "User, provider, and file records are scoped for secure multi-tenant separation." },
  { title: "Metadata First", text: "Files stay in cloud providers while your platform keeps fast searchable metadata." }
];

const FeatureGrid = () => {
  return (
    <section id="features" className="section-block">
      <div className="section-head">
        <p className="eyebrow">Core strengths</p>
        <h2>Industry-standard foundation, zero clutter.</h2>
      </div>
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="surface-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
