import { useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useTempMail } from './hooks/useTempMail'
import { Bolt } from './components/Icons'
import EmailCard from './components/EmailCard'
import Inbox from './components/Inbox'
import MessageReader from './components/MessageReader'

const STACK = [
  'React 19',
  'Vite',
  'Tailwind CSS v4',
  'Bootstrap 5',
  'React-Bootstrap',
  'mail.tm API',
]

function App() {
  const {
    account,
    messages,
    loading,
    refreshing,
    error,
    refresh,
    generateNew,
    openMessage,
    removeMessage,
  } = useTempMail()

  const [active, setActive] = useState(null) // full message being read
  const [reading, setReading] = useState(false)
  const [toast, setToast] = useState('')

  const handleOpen = async (id) => {
    setReading(true)
    setActive({})
    try {
      const full = await openMessage(id)
      setActive(full)
    } catch (e) {
      setToast(e.message)
      setActive(null)
    } finally {
      setReading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="aurora" aria-hidden="true">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <Bolt width={18} height={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Tempo
            </span>
          </div>
          <a
            href="https://docs.mail.tm"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/50 transition-colors hover:text-white/80"
          >
            Powered by mail.tm
          </a>
        </header>

        {/* Hero */}
        <section className="mt-14 text-center sm:mt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            🔒 No sign-up · No spam · Disposable
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Disposable email,
            <br />
            <span className="grad-text">instantly.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55 sm:text-lg">
            Grab a throwaway inbox in one click. Sign up for anything, receive
            the email here, and walk away — your real address stays private.
          </p>
        </section>

        {/* Email + inbox */}
        <section className="mt-12">
          {error && (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
          <EmailCard
            account={account}
            loading={loading}
            onGenerate={generateNew}
            onToast={setToast}
          />
          <Inbox
            messages={messages}
            loading={loading}
            refreshing={refreshing}
            onRefresh={refresh}
            onOpen={handleOpen}
            onDelete={removeMessage}
          />
        </section>

        {/* Footer / tech stack */}
        <footer className="mt-auto pt-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
            Built with
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {STACK.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/30">
            Frontend-only demo · emails are public &amp; ephemeral — never use for
            anything sensitive.
          </p>
        </footer>
      </div>

      {active && (
        <MessageReader
          message={active}
          loading={reading}
          onClose={() => setActive(null)}
        />
      )}

      <ToastContainer position="bottom-center" className="mb-4 px-3">
        <Toast
          show={!!toast}
          onClose={() => setToast('')}
          delay={2200}
          autohide
          className="border-0"
        >
          <Toast.Body className="rounded-xl bg-neutral-900 px-4 py-2.5 font-medium text-white shadow-lg">
            {toast}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default App
