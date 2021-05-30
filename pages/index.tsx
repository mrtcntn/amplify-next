import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listPosts } from '../src/graphql/queries'
import { Post } from '../src/API'
import { CustomAPI } from '../src/gql-wrapper'
import Storage from '@aws-amplify/storage'
import { NextPage } from 'next'

type PostWithImage = Post & { image?: unknown }

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostWithImage[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts(): Promise<void> {
    const postData = await (CustomAPI.query(listPosts) as Promise<{ items: Post[] }>)
    const postsWithImages = await Promise.all<PostWithImage>(
      postData.items.map(async (post) => {
        const postWithImage = post as PostWithImage
        if (post.coverImage) {
          postWithImage.image = await Storage.get(post.coverImage)
        }
        return postWithImage
      })
    )
    setPosts(postsWithImages)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {posts.map((post: PostWithImage, index: number) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
            {post.coverImage && (
              <img src={post.image as string} className="w-56" alt={post.title} />
            )}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Home
