interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-[#FAFAF9] dark:bg-[#1C1917] border border-black/20 dark:border-white/20 px-8 py-8 max-w-sm w-full mx-4">
        <p className="text-sm text-[#1C1917] dark:text-[#FAFAF9] mb-8">{message}</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="text-sm text-[#1C1917]/60 dark:text-[#FAFAF9]/60 hover:text-[#1C1917] dark:hover:text-[#FAFAF9]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
