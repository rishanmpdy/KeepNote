export default function EmptyState({ isArchive, isFiltered }) {
  const icon = isArchive ? "" : isFiltered ? "" : "";
  const text = isArchive
    ? "No archived notes"
    : isFiltered
    ? "No notes match your filters"
    : "Notes you add appear here";

  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <div className="text-6xl mb-4 opacity-40">{icon}</div>
      <p className="text-[22px] text-[#5f6368]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{text}</p>
    </div>
  );
}
