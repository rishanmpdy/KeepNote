export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-400 p-4" onClick={onCancel}>
      <div className="bg-[#2d2e30] rounded-lg p-6 max-w-[380px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[#e8eaed] text-[15px] mb-5 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2.5">
          <button className="bg-transparent border border-[#5c5e61] text-[#e8eaed] rounded-md px-[18px] py-[7px] cursor-pointer text-sm hover:bg-[#3c3f43] transition-colors"
            onClick={onCancel}>Cancel</button>
          <button className="bg-[#c62828] border-none text-white rounded-md px-[18px] py-[7px] cursor-pointer text-sm hover:bg-[#b71c1c] transition-colors"
            onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
