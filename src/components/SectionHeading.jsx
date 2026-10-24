export default function SectionHeading({ eyebrow, title, Icon, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>
          {Icon && <Icon aria-hidden="true" />}
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
