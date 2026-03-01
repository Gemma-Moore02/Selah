import { useState } from 'react'
import Topbar    from '@/components/topbar/Topbar'
import Sidebar   from '@/components/sidebar/Sidebar'
import BibleText from '@/components/reader/BibleText'

export default function Reader() {
  const [book,        setBook]        = useState('John')
  const [chapter,     setChapter]     = useState(4)
  // Open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)

  function handleBookChange(newBook) {
    setBook(newBook)
    setChapter(1)
  }

  function handleChapterChange(newChapter) {
    setChapter(newChapter)
  }

  function handleNavigate(newBook, newChapter) {
    setBook(newBook)
    setChapter(newChapter)
  }

  return (
    <>
      <Topbar
        book={book}
        chapter={chapter}
        onBookChange={handleBookChange}
        onChapterChange={handleChapterChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      <div className={`shell${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <Sidebar
          book={book}
          chapter={chapter}
          isOpen={sidebarOpen}
          onBookChange={handleBookChange}
          onChapterChange={handleChapterChange}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="main-content">
          <div className="reader-wrap">
            <BibleText
              book={book}
              chapter={chapter}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>
    </>
  )
}
