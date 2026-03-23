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
      <div className="page">
        <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="page">
        <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Sin datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Reportes y Análisis" subtitle="Análisis detallado del rendimiento de tu academia" />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Ingresos Totales</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            ${summary.total_revenue.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Alumnos Activos</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            {summary.active_students}/{summary.total_students}
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Asistencia (mes)</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            {summary.total_enrollments} clases
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Pagos Pendientes</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            ${summary.pending_payments.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Instructores</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            {summary.total_teachers}
          </div>
        </div>

        <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Tasa Asistencia</div>
          <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>
            {summary.attendance_rate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Attendance Trend */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Tendencia de Asistencia (30 días)</h3>
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
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Ingresos por Método de Pago</h3>
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
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Top 10 Alumnos por Asistencia</h3>
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
