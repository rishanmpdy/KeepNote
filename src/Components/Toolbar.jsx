import { TAGS, COLORS, SORT_OPTIONS } from "../constants";

export default function Toolbar({
  search, onSearch, sortBy, onSort,
  filterTag, onFilterTag, filterColor, onFilterColor,
  view, onViewChange, activeTab, onTabChange,
  selectedCount, onBulkDelete, onBulkArchive,
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-3">

      {/* Row 1: tabs + search + view toggle */}
      <div className="flex items-center gap-2.5 flex-wrap mb-2.5">

        {/* Tabs */}
        <div className="flex bg-[#2d2e30] rounded-[20px] p-[3px] gap-0.5 shrink-0">
          {["notes", "archive"].map((tab) => (
            <button key={tab}
              className={`bg-transparent border-none cursor-pointer px-3.5 py-[5px] rounded-2xl text-[13px] transition-all capitalize
                ${activeTab === tab ? "bg-[#3c3f43] text-[#e8eaed]" : "text-[#9aa0a6]"}`}
              onClick={() => onTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[160px] bg-[#2d2e30] rounded-[24px] flex items-center px-3.5 h-[38px] gap-2 transition-colors focus-within:bg-[#3c3f43]">
          <svg className="text-[#9aa0a6]" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20.49 19l-5.73-5.73A7 7 0 1 0 13 14.49L18.73 20.49 20.49 19zM5 10a5 5 0 1 1 5 5A5 5 0 0 1 5 10z" />
          </svg>
          <input
            type="text" placeholder="Search notes…" value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#e8eaed] text-sm placeholder-[#9aa0a6]"
          />
          {search && (
            <button className="bg-transparent border-none text-[#9aa0a6] cursor-pointer text-sm" onClick={() => onSearch("")}>✕</button>
          )}
        </div>

        {/* Grid / List toggle */}
        <div className="flex bg-[#2d2e30] rounded-lg overflow-hidden shrink-0">
          {[
            { mode: "grid", icon: <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" /> },
            { mode: "list", icon: <path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" /> },
          ].map(({ mode, icon }) => (
            <button key={mode}
              className={`bg-transparent border-none cursor-pointer p-[7px_10px] flex transition-all
                ${view === mode ? "bg-[#3c3f43] text-[#e8eaed]" : "text-[#9aa0a6]"}`}
              onClick={() => onViewChange(mode)} title={`${mode} view`}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">{icon}</svg>
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: sort + tag chips + color dots */}
      <div className="flex items-center gap-2 flex-wrap mb-3">

        {/* Sort */}
        <select
          className="bg-[#2d2e30] border-none text-[#9aa0a6] rounded-lg px-2.5 py-[5px] text-[13px] cursor-pointer outline-none shrink-0 focus:bg-[#3c3f43]"
          value={sortBy} onChange={(e) => onSort(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Tag chips */}
        <div className="flex gap-1.5 flex-wrap">
          {TAGS.map((tag) => (
            <button key={tag}
              className={`border rounded-2xl text-xs px-2.5 py-[3px] cursor-pointer transition-all whitespace-nowrap
                ${filterTag === tag
                  ? "bg-[#444746] text-[#e8eaed] border-[#8ab4f8]"
                  : "bg-[#2d2e30] text-[#9aa0a6] border-[#3c3f43] hover:bg-[#3c3f43] hover:text-[#e8eaed]"}`}
              onClick={() => onFilterTag(filterTag === tag ? "" : tag)}
            >{tag}</button>
          ))}
        </div>

        {/* Color dots */}
        <div className="flex gap-[5px] items-center shrink-0">
          {COLORS.filter((c) => c.id !== "default").map((c) => (
            <button key={c.id}
              className="w-[22px] h-[22px] rounded-full border-2 border-transparent cursor-pointer hover:scale-125 transition-transform"
              style={{
                backgroundColor: c.hex,
                outline: filterColor === c.id ? "2px solid #fff" : "none",
                outlineOffset: "2px",
              }}
              title={c.label}
              onClick={() => onFilterColor(filterColor === c.id ? "" : c.id)}
            />
          ))}
        </div>

        {/* Clear filters */}
        {(filterTag || filterColor || search) && (
          <button
            className="bg-transparent border border-[#5c5e61] rounded-lg text-[#9aa0a6] text-xs px-2.5 py-1 cursor-pointer whitespace-nowrap hover:bg-[#3c3f43] hover:text-[#e8eaed] transition-all"
            onClick={() => { onFilterTag(""); onFilterColor(""); onSearch(""); }}
          >Clear filters</button>
        )}
      </div>

      {/* Row 3: bulk bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2.5 bg-[#35363a] rounded-lg px-3.5 py-2 mb-2.5">
          <span className="text-[#e8eaed] text-sm flex-1">{selectedCount} selected</span>
          <button className="border-none cursor-pointer rounded-md px-3.5 py-1.5 text-[13px] bg-[#444746] text-[#e8eaed] hover:opacity-85 transition-opacity"
            onClick={onBulkArchive}>{activeTab === "archive" ? "Unarchive" : "Archive"}</button>
          <button className="border-none cursor-pointer rounded-md px-3.5 py-1.5 text-[13px] bg-[#8b2626] text-white hover:opacity-85 transition-opacity"
            onClick={onBulkDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
