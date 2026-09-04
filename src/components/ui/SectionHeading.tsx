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
    <div className={`mb-12 lg:mb-16 ${centered ? "text-center" : ""}`}>
      <GoldDivider short className={`mb-6 ${centered ? "" : "!mx-0"}`} />
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl leading-tight ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base lg:text-lg max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
