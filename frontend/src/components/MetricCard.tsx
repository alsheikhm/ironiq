interface MetricCardProps {
  title: string;
  value: string | number;
}


function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <section className="metric-card">
      <h3>{title}</h3>
      <p className="metric-value">{value}</p>
    </section>
  );
}


export default MetricCard;