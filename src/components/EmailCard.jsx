import { useState } from 'react'
import { Copy, Check, Refresh } from './Icons'

export default function EmailCard({ account, loading, onGenerate, onToast }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!account?.address) return
    try {
      await navigator.clipboard.writeText(account.address)
      setCopied(true)
      onToast?.('Address copied to clipboard ✦')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      onToast?.('Could not access clipboard')
    }
  }

  return (
    <div className="glass fade-in w-full rounded-3xl p-6 sm:p-8 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live inbox
        </span>
        <span className="text-xs text-white/40">Auto-refreshing every 8s</span>
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-widest text-white/40">
        Your temporary address
      </p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-h-[60px] flex-1 items-center rounded-2xl border border-white/10 bg-black/30 px-5 py-3">
          {loading ? (
            <span className="font-mono text-white/40">Spinning up a mailbox…</span>
          ) : (
            <span className="font-mono text-lg break-all text-white sm:text-xl">
              {account?.address || '—'}
            </span>
          )}
        </div>

        <button
          onClick={copy}
          disabled={loading || !account}
          className="glow-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-40"
        >
          {copied ? <Check width={18} height={18} /> : <Copy width={18} height={18} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          Use it anywhere a real email feels like too much commitment.
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
        >
          <Refresh width={16} height={16} className={loading ? 'spin' : ''} />
          New address
        </button>
      </div>
    </div>
  )
}
