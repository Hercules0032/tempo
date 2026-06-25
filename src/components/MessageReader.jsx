import { useEffect } from 'react'
import { Close } from './Icons'

export default function MessageReader({ message, loading, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="glass fade-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">
              {loading ? 'Loading…' : message?.subject || '(no subject)'}
            </h3>
            {!loading && message && (
              <p className="mt-1 truncate text-sm text-white/50">
                From{' '}
                <span className="text-white/80">
                  {message.from?.name || message.from?.address}
                </span>{' '}
                &lt;{message.from?.address}&gt;
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-none rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Close width={20} height={20} />
          </button>
        </div>

        <div className="scroll-thin overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-3 w-full animate-pulse rounded bg-white/10" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-white/10" />
            </div>
          ) : message?.html?.length ? (
            <div
              className="mail-body"
              dangerouslySetInnerHTML={{ __html: message.html.join('') }}
            />
          ) : (
            <pre className="mail-body whitespace-pre-wrap font-sans">
              {message?.text || '(empty message)'}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
