import { Routes, Route } from 'react-router-dom';
import UpdatePrices from './pages/UpdatePrices';
import '../src/styles/App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <UpdatePrices /> } />
    </Routes>
  )
}

export default App
