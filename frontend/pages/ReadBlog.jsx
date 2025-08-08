import { getPost } from "../src/api"
import { useParams } from "react-router-dom"
import { useState,useEffect } from "react"

export function ReadBlog(){
    const [post,setPost] = useState({})
    let params = useParams()
    let id = params.id

    useEffect(() => {
        async function loadPost() {
            let data = await getPost(id)
            setPost(data) 
        }
        loadPost()
    },[id])
    return (
        <>
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{post.datecreated}</h3>
            <p>{post.content}</p>
        </>
    )
}