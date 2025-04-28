import { AlertTriangle } from "lucide-react"

interface UIAlertProps {
  active: boolean
  message: string
  onClose?: () => void
}

export default function UIAlert({ active, message, onClose }: UIAlertProps) {
  if (!active) return null

  return (
    <div className="animate-in fade-in slide-in-from-top-5 duration-300 w-full max-w-3xl mx-auto mt-4">
      <div className="flex items-center gap-3 p-4 bg-amber-200 bg-opacity-90 border border-amber-200 rounded-lg shadow-sm">
        <div className="shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-amber-800 font-medium flex-1">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1 hover:bg-amber-100 transition-colors"
            aria-label="Close alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-amber-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
