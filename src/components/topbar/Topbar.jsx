import { PanelLeft, Search, Bookmark } from 'lucide-react'
import NavSelects       from './NavSelects'
import TranslationBadge from './TranslationBadge'

export default function Topbar({
  book,
  chapter,
  onBookChange,
  onChapterChange,
  sidebarOpen,
  onToggleSidebar,
}) {
  return (
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

      {/* Right — icon stubs */}
      <div className="tb-right">
        <button className="icon-btn" type="button" aria-label="Search">
          <Search size={16} strokeWidth={1.5} />
        </button>
        <button className="icon-btn" type="button" aria-label="Bookmarks">
          <Bookmark size={16} strokeWidth={1.5} />
        </button>
        <div className="avatar">GR</div>
      </div>

    </header>
  )
}
