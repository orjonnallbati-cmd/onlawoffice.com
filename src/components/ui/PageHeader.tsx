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
    <section className="bg-navy pt-28 pb-16 lg:pt-36 lg:pb-20">
      <Container className="text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-6">
          <GoldDivider short />
        </div>
      </Container>
    </section>
  );
}
