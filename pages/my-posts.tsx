import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Auth } from 'aws-amplify'
import { postsByUsername } from '../src/graphql/queries'
import { deletePost as deletePostMutation } from '../src/graphql/mutations'
import { CustomAPI } from '../src/gql-wrapper'
import { Post } from '../src/API'
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql'

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await (CustomAPI.query(postsByUsername, { username }) as Promise<{items: Post[]}>)
    setPosts(postData.items)
  }

  async function deletePost(id: string) {
    await CustomAPI.mutate(
        deletePostMutation, 
        { input: { id } }, 
        GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    )
    await fetchPosts()
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Posts</h1>
      {
        posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="cursor-pointer border-b border-gray-300	mt-8 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
            <Link href={`/edit-post/${post.id}`}><a className="text-sm mr-4 text-blue-500">Edit Post</a></Link>
            <Link href={`/posts/${post.id}`}><a className="text-sm mr-4 text-blue-500">View Post</a></Link>
            <button
              className="text-sm mr-4 text-red-500"
              onClick={() => deletePost(post.id)}
            >Delete Post</button>
          </div>
        </Link>)
        )
      }
    </div>
  )
}