import { useState, useMemo } from 'react';
import { api } from '../lib/api';
import type { Coupon } from '../types';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { SearchFilter } from '../components/SearchFilter';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useApi';
import { useAlert } from '../contexts/AlertContext';

function getDefaultDate() {
  return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export function CouponsPage() {
  const { data: coupons = [], loading, refetch } = useApi<Coupon[]>('/coupons/');
  const { success, error: showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');

  const { values: formData, loading: saving, handleChange, handleSubmit, reset, setFieldValue } = useForm({
    initialValues: {
      code: '',
      discount_percent: 10,
      max_uses: '',
      valid_until: getDefaultDate(),
      active: true,
      description: '',
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          max_uses: values.max_uses ? parseInt(values.max_uses) : undefined,
        };
        await api.post('/coupons/', payload);
        success('Cupón creado exitosamente');
        reset();
        refetch();
      } catch {
        showError('Error al crear el cupón');
      }
    },
  });

  async function deleteCoupon(id: number) {
    if (!confirm('¿Eliminar cupón?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      success('Cupón eliminado exitosamente');
      refetch();
    } catch {
      showError('Error al eliminar el cupón');
    }
  }

  const rows = useMemo(
    () =>
      coupons
        .filter(c =>
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(c => [
          c.code,
          `${c.discount_percent}%`,
          c.max_uses ? `${c.used_count}/${c.max_uses}` : `${c.used_count}/∞`,
          c.valid_until,
          c.description || '-',
          <button key={c.id} onClick={() => deleteCoupon(c.id)} className="btn-secondary" style={{ fontSize: '0.875rem' }}>Eliminar</button>
        ]),
    [coupons, searchQuery]
  );

  if (loading) {
    return (
      <div className="page">
        <PageHeader title="Cupones y Descuentos" subtitle="Gestión de promociones y ofertas" />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div className="spinner"></div>
          <p>Cargando cupones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Cupones y Descuentos" subtitle="Gestión de promociones y ofertas" />

      <form onSubmit={handleSubmit} className="form-section card">
        <h3>Nuevo Cupón</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Código (ej: WELCOME10)"
            name="code"
            value={formData.code}
            onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
            disabled={saving}
            required
          />
          <input
            type="number"
            placeholder="Descuento (%)"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            min="1"
            max="100"
            disabled={saving}
            required
          />
          <input
            type="number"
            placeholder="Usos máximos (dejar en blanco para ilimitado)"
            name="max_uses"
            value={formData.max_uses}
            onChange={handleChange}
            min="1"
            disabled={saving}
          />
          <input
            type="date"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            type="text"
            placeholder="Descripción (ej: 10% para nuevos clientes)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={saving}
            style={{ gridColumn: 'span 2' }}
          />
          <button type="submit" disabled={saving} className="btn-primary" style={{ gridColumn: 'span 2' }}>
            {saving ? 'Guardando...' : 'Crear Cupón'}
          </button>
        </div>
      </form>

      <SearchFilter
        placeholder="Buscar cupón por código o descripción..."
        value={searchQuery}
        onSearch={setSearchQuery}
      />

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>No hay cupones creados todavía.</p>
        </div>
      ) : (
        <DataTable
          headers={['Código', 'Descuento', 'Usos', 'Válido Hasta', 'Descripción', 'Acción']}
          rows={rows}
          caption="Cupones y promociones activas"
          emptyMessage="No hay cupones creados todavía."
        />
      )}
    </div>
  );
}
