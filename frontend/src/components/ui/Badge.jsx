export default function Badge({ level }) {
  return <span className={`badge badge-${level}`}>{level}</span>;
}