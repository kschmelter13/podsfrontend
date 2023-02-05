import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from "./lib/api";
import Header from './components/navbar';
import Podsdash from './components/podsdash';
import Auth from './components/login';
import { margin } from '@mui/system';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSes = async () => {
      const { data, error } = await supabase.auth.getSession()
      setUser(data.session.user)
    }
    getSes()
    const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ?? null);
        }
    );
  }, []);

  return (
    <div className='App'>
      <div >
        <Header></Header>
        <div style={{marginTop: 'calc(30px + 3.9vh)'}}>
          {!user ? <Auth /> : <Podsdash user={user} />}
        </div>
      </div>
    </div>
  );
}