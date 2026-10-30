export default function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  children?: React.ReactNode;
}) {
  return (
    <div className={`section-head${align === "center" ? " section-head--center" : ""}`} data-reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="h2">{title}</Tag>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </div>
  );
}
