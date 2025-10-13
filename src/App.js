import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Board from './pages/Board';
import BoardDetail from './pages/BoardDetail';
import BoardWrite from './pages/BoardWrite';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App">  
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/board' element={<Board />} />
          <Route path='/board/:id' element={<BoardDetail />} />
          <Route path='/board/write' element={<BoardWrite />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
    </div>
  );
}

export default App;
