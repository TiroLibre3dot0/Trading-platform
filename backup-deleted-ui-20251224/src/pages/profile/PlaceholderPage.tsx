interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <div className="space-y-2 text-white">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-white/70">{description ?? "Coming soon. This section will be wired to live data."}</p>
  </div>
);

export default PlaceholderPage;
