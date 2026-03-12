import { useState, useEffect, useCallback } from "react";
import "./index.css";
import { generateId } from "./constants";
import Header from "./Components/Header";
import CreateNote from "./Components/CreateNote";
import NoteCard from "./Components/NoteCard";
import EditNote from "./Components/EditNote";
import EmptyState from "./Components/EmptyState";
import Toolbar from "./Components/Toolbar";
import ConfirmDialog from "./Components/ConfirmDialog";

function sortNotes(notes, sortBy) {
  return [...notes].sort((a, b) => {
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "color") return (a.color || "").localeCompare(b.color || "");
    if (sortBy === "createdAt") return b.createdAt - a.createdAt;
    return b.updatedAt - a.updatedAt;
  });
}

export default function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("keep_notes_v2") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("keep_notes_v2", JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const [editingNote, setEditingNote] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [filterTag, setFilterTag] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(new Set());
  const [confirmIds, setConfirmIds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement.tagName;
      if (e.key === "n" && tag !== "INPUT" && tag !== "TEXTAREA")
        document.querySelector(".form-content-input")?.focus();
      if (e.key === "Escape") setSelected(new Set());
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selected.size > 0 &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA"
      )
        setConfirmIds([...selected]);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected]);

  const isDuplicate = useCallback(
    (title, content, excludeId = null) =>
      notes.some(
        (n) => n.id !== excludeId && n.title === title && n.content === content,
      ),
    [notes],
  );

  const addNote = ({ title, content, color, tags }) => {
    setNotes((prev) => [
      {
        id: generateId(),
        title,
        content,
        color,
        tags,
        pinned: false,
        archived: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const updateNote = ({ id, title, content, color, tags }) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, title, content, color, tags, updatedAt: Date.now() }
          : n,
      ),
    );
    setEditingNote(null);
  };

  const confirmDelete = (ids) => setConfirmIds(ids);

  const executeDelete = () => {
    setNotes((prev) => prev.filter((n) => !confirmIds.includes(n.id)));
    if (editingNote && confirmIds.includes(editingNote.id))
      setEditingNote(null);
    setSelected((prev) => {
      const next = new Set(prev);
      confirmIds.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmIds(null);
  };

  const changeColor = (id, color) =>
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, color, updatedAt: Date.now() } : n,
      ),
    );
  const togglePin = (id) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  const toggleArchive = (id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, archived: !n.archived, pinned: false } : n,
      ),
    );
    if (editingNote?.id === id) setEditingNote(null);
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const bulkDelete = () => confirmDelete([...selected]);
  const bulkArchive = () => {
    const ids = [...selected];
    setNotes((prev) =>
      prev.map((n) =>
        ids.includes(n.id)
          ? { ...n, archived: activeTab !== "archive", pinned: false }
          : n,
      ),
    );
    setSelected(new Set());
  };

  const visible = sortNotes(
    notes.filter((n) => {
      if (activeTab === "archive" ? !n.archived : n.archived) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !n.title?.toLowerCase().includes(q) &&
          !n.content.toLowerCase().includes(q)
        )
          return false;
      }
      if (filterTag && !n.tags?.includes(filterTag)) return false;
      if (filterColor && n.color !== filterColor) return false;
      return true;
    }),
    sortBy,
  );

  const pinned = visible.filter((n) => n.pinned);
  const unpinned = visible.filter((n) => !n.pinned);

  // Grid vs list class
  const gridClass =
    viewMode === "list"
      ? "flex flex-col gap-2 max-w-[720px] mx-auto"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-start";

  return (
    <div className="min-h-screen bg-[#202124]">
      <Header search={search} onSearch={setSearch} />

      <CreateNote onCreate={addNote} isDuplicate={isDuplicate} />

      <Toolbar
        search={search}
        onSearch={setSearch}
        sortBy={sortBy}
        onSort={setSortBy}
        filterTag={filterTag}
        onFilterTag={setFilterTag}
        filterColor={filterColor}
        onFilterColor={setFilterColor}
        view={viewMode}
        onViewChange={setViewMode}
        activeTab={activeTab}
        onTabChange={(t) => {
          setActiveTab(t);
          setSelected(new Set());
        }}
        selectedCount={selected.size}
        onBulkDelete={bulkDelete}
        onBulkArchive={bulkArchive}
      />

      {loading ? (
        /* Skeleton */
        <div
          className="max-w-[1200px] mx-auto mt-4 px-4 grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[120px] rounded-lg bg-[#2d2e30] shimmer"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          isArchive={activeTab === "archive"}
          isFiltered={!!(search || filterTag || filterColor)}
        />
      ) : (
        <>
          {pinned.length > 0 && (
            <section className="max-w-[1280px] mx-auto px-4 pb-4">
              <h2 className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-widest mb-2.5">
                Pinned
              </h2>
              <div className={gridClass}>
                {pinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={(id) => confirmDelete([id])}
                    onColorChange={changeColor}
                    onPin={togglePin}
                    onArchive={toggleArchive}
                    selected={selected.has(note.id)}
                    onSelect={toggleSelect}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          )}

          {unpinned.length > 0 && (
            <section className="max-w-[1280px] mx-auto px-4 pb-4">
              {pinned.length > 0 && (
                <h2 className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-widest mb-2.5">
                  Others
                </h2>
              )}
              <div className={gridClass}>
                {unpinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={(id) => confirmDelete([id])}
                    onColorChange={changeColor}
                    onPin={togglePin}
                    onArchive={toggleArchive}
                    selected={selected.has(note.id)}
                    onSelect={toggleSelect}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {editingNote && (
        <EditNote
          note={editingNote}
          onSave={updateNote}
          onClose={() => setEditingNote(null)}
          isDuplicate={isDuplicate}
        />
      )}

      {confirmIds && (
        <ConfirmDialog
          message={`Delete ${confirmIds.length} note${confirmIds.length > 1 ? "s" : ""}? This cannot be undone.`}
          onConfirm={executeDelete}
          onCancel={() => setConfirmIds(null)}
        />
      )}
    </div>
  );
}
