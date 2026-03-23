import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin-dashboard.css';

interface Order {
  id: number;
  dojo_name: string;
  owner_name: string;
  owner_email: string;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  created_at: string;
}

interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    paid: number;
    completed: number;
  };
  users: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    currency: string;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('dojo_token');
    const email = localStorage.getItem('dojo_user_email');

    if (!token || email !== 'owner@dojoflow.com') {
      navigate('/login');
      return;
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('http://localhost:8000/api/v1/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch orders
      const ordersRes = await fetch('http://localhost:8000/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!ordersRes.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dojo_token');
    localStorage.removeItem('dojo_user_email');
    navigate('/login');
  };

  const filteredOrders = statusFilter 
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  if (loading) return <div className="admin-loading">Cargando dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-navbar-brand">
          <div className="admin-brand-row">
            <img src="/logos/LOGO.jpeg" alt="DojoFlow logo" className="logo-mark logo-mark--sm" />
            <h1>DojoFlow Admin</h1>
          </div>
        </div>
        <div className="admin-navbar-actions">
          <span className="admin-user-info">owner@dojoflow.com</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="admin-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Órdenes Totales</div>
            <div className="stat-value">{stats?.orders.total}</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-label">Pendientes</div>
            <div className="stat-value">{stats?.orders.pending}</div>
          </div>
          <div className="stat-card stat-paid">
            <div className="stat-label">Pagadas</div>
            <div className="stat-value">{stats?.orders.paid}</div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-label">Completadas</div>
            <div className="stat-value">{stats?.orders.completed}</div>
          </div>
          <div className="stat-card stat-revenue">
            <div className="stat-label">Ingresos Totales</div>
            <div className="stat-value">${stats?.revenue.total.toLocaleString()} MXN</div>
          </div>
          <div className="stat-card stat-users">
            <div className="stat-label">Usuarios Activos</div>
            <div className="stat-value">{stats?.users.active}/{stats?.users.total}</div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="admin-section">
          <div className="section-header">
            <h2>📦 Órdenes de Compra</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${!statusFilter ? 'active' : ''}`}
                onClick={() => setStatusFilter('')}
              >
                Todas ({orders.length})
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pendientes ({stats?.orders.pending})
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
                onClick={() => setStatusFilter('paid')}
              >
                Pagadas ({stats?.orders.paid})
              </button>
            </div>
          </div>

          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Academia</th>
                  <th>Dueño</th>
                  <th>Email</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className={`status-${order.status}`}>
                    <td className="order-id">#{order.id}</td>
                    <td>{order.dojo_name}</td>
                    <td>{order.owner_name}</td>
                    <td className="email">{order.owner_email}</td>
                    <td className="amount">${order.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status === 'pending' && '⏳ Pendiente'}
                        {order.status === 'paid' && '✅ Pagado'}
                        {order.status === 'completed' && '🎉 Completado'}
                        {order.status === 'cancelled' && '❌ Cancelado'}
                      </span>
                    </td>
                    <td className="date">{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <p>No hay órdenes con el estado seleccionado</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="admin-section">
          <h2>📊 Métricas Principales</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Tasa de Conversión</div>
              <div className="metric-value">
                {stats?.orders.total ? 
                  ((stats?.orders.paid / stats?.orders.total) * 100).toFixed(1) : 0
                }%
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Ingreso Promedio por Orden</div>
              <div className="metric-value">
                ${stats?.orders.paid ? 
                  (stats?.revenue.total / stats?.orders.paid).toFixed(0) : 0
                }
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Usuarios Totales</div>
              <div className="metric-value">{stats?.users.total}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
