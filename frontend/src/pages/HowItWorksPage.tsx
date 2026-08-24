export const HowItWorksPage = () => (
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-4xl font-bold text-primary mb-8">How It Works</h1>
    <div className="grid gap-8">
      {[
        { title: 'Find', desc: 'Browse our community marketplace for items you need.' },
        { title: 'Request', desc: 'Send a request to the owner for specific dates.' },
        { title: 'Borrow', desc: 'Pick up the item and enjoy it!' },
        { title: 'Return', desc: 'Return the item on time and leave a review.' },
      ].map((step, i) => (
        <div key={step.title} className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-2xl font-semibold text-accent mb-2">0{i + 1}. {step.title}</h2>
          <p className="text-text">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
