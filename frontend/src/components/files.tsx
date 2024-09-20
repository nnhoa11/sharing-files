import React from "react";
import '../styles/files.css'
interface File {
    name : string,

}
export default function File(props: File) {
    return (
    <div className="files">
        <p>{props.name}</p>
        <button>download</button>
    </div>
    )
}