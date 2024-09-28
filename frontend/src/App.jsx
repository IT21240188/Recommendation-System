import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBooks from './pages/AddBooks';
import { Toaster } from 'react-hot-toast';
import PublicRoutes from './components/PrivateRoutes/PublicRoutes';
import UserPrivateRoute from './components/PrivateRoutes/UserPrivateRoute';
import UserRegisterPage from './pages/UserRegisterPage';
import UserLoginPage from './pages/UserLoginPage';
import BookCard from './components/BookCard';
import BookView from './pages/BookView';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <>
      <div>
        <Toaster />
        <Router>
          <Routes>
            {/*Public Routes*/}
            <Route path="" element={<PublicRoutes />}>
              <Route path="/register" element={<UserRegisterPage />} />
              <Route path="/login" element={<UserLoginPage />} />
            </Route>


            {/*User Routes*/}
            <Route path="" element={<UserPrivateRoute />}>
              <Route path="/" index={true} element={<HomePage />} />
              <Route path="/AddBooks" element={<AddBooks />} />
              <Route path="/BookView/:id" element={<BookView />} />
              <Route path="/myprofile" element={<MyProfile />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
