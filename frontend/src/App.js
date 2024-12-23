// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventManagement from './pages/EventManagement';
import AttendeeManagement from './pages/AttendeeManagement';
import TaskTracker from './pages/TaskTracker';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Router>
      {auth.isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={!auth.isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!auth.isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={auth.isAuthenticated ? <EventManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/attendees"
          element={auth.isAuthenticated ? <AttendeeManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks"
          element={auth.isAuthenticated ? <TaskTracker /> : <Navigate to="/login" />}
        />
        {/* Redirect any unknown routes to login or dashboard based on auth */}
        <Route
          path="*"
          element={auth.isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
