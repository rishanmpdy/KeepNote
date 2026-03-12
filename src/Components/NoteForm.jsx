import { useState, useRef, useEffect } from "react";
import { COLORS, TAGS, formatDate } from "../constants";
import ColorPalette from "./ColorPalette";

//  helpers 
function applyFormat(textarea, type) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e) || (type === "list" ? "item" : "text");
  const before   = value.slice(0, s);
  const after    = value.slice(e);
  let inserted = selected;
  if (type === "bold")   inserted = `**${selected}**`;
  if (type === "italic") inserted = `_${selected}_`;
  if (type === "list")   inserted = selected.split("\n").map((l) => `• ${l}`).join("\n");
  return { newValue: before + inserted + after, cursorAt: s + inserted.length };
}

export function renderRichText(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (line.startsWith("• ")) {
      return <div key={i} className="rt-list-item">{parseLine(line.slice(2))}</div>;
    }
    return <div key={i}>{parseLine(line)}</div>;
  });
}

function parseLine(text) {
  const parts = [];
  const re = /(\*\*(.+?)\*\*|_(.+?)_)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[0].startsWith("**")) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else                        parts.push(<em key={m.index}>{m[3]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : "\u00A0";
}

//  component 
export default function NoteForm({
  initialData = {},
  onSubmit,
  onCancel,
  isDuplicate,
  isModal = false,
}) {
  const [title,       setTitle]       = useState(initialData.title   || "");
  const [content,     setContent]     = useState(initialData.content || "");
  const [color,       setColor]       = useState(initialData.color   || "default");
  const [tags,        setTags]        = useState(initialData.tags    || []);
  const [showPalette, setShowPalette] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [error,       setError]       = useState("");
  const [expanded,    setExpanded]    = useState(isModal);

  const contentRef = useRef(null);
  const boxRef     = useRef(null);

  useEffect(() => {
    if (isModal) contentRef.current?.focus();
  }, [isModal]);

  useEffect(() => {
    if (isModal) return;
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) handleSubmit();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  function handleFormat(type) {
    const ta = contentRef.current;
    if (!ta) return;
    const { newValue, cursorAt } = applyFormat(ta, type);
    setContent(newValue);
    setError("");
    setTimeout(() => { ta.focus(); ta.setSelectionRange(cursorAt, cursorAt); }, 0);
  }

  function toggleTag(tag) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function handleSubmit() {
    const trimContent = content.trim();
    const trimTitle   = title.trim();
    if (!trimContent) {
      if (!isModal) { reset(); return; }
      setError("Content cannot be empty.");
      return;
    }
    if (trimTitle.length > 100) { setError("Title must be 100 characters or less."); return; }
    if (content.length > 5000)  { setError("Content must be 5 000 characters or less."); return; }
    if (isDuplicate && isDuplicate(trimTitle, trimContent)) {
      setError("A note with this title and content already exists.");
      return;
    }
    onSubmit({ title: trimTitle, content: trimContent, color, tags });
    if (!isModal) reset();
  }

  function reset() {
    setTitle(""); setContent(""); setColor("default");
    setTags([]); setExpanded(false); setError("");
    setShowPalette(false); setShowTagMenu(false);
  }

  const bg = COLORS.find((c) => c.id === color)?.hex || "#ffffff";

  // Shared input/action styles
  const actionBtn = "bg-transparent border-none cursor-pointer text-[#5f6368] w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-black/10 transition-colors";

  return (
    <div
      className={isModal
        ? "w-full max-w-[560px] rounded-lg shadow-2xl"
        : "rounded-lg cursor-text shadow-md focus-within:shadow-xl transition-shadow"}
      style={{ backgroundColor: bg }}
      ref={boxRef}
      onClick={!isModal ? () => setExpanded(true) : undefined}
    >
      {/* Title */}
      {(isModal || expanded) && (
        <input
          className="w-full border-none outline-none bg-transparent pt-3.5 px-4 pb-1.5 text-base font-medium text-[#202124] placeholder-[#80868b]"
          placeholder="Title"
          value={title}
          maxLength={100}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
        />
      )}

      {/* Rich text toolbar */}
      {(isModal || expanded) && (
        <div className="flex items-center gap-0.5 px-2.5 py-0.5 border-b border-black/[0.08]">
          <button className={actionBtn} onClick={() => handleFormat("bold")}   title="Bold"><b>B</b></button>
          <button className={actionBtn} onClick={() => handleFormat("italic")} title="Italic"><i>I</i></button>
          <button className={actionBtn} onClick={() => handleFormat("list")}   title="List">≡</button>
        </div>
      )}

      {/* Content textarea */}
      <textarea
        ref={contentRef}
        className="w-full border-none outline-none resize-none bg-transparent px-4 py-2.5 text-sm text-[#202124] placeholder-[#80868b] leading-[1.7]"
        placeholder="Take a note…"
        value={content}
        rows={expanded || isModal ? 4 : 1}
        maxLength={5000}
        onChange={(e) => { setContent(e.target.value); setError(""); }}
        onFocus={() => setExpanded(true)}
      />

      {/* Character count */}
      {(isModal || expanded) && (
        <div className="text-right px-4 pb-1 text-[11px] text-[#9aa0a6]">{content.length} / 5000</div>
      )}

      {/* Tags row */}
      {(isModal || expanded) && (
        <div className="flex flex-wrap gap-1.5 px-3.5 pt-1 pb-2 items-center">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-black/10 rounded-xl px-2 py-0.5 text-xs text-[#202124]">
              {t}
              <button onClick={() => toggleTag(t)} className="bg-none border-none cursor-pointer text-[#5f6368] text-sm leading-none p-0">×</button>
            </span>
          ))}
          <div className="relative">
            <button
              className="bg-transparent border border-dashed border-black/25 rounded-xl px-2 py-0.5 text-xs text-[#5f6368] cursor-pointer hover:bg-black/[0.08] transition-colors"
              onClick={() => setShowTagMenu((v) => !v)}
            >+ Tag</button>
            {showTagMenu && (
              <div className="absolute top-7 left-0 bg-white rounded-lg shadow-lg py-1.5 z-[300] min-w-[130px]">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    className={`block w-full text-left bg-none border-none px-3.5 py-[7px] text-[13px] text-[#202124] cursor-pointer hover:bg-[#f1f3f4] transition-colors ${tags.includes(t) ? "text-[#1a73e8]" : ""}`}
                    onClick={() => toggleTag(t)}
                  >
                    {tags.includes(t) ? "✓ " : "+ "}{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps (edit modal only) */}
      {isModal && initialData.createdAt && (
        <div className="px-4 pb-1 text-[11px] text-[#9aa0a6]">
          <span>Created {formatDate(initialData.createdAt)}</span>
          {initialData.updatedAt !== initialData.createdAt && (
            <span> · Edited {formatDate(initialData.updatedAt)}</span>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="px-4 pb-2 text-xs text-[#f28b82]">{error}</p>}

      {/* Footer */}
      {(isModal || expanded) && (
        <div className="flex items-center px-2 pb-2.5 pt-1 gap-1">
          {/* Color picker */}
          <div className="relative">
            <button className={actionBtn} onClick={() => setShowPalette((v) => !v)} title="Color">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.26-.1-.51-.26-.7-.29-.34-.47-.79-.47-1.27 0-1.1.9-2 2-2h2.31C19.16 17.03 22 14.08 22 10.5 22 5.81 17.52 2 12 2zm-5.5 11c-.83 0-1.5-.67-1.5-1.5S5.67 10 6.5 10s1.5.67 1.5 1.5S7.33 13 6.5 13zm3-4C8.67 9 8 8.33 8 7.5S8.67 6 9.5 6s1.5.67 1.5 1.5S10.33 9 9.5 9zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 10 17.5 10s1.5.67 1.5 1.5S18.33 13 17.5 13z" />
              </svg>
            </button>
            {showPalette && (
              <ColorPalette
                selectedColor={color}
                onSelect={(id) => { setColor(id); setShowPalette(false); }}
                position={isModal ? "top" : "bottom"}
              />
            )}
          </div>

          {/* Cancel (modal only) */}
          {isModal && onCancel && (
            <button className="ml-auto bg-transparent border-none cursor-pointer text-sm font-medium text-[#202124] px-3.5 py-1.5 rounded hover:bg-black/[0.08] transition-colors"
              onClick={onCancel}>Cancel</button>
          )}

          {/* Save / Close */}
          <button
            className={`${isModal ? "" : "ml-auto"} bg-transparent border-none cursor-pointer text-sm font-medium text-[#202124] px-3.5 py-1.5 rounded hover:bg-black/[0.08] transition-colors`}
            onClick={handleSubmit}
          >
            {isModal ? "Save" : "Close"}
          </button>
        </div>
      )}
    </div>
  );
}
