import ProgressBar from "../ui/Progressbar";

export default function HospitalTable({ data }) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Hospital</th>
          <th>Zone</th>
          <th>Load</th>
        </tr>
      </thead>
      <tbody>
        {data.map((h, i) => (
          <tr key={i}>
            <td>{h.hospital}</td>
            <td>{h.zone}</td>
            <td><ProgressBar value={h.loadPercent} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
