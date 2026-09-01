export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="page-section-head">
      <span className="section-eyebrow">Vidya Coachings</span>
      <h2 className="section-heading">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
