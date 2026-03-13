export default function GoldDivider({
  short = false,
  className = "",
}: {
  short?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${short ? "gold-divider-short" : "gold-divider"} ${className}`}
      aria-hidden="true"
    />
  );
}
