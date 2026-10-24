/* Little face-down cards that show the shape of a spread. */
export default function SpreadPreview({ spread }) {
  return (
    <div className={`spread-preview ${spread.preview}`} aria-hidden="true">
      {spread.positions.map((position) => (
        <span key={position} />
      ))}
    </div>
  );
}
