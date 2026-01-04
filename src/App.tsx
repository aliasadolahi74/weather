import { Routes, Route } from 'react-router-dom'
import List from './pages/List'
import Detail from './pages/Detail'
import Create from './pages/Create'
import Edit from './pages/Edit'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/create" element={<Create />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
  )
}

export default App
