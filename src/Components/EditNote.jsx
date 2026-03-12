import NoteForm from "./NoteForm";

// Modal wrapper for editing an existing note
export default function EditNote({ note, onSave, onClose, isDuplicate }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[300]" onClick={onClose}>
      <div className="w-full max-w-[560px]" onClick={(e) => e.stopPropagation()}>
        <NoteForm
          initialData={note}
          onSubmit={(data) => onSave({ ...data, id: note.id })}
          onCancel={onClose}
          isDuplicate={(title, content) =>
            isDuplicate && isDuplicate(title, content, note.id)
          }
          isModal={true}
        />
      </div>
    </div>
  );
}
