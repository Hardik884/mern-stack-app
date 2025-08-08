import { Link } from "react-router-dom"

export function BlogCard({post}) {
    return (
        <Link to={`/readblog/${post._id}`} className="post">
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{new Date(post.datecreated).toLocaleDateString()}</h3>
        </Link>

    )
}