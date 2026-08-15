import { FaPaw } from "react-icons/fa";

const pawPositions = [
  "paw-1",
  "paw-2",
  "paw-3",
  "paw-4",
  "paw-5",
  "paw-6",
  "paw-7",
  "paw-8",
];

export default function GlobalPawBackground() {
  return (
    <div
      className="global-paw-background"
      aria-hidden="true"
    >
      {pawPositions.map((paw) => (
        <FaPaw
          key={paw}
          className={`floating-paw ${paw}`}
        />
      ))}
    </div>
  );
}