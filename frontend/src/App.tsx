import React from 'react';
import './styles/App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Projects from './pages/Projects';
function App() {
 
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn/>} />
        <Route path='/register' element={<SignUp/>} />
        <Route path='/project/:projectId' element={<Projects />} />
      </Routes>
      
    </div>
  );
}

export default App;
