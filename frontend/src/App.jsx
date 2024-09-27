import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBooks from './pages/AddBooks';
import { Toaster } from 'react-hot-toast';
import UserRegisterPage from './pages/UserRegisterPage';
import UserLoginPage from './pages/UserLoginPage';

function App() {
  return (
    <>
      <div>
        <Toaster/>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<UserRegisterPage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/AddBooks" element={<AddBooks />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
