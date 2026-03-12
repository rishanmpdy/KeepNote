import { useState, useRef, useEffect } from "react";
import { COLORS, formatDate } from "../constants";
import ColorPalette from "./ColorPalette";
import { renderRichText } from "./NoteForm";

export default function NoteCard({
  note, onEdit, onDelete, onColorChange,
  onPin, onArchive, selected, onSelect, viewMode,
}) {
  const bg = COLORS.find((c) => c.id === note.color)?.hex || "#ffffff";
  const [showPalette, setShowPalette] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowPalette(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actionBtn = "bg-transparent border-none cursor-pointer text-[#5f6368] w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-black/10 transition-colors";

  return (
    <div
      className={`note-card ${selected ? "note-card-selected" : ""} ${viewMode === "list" ? "flex flex-row items-start" : "block"} w-full rounded-lg border border-[#5f6368] relative cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:border-transparent`}
      style={{ backgroundColor: bg }}
      ref={ref}
      onClick={() => onEdit(note)}
    >
      {/* Selection checkbox */}
      <div
        className="note-checkbox absolute top-2 left-2 z-10"
        onClick={(e) => { e.stopPropagation(); onSelect(note.id); }}
        title="Select"
      >
        <div className={`w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${selected ? "bg-[#8ab4f8] border-[#8ab4f8]" : "border-[#9aa0a6]"}`}>
          {selected && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
      </div>

      {/* Pin badge */}
      {note.pinned && (
        <div className="absolute top-2 right-2 text-[#5f6368] opacity-60" title="Pinned">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
        </div>
      )}

      {/* Body wrapper for list mode */}
      <div className={viewMode === "list" ? "flex-1" : ""}>
        {note.title && (
          <div className="pt-3.5 pr-7 pb-0 pl-3.5 text-sm font-medium text-[#202124] leading-snug whitespace-pre-wrap break-words">
            {note.title}
          </div>
        )}

        <div className="py-2.5 px-3.5 pb-1 text-sm text-[#202124] leading-relaxed whitespace-pre-wrap break-words">
          {renderRichText(note.content)}
        </div>

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 px-3.5 py-1 pb-1.5" onClick={(e) => e.stopPropagation()}>
            {note.tags.map((t) => (
              <span key={t} className="bg-black/10 rounded-[10px] px-1.5 py-0.5 text-[11px] text-[#202124]">{t}</span>
            ))}
          </div>
        )}

        <div className="px-3.5 pb-1.5 text-[11px] text-[#80868b]">{formatDate(note.updatedAt)}</div>
      </div>

      {/* Action bar (visible on hover) */}
      <div className="note-actions flex items-center px-1.5 pb-1.5 pt-1 gap-0.5" onClick={(e) => e.stopPropagation()}>

        <button className={actionBtn} onClick={() => onEdit(note)} title="Edit">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>

        <button className={actionBtn} onClick={() => onPin(note.id)} title={note.pinned ? "Unpin" : "Pin"}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
        </button>

        <button className={actionBtn} onClick={() => onArchive(note.id)} title={note.archived ? "Unarchive" : "Archive"}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
          </svg>
        </button>

        <div className="relative">
          <button className={actionBtn} onClick={() => setShowPalette((v) => !v)} title="Color">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.26-.1-.51-.26-.7-.29-.34-.47-.79-.47-1.27 0-1.1.9-2 2-2h2.31C19.16 17.03 22 14.08 22 10.5 22 5.81 17.52 2 12 2zm-5.5 11c-.83 0-1.5-.67-1.5-1.5S5.67 10 6.5 10s1.5.67 1.5 1.5S7.33 13 6.5 13zm3-4C8.67 9 8 8.33 8 7.5S8.67 6 9.5 6s1.5.67 1.5 1.5S10.33 9 9.5 9zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 10 17.5 10s1.5.67 1.5 1.5S18.33 13 17.5 13z" />
            </svg>
          </button>
          {showPalette && (
            <ColorPalette
              selectedColor={note.color}
              onSelect={(colorId) => { onColorChange(note.id, colorId); setShowPalette(false); }}
              position="top"
            />
          )}
        </div>

        <button className={actionBtn} onClick={() => onDelete(note.id)} title="Delete">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

      </div>
    </div>
  );
}
