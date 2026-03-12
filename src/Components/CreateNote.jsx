import NoteForm from "./NoteForm";

// Thin wrapper: renders NoteForm in inline (non-modal) mode
export default function CreateNote({ onCreate, isDuplicate }) {
  return (
    <div className="max-w-[600px] mx-auto mt-3 mb-1 px-4">
      <NoteForm
        onSubmit={onCreate}
        isDuplicate={isDuplicate}
        isModal={false}
      />
    </div>
  );
}
