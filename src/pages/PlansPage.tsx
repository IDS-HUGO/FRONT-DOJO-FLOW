import { PageHeader } from "../components/PageHeader";
import { useApi } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "../lib/api";
import { Plan, PlanCheckoutResponse, PlanSubscriptionPayment } from "../types";

export function PlansPage() {
  const { data: plans = [], loading } = useApi<Plan[]>("/plans");
  const { success, error: showError, info, warning } = useAlert();
  const location = useLocation();
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token");
    const payerId = params.get("PayerID");

    if (!orderId) {
      return;
    }

    if (!payerId) {
      warning("Contratacion cancelada por el usuario en PayPal");
      window.history.replaceState({}, document.title, location.pathname);
      return;
    }

    const verifyPlanPayment = async () => {
      try {
        const { data } = await api.post<PlanSubscriptionPayment>("/plans/checkout/paypal/verify", {
          order_id: orderId,
        });

        if (data.status === "paid") {
          success("Suscripcion activada correctamente");
        } else if (data.status === "pending") {
          info("El pago de la suscripcion esta pendiente de confirmacion");
        } else {
          showError("El pago de la suscripcion fue rechazado");
        }
      } catch (err) {
        showError(getApiErrorMessage(err, "No se pudo validar el pago de la suscripcion"));
      } finally {
        window.history.replaceState({}, document.title, location.pathname);
      }
    };

    void verifyPlanPayment();
  }, [location.pathname, location.search, info, showError, success, warning]);

  const handleBuyPlan = async (plan: Plan) => {
    if (plan.monthly_price <= 0) {
      info("Este plan es gratuito y no necesita checkout");
      return;
    }

    setProcessingPlanId(plan.id);
    try {
      const { data } = await api.post<PlanCheckoutResponse>(`/plans/${plan.id}/checkout/paypal`, {});
      window.location.href = data.checkout_url;
    } catch (err) {
      showError(getApiErrorMessage(err, "No se pudo iniciar el checkout del plan"));
      setProcessingPlanId(null);
    }
  };

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
            <button
              type="button"
              onClick={() => void handleBuyPlan(plan)}
              disabled={processingPlanId === plan.id}
            >
              {processingPlanId === plan.id
                ? "Redirigiendo..."
                : plan.monthly_price > 0
                  ? "Contratar plan"
                  : "Plan gratuito"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
