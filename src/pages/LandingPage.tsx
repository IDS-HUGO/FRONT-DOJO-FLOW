import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleContactClick = () => {
    window.location.href =
      "mailto:hugofranciscoluisinclan@gmail.com?subject=Solicitud de Acceso a Dojo-Flow&body=Hola,%0Aestoy interesado en acceder a Dojo-Flow para gestionar mi dojo.%0AGracias.";
  };

  const images = [
    { id: 1, title: "Dashboard Principal", emoji: "📊" },
    { id: 2, title: "Gestión de Estudiantes", emoji: "👥" },
    { id: 3, title: "Reportes Avanzados", emoji: "📈" },
    { id: 4, title: "Pagos Automatizados", emoji: "💳" },
    { id: 5, title: "Horarios Inteligentes", emoji: "📅" },
    { id: 6, title: "Análisis en Tiempo Real", emoji: "⚡" },
  ];

  const testimonials = [
    {
      name: "Carlos Martínez",
      role: "Dojo Sensei - Madrid",
      text: "Dojo-Flow transformó la manera en que gestiono mi academia. Ahora puedo enfocarse en enseñanza, no en administración.",
      avatar: "🥋",
    },
    {
      name: "María García",
      role: "Propietaria - Barcelona",
      text: "El sistema de pagos automatizado me ahorró 15 horas semanales. ¡Increíble inversión para mi negocio!",
      avatar: "👩‍🏫",
    },
    {
      name: "Juan López",
      role: "Director - Valencia",
      text: "Mis estudiantes y padres aman el portal. La experiencia de usuario es inmejorable.",
      avatar: "👨‍💼",
    },
  ];

  const plans = [
    {
      name: "STARTER",
      price: "29",
      description: "Perfecto para dojos nuevos",
      features: ["Hasta 50 estudiantes", "Gestión básica", "Reportes simples", "Email support"],
      cta: "Comenzar",
    },
    {
      name: "PROFESIONAL",
      price: "79",
      description: "La opción favorita",
      features: ["Hasta 500 estudiantes", "Control completo", "Reportes avanzados", "Soporte prioritario", "API access"],
      cta: "Más Popular",
      highlighted: true,
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      description: "Solución empresarial",
      features: ["Estudiantes ilimitados", "Integraciones custom", "Análisis AI", "Dedicado 24/7", "SLA guarantee"],
      cta: "Contactar",
    },
  ];

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="floating-gradient floating-gradient-1"></div>
        <div className="floating-gradient floating-gradient-2"></div>
        <div className="floating-gradient floating-gradient-3"></div>
        <div className="grid-bg"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src="/logos/LOGO.jpeg" alt="Dojo-Flow Logo" className="logo-image" />
          <span className="logo-text">DOJO</span>
          <span className="logo-flow">FLOW</span>
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
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>Nº 1 en Gestión de Dojos en Latinoamérica</span>
          </div>

          <h1 className="hero-title">
            <span className="text-gradient">Tu Dojo Merece</span>
            <br />
            <span className="text-glow">Una Plataforma de Nivel Mundial</span>
          </h1>

          <p className="hero-subtitle">
            La solución integral que transformará tu centro de artes marciales en un negocio altamente productivo y automatizado.
          </p>

          {/* Feature Pills */}
          <div className="feature-pills">
            <div className="pill">
              <span className="pill-icon">🎯</span>
              <span>Fácil de usar</span>
            </div>
            <div className="pill">
              <span className="pill-icon">⚡</span>
              <span>Automatización total</span>
            </div>
            <div className="pill">
              <span className="pill-icon">📱</span>
              <span>Mobile first</span>
            </div>
          </div>

          {/* CTA Buttons - MEJORADOS */}
          <div className="cta-buttons">
            <button onClick={handleContactClick} className="btn btn-primary btn-large">
              <span className="btn-glow"></span>
              <span className="btn-text">🚀 Solicitar Acceso</span>
            </button>

            <button onClick={handleContactClick} className="btn btn-secondary btn-large">
              <span className="btn-text">Agendar Demo</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-indicators">
            <div className="indicator">
              <span className="check-icon">✓</span>
              <span>Prueba 14 días gratis</span>
            </div>
            <div className="indicator">
              <span className="check-icon">✓</span>
              <span>No requiere tarjeta</span>
            </div>
            <div className="indicator">
              <span className="check-icon">✓</span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hero-decoration">
          <div className="orbiting-sphere sphere-1"></div>
          <div className="orbiting-sphere sphere-2"></div>
          <div className="orbiting-sphere sphere-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Dojos confían en nosotros</p>
          </div>
          <div className="stat-card">
            <h3>500K+</h3>
            <p>Estudiantes gestionados</p>
          </div>
          <div className="stat-card">
            <h3>$50M+</h3>
            <p>En pagos procesados</p>
          </div>
          <div className="stat-card">
            <h3>4.9★</h3>
            <p>Rating en reviews</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section" id="gallery">
        <div className="section-container">
          <h2 className="section-title">Interfaz Intuitiva y Potente</h2>
          <p className="section-subtitle">Diseñada para que gestiones tu dojo en minutos, no en horas</p>

          <div className="gallery-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => setSelectedImage(image.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="gallery-placeholder">
                  <div className="gallery-emoji">{image.emoji}</div>
                </div>
                <h4 className="gallery-title">{image.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Potencia Tu Negocio</h2>
          <p className="section-subtitle">Herramientas profesionales para crecer sin límites</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Gestión Completa</h3>
              <p>Registra, monitorea y gestiona todos los aspectos de tus estudiantes en un solo lugar centralizado</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Pagos Automatizados</h3>
              <p>Procesa pagos automáticos, genera reportes y mantén tu flujo de caja bajo control total</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Horarios Inteligentes</h3>
              <p>Crea y actualiza horarios dinámicamente, asigna instructores sin conflictos de disponibilidad</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Progreso de Belts</h3>
              <p>Registro digital de exámenes, calificaciones y seguimiento de cinturones automático</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Análisis Profundo</h3>
              <p>Obtén insights detallados sobre ingresos, asistencia, desempeño y tendencias de negocio</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Seguridad Garantizada</h3>
              <p>Encriptación bancaria de nivel empresarial protege todos tus datos sensibles 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
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
