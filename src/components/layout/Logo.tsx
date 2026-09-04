/**
 * Stema OnLawOffice — SVG inline, jo <img>.
 *
 * Unaza dhe fjala ONLAW përdorin `currentColor`: ngjyra e logos vjen nga
 * `color` i kontejnerit, kështu që varianti për sfond të errët nuk kërkon
 * skedar të dytë. Jeshilja mbetet fikse — është sinjali i markës. Mbi sfond
 * të errët kalo `green="#2E9E6F"` (varianti i çelur i dizajnerit).
 */
const SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', serif";

type Props = {
  className?: string;
  variant?: "horizontal" | "stacked";
  green?: string;
};

export default function Logo({
  className = "",
  variant = "horizontal",
  green = "#146B4A",
}: Props) {
  if (variant === "stacked") {
    return (
      <svg
        viewBox="0 0 260 200"
        role="img"
        aria-label="OnLawOffice — Av. Orjon Nallbati"
        className={className}
      >
        <title>OnLawOffice</title>
        <path
          d="M114 26.6 A 30 30 0 1 0 146 26.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path d="M130 14 L 130 52" fill="none" stroke={green} strokeWidth="8" strokeLinecap="round" />
        <text x="130" y="125" textAnchor="middle" fill="currentColor" fontFamily={SERIF} fontSize="34" letterSpacing="1.5">
          ONLAW
        </text>
        <text x="133.5" y="147" textAnchor="middle" fill={green} fontFamily={SERIF} fontSize="13" letterSpacing="7">
          OFFICE
        </text>
        <path d="M90 161 L 170 161" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <text x="131.25" y="178" textAnchor="middle" fill="currentColor" opacity="0.7" fontFamily={SERIF} fontSize="9.5" letterSpacing="2.5">
          ORJON NALLBATI
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 230 100" role="img" aria-label="OnLawOffice" className={className}>
      <title>OnLawOffice</title>
      <text x="104" y="50" fill="currentColor" fontFamily={SERIF} fontSize="30" letterSpacing="1.5">
        ONLAW
      </text>
      <path
        d="M34.2 28 A 26 26 0 1 0 61.8 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M48 18 L 48 50" fill="none" stroke={green} strokeWidth="7" strokeLinecap="round" />
      <path d="M88 24 L 88 76" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <text x="106" y="70" fill={green} fontFamily={SERIF} fontSize="12" letterSpacing="5.5">
        OFFICE
      </text>
    </svg>
  );
}
