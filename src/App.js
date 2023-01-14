import './App.css';
import React from 'react'
import Navigation from './components/navbar'
import Podsdash from './components/podsdash';

function App() {
  return (
    <div className="App">
      <Navigation></Navigation>
      <Podsdash></Podsdash>
      
    </div>
  );
}

export default App;
