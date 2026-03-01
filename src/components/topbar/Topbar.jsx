import { useState, useRef, useEffect } from 'react'
import { PanelLeft, Search, Bookmark, User } from 'lucide-react'
import NavSelects       from './NavSelects'
import TranslationBadge from './TranslationBadge'
import AuthModal        from '@/components/modals/AuthModal'
import { useAuth }      from '@/hooks/useAuth'

export default function Topbar({
  book,
  chapter,
  onBookChange,
  onChapterChange,
  sidebarOpen,
  onToggleSidebar,
}) {
  const { user, initials, signOut } = useAuth()
  const [authOpen,     setAuthOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [dropdownOpen])

  function handleAvatarClick() {
    if (user) {
      setDropdownOpen(d => !d)
    } else {
      setAuthOpen(true)
    }
  }

  async function handleSignOut() {
    setDropdownOpen(false)
    await signOut()
  }

  return (
    <>
      <header className={`topbar${sidebarOpen ? '' : ' sidebar-collapsed'}`}>

        {/* Left — toggle + logo */}
        <div className="tb-left">
          <button
            className="toggle-btn"
            type="button"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={onToggleSidebar}
          >
            <PanelLeft size={16} strokeWidth={1.5} />
          </button>
          <div className="logo">
            S<span>elah</span>
          </div>
        </div>

        {/* Center — navigation selects */}
        <div className="tb-center">
          <NavSelects
            book={book}
            chapter={chapter}
            onBookChange={onBookChange}
            onChapterChange={onChapterChange}
          />
          <div className="sel-div" />
          <TranslationBadge translation="KJV" />
        </div>

        {/* Right — icon stubs + avatar */}
        <div className="tb-right">
          <button className="icon-btn" type="button" aria-label="Search">
            <Search size={16} strokeWidth={1.5} />
          </button>
          <button className="icon-btn" type="button" aria-label="Bookmarks">
            <Bookmark size={16} strokeWidth={1.5} />
          </button>

          <div className="avatar-wrap" ref={dropdownRef}>
            <button
              className="avatar"
              type="button"
              aria-label={user ? 'Account' : 'Sign in'}
              onClick={handleAvatarClick}
            >
              {user
                ? (initials ?? <User size={14} strokeWidth={1.5} />)
                : <User size={14} strokeWidth={1.5} />}
            </button>

            {dropdownOpen && user && (
              <div className="avatar-dropdown">
                <div className="avatar-email">{user.email}</div>
                <div className="avatar-rule" />
                <button className="avatar-signout" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
