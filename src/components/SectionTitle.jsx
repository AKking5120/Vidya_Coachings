export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <div className="accent-line" />
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
