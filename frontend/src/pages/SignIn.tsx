import React from "react";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/auth.css'

export default function SignIn() {
    const [loggedIn, changeLogIn] = useState(false);
    const [loginForm, UpdateForm] = useState({
      username: "",
      password: "",
    })
    const navigate = useNavigate();

    return (
       
            <div className='login'>
              <h1>Login</h1>
              <form className='login-form'>
                <input type='text' onChange={(e) => UpdateForm(old =>  old = {
                  ...old,
                  username: e.target.value,
                })} placeholder='Username' />
                <input type='password' onChange={(e) => UpdateForm(old => old = {
                  ...old,
                  password: e.target.value,
                })} placeholder='Password' />
              </form>
              <div className="button-wrapper">
                <button onClick={async () => {
                    // await changeLogIn(true);
                    await axios.post('http://localhost:3000/login', {
                      ...loginForm
                    })
                    .then(res => {
                          console.log(res)
                          navigate('/')
                          window.localStorage.setItem('user', JSON.stringify(res.data));
                      })
                    .catch(err => console.error(err));
                  }}>Login</button>
                <button onClick={() => navigate('/register')}>Reigster</button>
              </div>
            </div>
          
    )
}