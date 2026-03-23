interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="page-header surface-glass">
      <div className="page-header-brand">
        <img src="/logos/LOGO.jpeg" alt="DojoFlow logo" className="logo-mark logo-mark--sm" />
        <div className="page-header-copy">
          <span className="page-header-eyebrow">DojoFlow / Admin Suite</span>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
