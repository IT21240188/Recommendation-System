import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddBooks from './pages/AddBooks';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster/>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/AddBooks" element={<AddBooks />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
