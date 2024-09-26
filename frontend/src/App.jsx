import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBooks from './pages/AddBooks';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/NavBar';
import UserRegisterPage from './pages/UserRegisterPage';

function App() {
  return (
    <>
      <div>
        <Toaster/>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<UserRegisterPage />} />
            <Route path="/AddBooks" element={<AddBooks />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
