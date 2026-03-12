export const COLORS = [
  { id: "default", hex: "#ffffff",  label: "Default"  },
  { id: "red",     hex: "#f28b82",  label: "Tomato"   },
  { id: "orange",  hex: "#fbbc04",  label: "Flamingo" },
  { id: "yellow",  hex: "#fff475",  label: "Banana"   },
  { id: "green",   hex: "#ccff90",  label: "Sage"     },
  { id: "teal",    hex: "#a8dadc",  label: "Teal"     },
  { id: "blue",    hex: "#aecbfa",  label: "Peacock"  },
  { id: "purple",  hex: "#d7aefb",  label: "Lavender" },
  { id: "pink",    hex: "#fdcfe8",  label: "Pink"     },
  { id: "brown",   hex: "#e6c9a8",  label: "Sand"     },
];

export const TAGS = [
  "Work", "Personal", "Ideas", "Todo",
  "Important", "Learning", "Shopping", "Health",
];

export const SORT_OPTIONS = [
  { value: "updatedAt", label: "Last edited"  },
  { value: "createdAt", label: "Date created" },
  { value: "title",     label: "Title A–Z"    },
  { value: "color",     label: "Color"         },
];

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(ts) {
  if (!ts) return "";
  const d   = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60_000)      return "Just now";
  if (diff < 3_600_000)   return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000)  return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
