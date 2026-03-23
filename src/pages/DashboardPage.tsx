import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { useApi } from "../hooks/useApi";
import { DashboardKpi } from "../types";

interface TrendPoint {
  label: string;
  mrr: number;
}

export function DashboardPage() {
  const { data: kpi, loading: kpiLoading } = useApi<DashboardKpi>("/dashboard/kpis", { showAlert: false });
  const { data: trend = [], loading: trendLoading } = useApi<TrendPoint[]>("/dashboard/mrr-trend", { showAlert: false });

  const cards = useMemo(
    () => [
      { title: "MRR", value: `$${kpi?.mrr?.toLocaleString("es-MX") ?? "0"}`, color: "#3b82f6" },
      { title: "Churn", value: `${kpi?.churn_rate ?? 0}%`, color: "#ef4444" },
      { title: "Take-rate Volume", value: `$${kpi?.take_rate_volume?.toLocaleString("es-MX") ?? "0"}`, color: "#10b981" },
      { title: "NPS", value: `${kpi?.nps ?? 0}`, color: "#f59e0b" },
      { title: "Alumnos activos", value: `${kpi?.active_students ?? 0}`, color: "#8b5cf6" },
      { title: "Asistencias mes", value: `${kpi?.attendance_this_month ?? 0}`, color: "#06b6d4" },
    ],
    [kpi]
  );

  const loading = kpiLoading || trendLoading;

  if (loading) {
    return (
      <section>
        <PageHeader
          title="Dashboard Ejecutivo"
          subtitle="Monitorea ingresos, retención y rendimiento de tu academia en tiempo real."
        />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando indicadores clave...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Dashboard Ejecutivo"
        subtitle="Monitorea ingresos, retención y rendimiento de tu academia en tiempo real."
      />

      <div className="grid cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>

      <div className="card" style={{ marginTop: "1rem", height: 320 }}>
        <h3 style={{ marginTop: 0 }}>Tendencia de MRR (6 meses)</h3>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#0f172a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>No hay datos de tendencia disponibles</p>
        )}
      </div>
    </section>
  );
}
