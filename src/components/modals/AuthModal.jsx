import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode,     setMode]     = useState('signin')  // 'signin' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        onClose()
      } else {
        await signUp(email, password)
        setDone(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError(null)
    setDone(false)
  }

  return (
    <div
      className="auth-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="auth-modal" role="dialog" aria-modal="true">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="auth-logo">S<span>elah</span></div>
        <div className="auth-heading">
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </div>
        <div className="auth-sub">
          {mode === 'signin'
            ? 'Sign in to sync your notes and highlights.'
            : 'Your notes and highlights will sync across devices.'}
        </div>

        {done ? (
          <div className="auth-confirm">
            <div className="auth-confirm-icon">✦</div>
            <div className="auth-confirm-text">
              Check your email to confirm your account, then sign in.
            </div>
            <button className="auth-btn" onClick={() => { setMode('signin'); setDone(false) }}>
              Go to sign in
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                className="auth-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="auth-input"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading
                ? 'Please wait…'
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        )}

        {!done && (
          <div className="auth-switch">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button className="auth-switch-btn" onClick={switchMode}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
