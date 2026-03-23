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
      <section className="page-shell">
        <PageHeader
          title="Dashboard Ejecutivo"
          subtitle="Monitorea ingresos, retención y rendimiento de tu academia en tiempo real."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando indicadores clave...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Dashboard Ejecutivo"
        subtitle="Monitorea ingresos, retención y rendimiento de tu academia en tiempo real."
      />

      <div className="dashboard-pulse surface-glass">
        <div className="dashboard-pulse-item">
          <span className="executive-label">Ingresos estimados</span>
          <strong>${kpi?.mrr?.toLocaleString("es-MX") ?? "0"}</strong>
          <small>Liquidez mensual del negocio</small>
        </div>
        <div className="dashboard-pulse-item">
          <span className="executive-label">Retención</span>
          <strong>{(100 - (kpi?.churn_rate ?? 0)).toFixed(0)}%</strong>
          <small>Base activa comprometida</small>
        </div>
        <div className="dashboard-pulse-item">
          <span className="executive-label">Actividad operativa</span>
          <strong>{kpi?.attendance_this_month ?? 0}</strong>
          <small>Asistencias registradas este mes</small>
        </div>
      </div>

      <div className="executive-strip surface-glass">
        <div>
          <span className="executive-label">Visión general</span>
          <strong>Tu academia al momento</strong>
        </div>
        <div>
          <span className="executive-label">Operación</span>
          <strong>Seguimiento en vivo</strong>
        </div>
        <div>
          <span className="executive-label">Crecimiento</span>
          <strong>Ingresos y retención</strong>
        </div>
      </div>

      <div className="grid cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>

      <div className="dashboard-extended-grid">
        <div className="dashboard-extended-card surface-glass">
          <span className="executive-label">Promedio por alumno</span>
          <strong>${Math.round((kpi?.mrr ?? 0) / Math.max(kpi?.active_students ?? 1, 1)).toLocaleString("es-MX")}</strong>
          <p>Lectura rápida del ticket promedio mensual.</p>
        </div>
        <div className="dashboard-extended-card surface-glass">
          <span className="executive-label">Take-rate</span>
          <strong>${kpi?.take_rate_volume?.toLocaleString("es-MX") ?? "0"}</strong>
          <p>Volumen monetizable sobre la operación total.</p>
        </div>
        <div className="dashboard-extended-card surface-glass">
          <span className="executive-label">NPS</span>
          <strong>{kpi?.nps ?? 0}</strong>
          <p>Percepción del servicio y probabilidad de recomendación.</p>
        </div>
      </div>

      <div className="card executive-chart surface-glass">
        <div className="section-headline">
          <h3>Tendencia de MRR</h3>
          <span>Últimos 6 meses</span>
        </div>
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
          <p className="empty-inline">No hay datos de tendencia disponibles</p>
        )}
      </div>
    </section>
  );
}
