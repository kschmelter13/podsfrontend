import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/navbar';
import Podsdash from './components/podsdash';
import Login from './components/login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    
    <div className="App">
      <Router>
        <div>
          <Header></Header>
          <Routes>
            <Route path='/' element={<Podsdash/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

