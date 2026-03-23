import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing-new.css";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
    setShowPricingModal(true);
    window.scrollTo(0, 0);
  };

  const plans = [
    {
      id: 0,
      name: "Plan Blanco",
      price: "0",
      description: "Para validar",
      features: ["Hasta 10 estudiantes", "Gestión básica"],
      cta: "Comenzar gratis",
      highlighted: false,
    },
    {
      id: 1,
      name: "Plan Negro",
      price: "520",
      description: "Profesional",
      features: ["Estudiantes ilimitados", "Control completo", "Exámenes y grados"],
      cta: "Comprar ahora",
      highlighted: true,
    },
    {
      id: 2,
      name: "Plan Maestro",
      price: "870",
      description: "Empresarial",
      features: ["Todo Plan Negro", "Marketing automatizado", "Soporte prioritario"],
      cta: "Comprar ahora",
      highlighted: false,
    },
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="logo-text">DojoFlow</span>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/login")} className="nav-login-btn">
            Ingresar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Profesionaliza tu Academia <br /> de Artes Marciales
          </h1>
          <p className="hero-subtitle">
            Automatiza pagos, controla asistencias, sigue el progreso de tus estudiantes y crece tu negocio.
          </p>

          <div className="cta-buttons">
            <button onClick={() => handleSelectPlan(1)} className="btn btn-primary btn-large">
              Comienza ahora
            </button>
            <button onClick={() => navigate("/login")} className="btn btn-secondary btn-large">
              Ya tengo cuenta
            </button>
          </div>

          <div className="trust-indicators">
            <div className="indicator">
              <span>✓ Prueba sin tarjeta</span>
            </div>
            <div className="indicator">
              <span>✓ Cancelar cuando quieras</span>
            </div>
            <div className="indicator">
              <span>✓ Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="features-section">
        <div className="section-container">
          <h2>Lo que ofrecemos</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Software Administrativo</h3>
              <p>Control de asistencias, exámenes y seguimiento de grados en tu dojo</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Pagos Automáticos</h3>
              <p>Procesa cobros recurrentes sin fricción, reduce la morosidad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>App para Alumnos</h3>
              <p>Tus estudiantes ven su progreso y motivación en tiempo real</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Marketplace</h3>
              <p>Vende equipo oficial (uniformes, protecciones) desde la plataforma</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="problem-section">
        <div className="section-container">
          <h2>El problema</h2>
          <p className="section-subtitle">Tres desafíos que enfrentas hoy</p>
          <div className="problems-grid">
            <div className="problem-card">
              <h3>Fricción en cobros</h3>
              <p>Cobrar manualmente, perseguir pagos, Excel y transferencias. Tiempo que no tienes.</p>
            </div>
            <div className="problem-card">
              <h3>Alta deserción</h3>
              <p>Los estudiantes se van sin avisar. Sin forma de saber quién está realmente comprometido.</p>
            </div>
            <div className="problem-card">
              <h3>Desorden administrativo</h3>
              <p>Registros dispersos, archivos perdidos, información de alumnos desordenada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section">
        <div className="section-container">
          <h2>Planes claros y justos</h2>
          <p className="section-subtitle">Elige el plan que se ajuste a tu crecimiento</p>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}>
                {plan.highlighted && <div className="popular-badge">MÁS POPULAR</div>}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </div>
                <div className="plan-price-box">
                  <span className="plan-price">${plan.price}</span>
                  <span className="plan-freq">MXN/mes</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  className={`btn btn-${plan.highlighted ? "primary" : "secondary"} btn-full`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>DojoFlow</h4>
            <p>El aliado tecnológico de tu academia de artes marciales</p>
          </div>
          <div className="footer-section">
            <h4>Producto</h4>
            <ul>
              <li><a href="#pricing">Precios</a></li>
              <li><a href="/login">Ingresar</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 DojoFlow. Profesionaliza tu academia. 🥋</p>
        </div>
      </footer>

      {/* Purchase Modal */}
      {showPricingModal && (
        <div className="modal-overlay" onClick={() => setShowPricingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPricingModal(false)}>×</button>
            <PurchaseForm planId={selectedPlan} onClose={() => setShowPricingModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

interface PurchaseFormProps {
  planId: number | null;
  onClose: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ planId, onClose }) => {
  const [formData, setFormData] = useState({
    dojo_name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    city: "",
    timezone: "America/Mexico_City",
    currency: "MXN",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const order = await response.json();
      setMessage(`✓ Orden creada. ID: ${order.id}. Redirigiendo al pago...`);

      // Simulate redirect to payment
      setTimeout(() => {
        // In production, redirect to Stripe checkout
        alert(`En producción, aquí irías a Stripe.\nCredenciales temporales:\nEmail: ${order.generated_email}\nPassword: [será generada después del pago]`);
        onClose();
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Inténtalo de nuevo"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="purchase-form" onSubmit={handleSubmit}>
      <h2>Completa tu información</h2>

      <div className="form-group">
        <label>Nombre del Dojo *</label>
        <input
          type="text"
          name="dojo_name"
          value={formData.dojo_name}
          onChange={handleChange}
          placeholder="Ej: Dojo Dragon Rojo"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Nombre del Dueño *</label>
          <input
            type="text"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="owner_email"
            value={formData.owner_email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Teléfono *</label>
          <input
            type="tel"
            name="owner_phone"
            value={formData.owner_phone}
            onChange={handleChange}
            placeholder="+52 555 000 0000"
            required
          />
        </div>
        <div className="form-group">
          <label>Ciudad *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad de México"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Zona Horaria</label>
          <select name="timezone" value={formData.timezone} onChange={handleChange}>
            <option value="America/Mexico_City">México Central</option>
            <option value="America/Chicago">Noreste</option>
            <option value="America/Denver">Noroeste</option>
          </select>
        </div>
      </div>

      {message && (
        <div className={`form-message ${message.startsWith("✓") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary btn-full">
        {loading ? "Procesando..." : "Proceder al pago"}
      </button>
    </form>
  );
};
        <div className="section-container">
          <h2 className="section-title">Lo que Dicen Nuestros Clientes</h2>
          <p className="section-subtitle">Miles de propietarios de dojos ya están transformando sus negocios</p>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="testimonial-meta">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-container">
          <h2 className="section-title">Planes que Crecen con Tu Negocio</h2>
          <p className="section-subtitle">Elige el plan perfecto para ti. Siempre puedes cambiar.</p>

          <div className="pricing-grid">
            {plans.map((plan, idx) => (
              <div key={idx} className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}>
                {plan.highlighted && <div className="popular-badge">MÁS POPULAR</div>}
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.price !== "Custom" ? "/mes" : ""}</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, f_idx) => (
                    <li key={f_idx}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn btn-${plan.highlighted ? "primary" : "secondary"} btn-full`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <h2>¿Listo para Transformar Tu Dojo?</h2>
          <p>Únete a miles de propietarios que ya están disfrutando de gestión simplificada</p>

          <div className="final-cta-buttons">
            <button onClick={handleContactClick} className="btn btn-primary btn-large">
              Solicitar Acceso
            </button>
            <button onClick={handleContactClick} className="btn btn-secondary btn-large">
              💬 Hablar con un Experto
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>DOJO-FLOW</h4>
            <p>La solución integral para gestionar tu academia de artes marciales</p>
          </div>
          <div className="footer-section">
            <h4>Producto</h4>
            <ul>
              <li><a href="#gallery">Características</a></li>
              <li><a href="#pricing">Precios</a></li>
              <li><a href="/login">Ingresar</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:hugofranciscoluisinclan@gmail.com">Email</a></li>
              <li><a href="#">Soporte</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Dojo-Flow. Transformando la gestión de artes marciales 🥋</p>
        </div>
      </footer>
    </div>
  );
};
