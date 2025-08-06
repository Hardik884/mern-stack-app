import {getPosts} from "../api"
import {useState,useEffect} from "react"
import { BlogCard } from "../src/components/BlogCard"
export function Home(){

    const [posts, setPosts] = useState([])

    useEffect(() => {
        async function loadAllPosts(){
            data.sort((d1,d2) => new Date(d2.dateCreated).getTime() - new Date(d1.dateCreated).getTime)
            const data = await getPosts()
            setPosts(data)
        }
        loadAllPosts()
    },[])
    return (
        <div className="posts">
            {posts.map((post) =>{
                return (
                    <BlogCard post={post}/>
                )
            })}
        </div>
    )
}