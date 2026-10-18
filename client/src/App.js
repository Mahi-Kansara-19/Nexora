import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Pages/auth/Auth';
import Home from './Pages/home/Home';
import Profile from './Pages/profile/Profile';

function App() {
  const user = useSelector((state) => state.authReducer.authData);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="/auth" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/auth"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
