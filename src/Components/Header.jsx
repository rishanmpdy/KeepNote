export default function Header({ search, onSearch }) {
  return (
    <header className="h-16 bg-[#202124] border-b border-[#3c3f43] flex items-center px-4 gap-4 sticky top-0 z-[100]">
      <div className="flex items-center gap-2">
        <span className="text-[22px] font-normal text-[#e8eaed] tracking-tight" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          KeepNote
        </span>
      </div>

      <div className="flex-1 max-w-[720px] mx-auto bg-[#2d2e30] rounded-[24px] flex items-center px-4 h-11 gap-3 transition-colors focus-within:bg-[#3c3f43] focus-within:shadow-md">
        <svg className="text-[#9aa0a6] shrink-0" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20.49 19l-5.73-5.73A7 7 0 1 0 13 14.49L18.73 20.49 20.49 19zM5 10a5 5 0 1 1 5 5A5 5 0 0 1 5 10z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[#e8eaed] text-base placeholder-[#9aa0a6]"
        />
        {search && (
          <button className="bg-transparent border-none text-[#9aa0a6] cursor-pointer text-sm" onClick={() => onSearch("")}>✕</button>
        )}
      </div>
    </header>
  );
}