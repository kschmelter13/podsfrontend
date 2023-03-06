import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from "./lib/api";
import Header from './components/navbar';
import Podsdash from './components/podsdash';
import Auth from './components/login';


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSes = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      setUser(data.session.user);
      localStorage.setItem('user', JSON.stringify(data.session.user));
    };

    getSes();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('user');
        }
      }
    );
    setLoading(false)
  }, []);



  return (
    <div className='App'>
      <div >
        <Header></Header>
        <div style={{marginTop: 'calc(30px + 3.9vh)'}}>
          <div >
            {!user ? <Auth /> : <Podsdash loading={loading} setLoading={setLoading} user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}