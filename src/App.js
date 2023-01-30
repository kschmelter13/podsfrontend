import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from "./lib/api";
import Header from './components/navbar';
import Podsdash from './components/podsdash';
import Login from './components/login';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const session = supabase.auth.getSession();
      setUser(session?.user ?? null);
      

      const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
              const currentUser = session?.user;
              setUser(currentUser ?? null);
          }
      );
      return () => {
        authListener?.offAuthStateChange();
      };

  }, [user]);

  function handleUser(user) {
      setUser(user)
  }

  return (
    
    <div className="App">
      <Router>
        <div>
          <Header></Header>
          <Routes>
            {!user ? <Route path='/login' element={<Login />} />: <Route path='/' element={<Podsdash />} />}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

