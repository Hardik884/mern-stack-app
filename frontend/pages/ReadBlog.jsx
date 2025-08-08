import { getPost } from "../src/api"
import { useNavigate, useParams } from "react-router-dom"
import { useState,useEffect } from "react"


export function ReadBlog(){
    const [post,setPost] = useState({})
    let params = useParams()
    const navigate = useNavigate()
    let id = params.id

    useEffect(() => {
        async function loadPost() {
            let data = await getPost(id)
            let date = new Date(data.datecreated)
            data.datecreated = date.toString()
            setPost(data) 
        }
        loadPost()
    },[id])
    return (
        <>
            <button onClick={() => navigate(-1)}>Back</button>
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{post.datecreated?.slice(4,15)}</h3>
            <p>{post.content}</p>
        </>
    )
}