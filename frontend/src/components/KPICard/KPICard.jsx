export default function KpiCard({ title, value, className = "", icon: Icon }) {
  return (
    <div className={`kpi-card ${className}`}>
      {Icon && (
        <div className="kpi-card-icon">
          <Icon fontSize="small" />
        </div>
      )}
      <div className="kpi-content">
        <div className="kpi-title">{title}</div>
        <div className={`kpi-value ${className}`}>
          {value}
        </div>
      </div>
    </div>
  );
}