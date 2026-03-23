import { PageHeader } from '../components/PageHeader';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';

interface ReportSummary {
  total_revenue: number;
  total_students: number;
  active_students: number;
  inactive_students: number;
  total_enrollments: number;
  attendance_rate: number;
  pending_payments: number;
  paid_payments: number;
  total_teachers: number;
  average_attendance_per_class: number;
  top_class_by_attendance: string;
}

interface AttendanceTrend {
  date: string;
  count: number;
}

interface RevenueBreakdown {
  label: string;
  value: number;
}

interface TopStudent {
  id: number;
  name: string;
  attendance: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function ReportsPage() {
  const { data: summary, loading: summaryLoading } = useApi<ReportSummary>('/reports/summary', { showAlert: false });
  const { data: attendanceTrend = [], loading: trendLoading } = useApi<AttendanceTrend[]>('/reports/attendance-trend?days=30', { showAlert: false });
  const { data: revenueBd = [], loading: revenueLoading } = useApi<RevenueBreakdown[]>('/reports/revenue-breakdown', { showAlert: false });
  const { data: topStudents = [], loading: topLoading } = useApi<TopStudent[]>('/reports/top-students?limit=10', { showAlert: false });

  const loading = summaryLoading || trendLoading || revenueLoading || topLoading;



  if (loading) {
    return (
      <div className="page page-shell">
        <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="page page-shell">
        <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />
        <div className="hero-empty surface-glass">
          <p>Sin datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-shell">
      <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />

      <div className="report-insight-banner surface-glass">
        <div>
          <span className="executive-label">Clase líder</span>
          <strong>{summary.top_class_by_attendance || "Sin datos"}</strong>
        </div>
        <div>
          <span className="executive-label">Promedio por clase</span>
          <strong>{summary.average_attendance_per_class.toFixed(1)}</strong>
        </div>
        <div>
          <span className="executive-label">Pagos confirmados</span>
          <strong>{summary.paid_payments}</strong>
        </div>
      </div>

      <div className="executive-strip surface-glass">
        <div>
          <span className="executive-label">Revenue</span>
          <strong>${summary.total_revenue.toLocaleString()}</strong>
        </div>
        <div>
          <span className="executive-label">Asistencia</span>
          <strong>{summary.attendance_rate.toFixed(1)}%</strong>
        </div>
        <div>
          <span className="executive-label">Cobranza</span>
          <strong>{summary.pending_payments} pendientes</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="report-kpi-grid">
        <div className="report-kpi report-kpi-blue surface-glass">
          <div className="report-kpi-label">Ingresos Totales</div>
          <div className="report-kpi-value">
            ${summary.total_revenue.toLocaleString()}
          </div>
        </div>

        <div className="report-kpi report-kpi-green surface-glass">
          <div className="report-kpi-label">Alumnos Activos</div>
          <div className="report-kpi-value">
            {summary.active_students}/{summary.total_students}
          </div>
        </div>

        <div className="report-kpi report-kpi-orange surface-glass">
          <div className="report-kpi-label">Asistencia (mes)</div>
          <div className="report-kpi-value">
            {summary.total_enrollments} clases
          </div>
        </div>

        <div className="report-kpi report-kpi-red surface-glass">
          <div className="report-kpi-label">Pagos Pendientes</div>
          <div className="report-kpi-value">
            ${summary.pending_payments.toLocaleString()}
          </div>
        </div>

        <div className="report-kpi report-kpi-purple surface-glass">
          <div className="report-kpi-label">Instructores</div>
          <div className="report-kpi-value">
            {summary.total_teachers}
          </div>
        </div>

        <div className="report-kpi report-kpi-cyan surface-glass">
          <div className="report-kpi-label">Tasa Asistencia</div>
          <div className="report-kpi-value">
            {summary.attendance_rate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="report-secondary-grid">
        <div className="report-secondary-card surface-glass">
          <span className="executive-label">Alumnos inactivos</span>
          <strong>{summary.inactive_students}</strong>
          <p>Base en riesgo o desactivada que requiere seguimiento.</p>
        </div>
        <div className="report-secondary-card surface-glass">
          <span className="executive-label">Pagos al día</span>
          <strong>{summary.paid_payments}</strong>
          <p>Ingresos conciliados y listos para operar.</p>
        </div>
        <div className="report-secondary-card surface-glass">
          <span className="executive-label">Retención académica</span>
          <strong>{summary.attendance_rate.toFixed(1)}%</strong>
          <p>Señal de compromiso y salud del dojo.</p>
        </div>
      </div>

      {/* Charts */}
      <div className="report-chart-grid">
        {/* Attendance Trend */}
        <div className="report-chart-card surface-glass">
          <div className="section-headline">
            <h3>Tendencia de Asistencia</h3>
            <span>30 días</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        {revenueBd.length > 0 && (
          <div className="report-chart-card surface-glass">
            <div className="section-headline">
              <h3>Ingresos por Método de Pago</h3>
              <span>Breakdown</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueBd} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
                  {revenueBd.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Students */}
      {topStudents.length > 0 && (
        <div className="report-chart-card surface-glass">
          <div className="section-headline">
            <h3>Top 10 Alumnos por Asistencia</h3>
            <span>Ranking</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStudents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
