import { COLORS } from "../constants";

export default function ColorPalette({ selectedColor, onSelect, position = "bottom" }) {
  const posClass = position === "top"
    ? "bottom-9 top-auto"
    : "top-9 bottom-auto";

  return (
    <div className={`absolute left-0 bg-white rounded-lg shadow-lg p-2 flex flex-wrap gap-1 w-4.2 z-200 ${posClass}`}>
      {COLORS.map((c) => (
        <button
          key={c.id}
          className="w-6.5 h-6.5 rounded-full cursor-pointer shrink-0 hover:scale-110 transition-transform"
          style={{
            backgroundColor: c.hex,
            border: selectedColor === c.id ? "2px solid #000" : "2px solid transparent",
          }}
          title={c.label}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </div>
  );
}
