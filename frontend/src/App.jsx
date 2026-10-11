import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Sec1Catalouge from './components/Sec1Catalouge';



function App() {
    return(
        <div className='app-container'>
            <h1>Library Management System</h1>
             <NavBar />
             <Hero />
             <Sec1Catalouge />
        </div>
       
    )
    
}

export default App;