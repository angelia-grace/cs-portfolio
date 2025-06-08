import './App.css';
import Navigation from './components/Navigation';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateExercise from './pages/CreateExercise'
import HomePage from './pages/HomePage'
import EditExercise from './pages/EditExercise'

function App() {
  return (
    <div className="App">
        <Router>
            <Navigation />
                <Routes>
                  <Route path="/" element={<HomePage />}></Route>
                  <Route path="/create" element={<CreateExercise />}></Route>
                  <Route path="/edit" element={<EditExercise />}></Route>
                </Routes>
        </Router>
    </div>
  );
}

export default App;
