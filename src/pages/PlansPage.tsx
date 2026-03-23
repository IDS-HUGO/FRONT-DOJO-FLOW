import { PageHeader } from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

interface Plan {
  id: number;
  name: string;
  monthly_price: number;
  description: string;
  transaction_fee_percent: number;
}

export function PlansPage() {
  const { data: plans = [], loading } = useApi<Plan[]>("/plans");

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader
          title="Planes SaaS"
          subtitle="Escala desde validación hasta operación avanzada con marketing automatizado."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando planes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Planes SaaS"
        subtitle="Escala desde validación hasta operación avanzada con marketing automatizado."
      />
      <div className="grid cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="card surface-glass">
            <h3 style={{ marginTop: 0 }}>{plan.name}</h3>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>{plan.description}</p>
            <p className="price">${plan.monthly_price.toLocaleString("es-MX")} MXN</p>
            <p>Comisión: {plan.transaction_fee_percent}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
