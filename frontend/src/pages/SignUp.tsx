import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/auth.css'

export default function SignUp(){
    const [userInfo, UpdateForm] = useState({
        username: "",
        password: ""
    })
    
    const navigate = useNavigate();
    return (
        <div className='login'>
          <h1>Sign Up</h1>
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
            <button onClick={() => {
                axios.post('http://localhost:3000/register', {
                ...userInfo
                })
            .then(res => {
                console.log(res)
                navigate('/login')
            })
            .catch(err => console.error(err));
            }}>Sign Up</button>
            <button onClick={() => navigate('/login')}>Sign In</button>
        </div>
        </div>
    )
}