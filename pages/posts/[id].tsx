import Storage from '@aws-amplify/storage'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Post } from '../../src/API'
import { CustomAPI } from '../../src/gql-wrapper'
import { getPost, listPosts } from '../../src/graphql/queries'

export default function PostPage({ post }) {
  const [coverImage, setCoverImage] = useState(null)
  useEffect(() => {
    updateCoverImage()
  }, [])
  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage)
      setCoverImage(imageKey)
    }
  }
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    if (!post) {
        router.push('/404')
    }
  }, [])

  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
      {
        coverImage && <img src={coverImage} className="mt-4" />
      }
      <p className="text-sm font-light my-4">by {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown className='prose' children={post.content} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await (CustomAPI.query<Post[]>(listPosts) as Promise<{items: Post[]}>);
  const paths = postData.items.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await (CustomAPI.query<Post>(getPost, { id }) as Promise<Post>);
  if (postData)
    return {
      props: {
        post: postData
      },
      revalidate: 1
    }
  return {
      redirect: {
          destination: '/404'
      },
      revalidate: 1
  }
  
}