/* eslint-disable react/no-children-prop */
import Storage from '@aws-amplify/storage'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Post } from '../../src/API'
import { CustomAPI } from '../../src/gql-wrapper'
import { getPost, listPosts } from '../../src/graphql/queries'

interface Props {
  post: Post
}

const PostPage: NextPage<Props> = ({ post }) => {
  const [coverImage, setCoverImage] = useState<unknown>(null)
  const updateCoverImage = useRef(null)

  updateCoverImage.current = async (): Promise<void> => {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage)
      setCoverImage(imageKey)
    }
  }

  useEffect(() => {
    updateCoverImage.current()
  }, [])

  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
      {coverImage && <img src={coverImage as string} className="mt-4" alt="" />}
      <p className="text-sm font-light my-4">by {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown className="prose" children={post.content} />
      </div>
    </div>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const postData = await (CustomAPI.query<Post[]>(listPosts) as Promise<{ items: Post[] }>)
  const paths = postData.items.map((post) => ({ params: { id: post.id } }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  const { id } = params
  const post = await (CustomAPI.query<Post>(getPost, { id }) as Promise<Post>)
  if (post)
    return {
      props: { post },
      revalidate: 1,
    }
  return {
    notFound: true,
  }
}

export default PostPage
