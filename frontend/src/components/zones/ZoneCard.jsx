import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function ZoneCard({ zone }) {
  return (
    <div className="col-md-3">
      <Card title={zone.zone}>
        <p>Accidents: {zone.totalAccidents}</p>
        <Badge level={zone.alertLevel} />
      </Card>
    </div>
  );
}
