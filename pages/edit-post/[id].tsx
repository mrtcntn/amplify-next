import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import { CustomAPI } from '../../src/gql-wrapper'
import { Post, UpdatePostInput } from '../../src/API'
import { getPost } from '../../src/graphql/queries'
import { updatePost } from '../../src/graphql/mutations'
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql'
import Storage from '@aws-amplify/storage'
import { v4 as uuid } from 'uuid'

function EditPost() {
  const [post, setPost] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [localImage, setLocalImage] = useState(null)
  const fileInput = useRef(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetchPost()
    async function fetchPost() {
      if (!id) return
      const postData = await (CustomAPI.query<Post>(getPost, { id }) as Promise<Post>);
      setPost(postData)
      if (postData.coverImage) {
        updateCoverImage(postData.coverImage)
      }
    }
  }, [id])

  if (!post) router.push('/404')

  async function updateCoverImage(coverImage) {
    const imageKey = await Storage.get(coverImage)
    setCoverImage(imageKey)
  }
  async function uploadImage() {
    fileInput.current.click();
  }
  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return
    setCoverImage(fileUploaded)
    setLocalImage(URL.createObjectURL(fileUploaded))
  }
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const { title, content } = post
  async function updateCurrentPost() {
    if (!title || !content) return
    const postUpdated: UpdatePostInput =  {
        id: id as string, content, title
    }
    // check to see if there is a cover image and that it has been updated
    if (coverImage && localImage) {
      const fileName = `${coverImage.name}_${uuid()}` 
      postUpdated.coverImage = fileName
      await Storage.put(fileName, coverImage)
    }
    await CustomAPI.mutate(
        updatePost, 
        { input: postUpdated }, 
        GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    )
    console.log('post successfully updated!')
    router.push('/my-posts')
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Edit post</h1>
      {
        coverImage && <img src={localImage ? localImage : coverImage} className="mt-4" />
      }
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <input
        type="file"
        ref={fileInput}
        className="absolute w-0 h-0"
        onChange={handleChange}
      />
      <button
        className="bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg mr-2" 
        onClick={uploadImage}        
      >
        Upload Cover Image
      </button>
      <button
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}>Update Post</button>
    </div>
  )
}

export default EditPost