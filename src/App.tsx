import { Route, Routes } from 'react-router-dom';
import List from './pages/List/List.tsx';
import Create from './pages/Create';

function App() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  );
}

export default App;
