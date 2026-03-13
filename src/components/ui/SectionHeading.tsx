import GoldDivider from "./GoldDivider";

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`mb-10 lg:mb-14 ${centered ? "text-center" : ""}`}>
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base lg:text-lg ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-4">
        <GoldDivider short />
      </div>
    </div>
  );
}
