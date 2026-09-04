import Container from "./Container";
import GoldDivider from "./GoldDivider";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy pt-32 pb-16 lg:pt-44 lg:pb-20">
      <Container>
        <div className="max-w-3xl">
          <GoldDivider short className="!mx-0 mb-8" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
