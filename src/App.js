import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/navbar';
import Podsdash from './components/podsdash';
import Signup from './components/signup';
import Login from './components/login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const response = await postData('/auth/check');
  //     setIsAuthenticated(response.authenticated);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const handleLogout = () => {
  //   //make a request to the backend to logout the user
  //   setIsAuthenticated(false);
  // }

  return (
    
    <div className="App">
      <Router>
        <div className='container'>
          <Header></Header>
          <Routes>
            <Route path='/' element={<Podsdash/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

