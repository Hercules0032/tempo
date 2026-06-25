import { Inbox as InboxIcon, Refresh, Mail, Trash } from './Icons'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Avatar({ name }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase()
  return (
    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-violet-500/80 to-indigo-500/80 font-semibold text-white">
      {letter}
    </div>
  )
}

export default function Inbox({
  messages,
  loading,
  refreshing,
  onRefresh,
  onOpen,
  onDelete,
}) {
  return (
    <div className="glass fade-in mt-6 w-full overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <InboxIcon width={20} height={20} className="text-violet-300" />
          <h2 className="text-base font-semibold text-white">Inbox</h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/70">
            {messages.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10"
        >
          <Refresh width={16} height={16} className={refreshing ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="scroll-thin max-h-[420px] overflow-y-auto">
        {loading ? (
          <ListSkeleton />
        ) : messages.length === 0 ? (
          <Empty />
        ) : (
          <ul className="divide-y divide-white/5">
            {messages.map((m) => (
              <li
                key={m.id}
                onClick={() => onOpen(m.id)}
                className="group flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5"
              >
                <Avatar name={m.from?.name || m.from?.address} />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium text-white">
                      {m.from?.name || m.from?.address}
                    </p>
                    <span className="flex-none text-xs text-white/40">
                      {timeAgo(m.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium text-white/80">
                    {m.subject || '(no subject)'}
                  </p>
                  <p className="truncate text-sm text-white/45">{m.intro}</p>
                </div>
                {!m.seen && (
                  <span className="h-2 w-2 flex-none rounded-full bg-violet-400" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(m.id)
                  }}
                  className="flex-none rounded-lg p-2 text-white/30 opacity-0 transition-all hover:bg-rose-500/15 hover:text-rose-300 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Mail width={28} height={28} className="text-white/40" />
      </div>
      <p className="mt-5 font-medium text-white/80">Waiting for emails…</p>
      <p className="mt-1 max-w-xs text-sm text-white/45">
        Send a message to your address above. New mail lands here automatically.
      </p>
    </div>
  )
}

function ListSkeleton() {
  return (
    <ul className="divide-y divide-white/5">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-4 px-6 py-4">
          <div className="h-11 w-11 flex-none animate-pulse rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        </li>
      ))}
    </ul>
  )
}
