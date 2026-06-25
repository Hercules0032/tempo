import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createAccount,
  login,
  getMessages,
  getMessage,
  deleteMessage,
} from '../api/mailtm'

const STORAGE_KEY = 'tempo.account'
const POLL_MS = 8000

export function useTempMail() {
  const [account, setAccount] = useState(null) // { address, password, token }
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const tokenRef = useRef(null)

  const refresh = useCallback(async (token) => {
    const t = token || tokenRef.current
    if (!t) return
    setRefreshing(true)
    try {
      const list = await getMessages(t)
      setMessages(list)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Boot: restore saved account or mint a fresh one.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        let acct
        if (saved?.address && saved?.password) {
          const { token } = await login(saved.address, saved.password)
          acct = { ...saved, token }
        } else {
          acct = await createAccount()
        }
        if (cancelled) return
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ address: acct.address, password: acct.password })
        )
        tokenRef.current = acct.token
        setAccount(acct)
        await refresh(acct.token)
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  // Poll for new mail while we have a token.
  useEffect(() => {
    if (!account?.token) return
    const id = setInterval(() => refresh(), POLL_MS)
    return () => clearInterval(id)
  }, [account?.token, refresh])

  const generateNew = useCallback(async () => {
    setLoading(true)
    setMessages([])
    setError(null)
    try {
      const acct = await createAccount()
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ address: acct.address, password: acct.password })
      )
      tokenRef.current = acct.token
      setAccount(acct)
      await refresh(acct.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [refresh])

  const openMessage = useCallback((id) => getMessage(id, tokenRef.current), [])

  const removeMessage = useCallback(async (id) => {
    await deleteMessage(id, tokenRef.current)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return {
    account,
    messages,
    loading,
    refreshing,
    error,
    refresh: () => refresh(),
    generateNew,
    openMessage,
    removeMessage,
  }
}
