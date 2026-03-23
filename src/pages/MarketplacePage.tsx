import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { api } from "../lib/api";
import { MarketplaceItem } from "../types";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useApi";
import { useAlert } from "../contexts/AlertContext";

export function MarketplacePage() {
  const { data: items = [], loading, refetch } = useApi<MarketplaceItem[]>("/marketplace");
  const { success, error: showError } = useAlert();

  const { values: form, loading: saving, handleChange, handleSubmit, reset } = useForm({
    initialValues: { name: "", category: "Uniformes", price: 0, stock: 0 },
    onSubmit: async (values) => {
      try {
        await api.post("/marketplace", values);
        success("Producto agregado exitosamente");
        reset();
        refetch();
      } catch {
        showError("Error al agregar el producto");
      }
    },
  });

  const activeProducts = items.filter((item) => item.active).length;
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  if (loading) {
    return (
      <section className="page-shell">
        <PageHeader
          title="Marketplace"
          subtitle="Administra productos oficiales y genera ingresos adicionales por equipamiento."
        />
        <div className="hero-empty surface-glass">
          <div className="spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <PageHeader
        title="Marketplace"
        subtitle="Administra productos oficiales y genera ingresos adicionales por equipamiento."
      />

      <div className="split" style={{ marginBottom: "1rem" }}>
        <form className="card form-section surface-glass" onSubmit={handleSubmit}>
          <h3 style={{ marginTop: 0 }}>Nuevo producto</h3>
          <div className="form-row">
            <input
              placeholder="Nombre del producto"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="Uniformes">Uniformes</option>
              <option value="Protección">Protección</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
          <div className="form-row">
            <input
              type="number"
              min={1}
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
              disabled={saving}
              required
            />
            <input
              type="number"
              min={0}
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              disabled={saving}
              required
            />
          </div>
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Agregar producto"}
          </button>
        </form>

        <div className="card surface-glass">
          <h3 style={{ marginTop: 0 }}>Resumen</h3>
          <p className="page-subtitle">Productos activos en tu catálogo</p>
          <p className="price" style={{ marginTop: 0 }}>{activeProducts}</p>
          <p className="page-subtitle">Stock total disponible</p>
          <p className="price" style={{ marginTop: 0 }}>{totalStock}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>No hay productos en el catálogo todavía.</p>
        </div>
      ) : (
        <div className="grid cols-3">
          {items.map((item) => (
            <article key={item.id} className="card surface-glass">
              <h3 style={{ marginTop: 0 }}>{item.name}</h3>
              <p className="page-subtitle" style={{ marginBottom: "0.3rem" }}>{item.category}</p>
              <p className="price" style={{ marginTop: 0 }}>${item.price.toLocaleString("es-MX")}</p>
              <p>Stock: {item.stock}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
