import { withAuthenticator } from '@aws-amplify/ui-react'
import { ChangeEvent, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { CreatePostInput } from '../src/API'
import { CustomAPI } from '../src/gql-wrapper'
import { createPost } from '../src/graphql/mutations'
import dynamic from 'next/dynamic';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql'
import Storage from '@aws-amplify/storage'

const SimpleMDE = dynamic(import('react-simplemde-editor'), {ssr: false});
const initialState: CreatePostInput = { title: '', content: '' }

function CreatePost() {
  
  const [post, setPost] = useState<CreatePostInput>(initialState)

  const [image, setImage] = useState(null)
  const hiddenFileInput = useRef(null);

  const { title, content } = post
  const router = useRouter()
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
        const id = uuid()
        post.id = id

    // If there is an image uploaded, store it in S3 and add it to the post metadata
    if (image) {
        const fileName = `${image.name}_${uuid()}`
        post.coverImage = fileName
        await Storage.put(fileName, image)
    }
    
    await CustomAPI.mutate(createPost, { 
        input: post },
        GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    )
    router.push(`/posts/${id}`)
  }

  async function uploadImage() {
    hiddenFileInput.current.click();
  }
  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return
    setImage(fileUploaded)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      {
        image && (
          <img src={URL.createObjectURL(image)} className="my-4" />
        )
      }
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <input
        type="file"
        ref={hiddenFileInput}
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
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPost}
      >Create Post</button>
    </div>
  )
}

export default withAuthenticator(CreatePost)