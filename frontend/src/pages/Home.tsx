import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/home.css';
import axios from "axios";
import File from "../components/files";
import { replace } from "react-router-dom";

interface File {
    owner: string,
    fileName: string,
}
export default function Home() {
    const [user, getUser] = useState();
    const [files, getFiles] = useState([]);
    const [uploadFile, getUploadFile] = useState([])
    const navigate = useNavigate();
    const fileForm = new FormData()
    useEffect(() => {
        let user = window.localStorage.getItem('user')
        if (user !== null) { 
            replace('http://localhost:3001/login')
           const newUser = JSON.parse(user)
           getUser(newUser)
           axios.get('http://localhost:3000/files/get-all', {
            params: {
                userId: newUser.userId
            }
           })
           .then(res => {
                console.log(res.data)
                getFiles(res.data.files)
            })
           .catch(err => console.error(err));
        }
        else navigate('/login')
    }, [])
    useEffect(() => {
        console.log(uploadFile)
    }, [uploadFile])
    return (
        <div className="home">
            <form encType="multipart/form-data" className="upload-section">
                <input onChange={async (e: any) => {
                    await getUploadFile(old => old = e.target.files)
                }} type="file" multiple></input>
                <button onClick={async () => {
                    await axios.post('http://localhost:3000/files/upload', {
                        
                    })
                }}>Upload</button>
            </form>
            {files.map((file: File) => <File name={file.fileName}/>)}
        </div>
    )
}