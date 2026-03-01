import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Reader      from './pages/Reader.jsx'
import Maps        from './pages/Maps.jsx'
import Commentary  from './pages/Commentary.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Reader />} />
          <Route path="/maps"        element={<Maps />} />
          <Route path="/commentary" element={<Commentary />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
