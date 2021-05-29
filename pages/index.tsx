import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listPosts } from '../src/graphql/queries'
import { Post } from '../src/API'
import { CustomAPI } from '../src/gql-wrapper'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    console.log(posts)
  }, [posts])

  async function fetchPosts() {
    const api = new CustomAPI();
    const postData = api.query(listPosts) as Promise<{items: Post[]}>;
    postData.then(({items}) => setPosts(items))
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {
        posts.map((post: Post, index: any) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
          </div>
        </Link>)
        )
      }
    </div>
  )
}