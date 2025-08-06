

export function BlogCard({post}) {
    let date = new Date(post.dateCreated)
    let stringDate = date.toString()
    return (
        <div className="post">
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{stringDate.slice(4,15)}</h3>
        </div>

    )
}