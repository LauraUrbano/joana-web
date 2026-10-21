/** Seta a 45°, como no ficheiro. */
export default function Seta({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block -rotate-45 ${className}`}>
      →
    </span>
  );
}
