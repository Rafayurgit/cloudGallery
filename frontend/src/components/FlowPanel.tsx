const flowSteps = ["Connect provider", "Sync metadata", "Search + manage files", "Scale with jobs + billing"];

const FlowPanel = () => {
  return (
    <section id="flow" className="section-block">
      <div className="flow-panel surface-card">
        <div className="section-head">
          <p className="eyebrow">Product flow</p>
          <h2>Simple journey, scalable internals.</h2>
        </div>
        <ol className="flow-panel__list">
          {flowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default FlowPanel;
