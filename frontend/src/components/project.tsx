import React from "react";
import '../styles/projects.css'
import type { Project } from "../utils/types"
import { useNavigate } from "react-router-dom";
export default function ProjectComponent(props: Project) {
    const navigate = useNavigate()
    return (
    <div className="project">
        <p>Project name: {props.name}</p>
        <p>Description: {props.description}</p>
        <p>Price: {props.price.toString()}</p>
        <button onClick={() => navigate(`/project/${props._id}`)}>View</button>
    </div>
    )
}