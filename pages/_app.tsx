import Amplify from '@aws-amplify/core'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import config from '../src/aws-exports'
import '../styles/globals.css'
import "easymde/dist/easymde.min.css"

import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { registerListener, removeListener } from '../src/utils/listeners'

Amplify.configure(config)

function MyApp({ Component, pageProps }: AppProps) {

  const [signedInUser, setSignedInUser] = useState<Boolean>(false)

  async function detectSignedInUser () {
    try {
      await Auth.currentAuthenticatedUser()
      setSignedInUser(true)
    } catch (err) {}
  }

  useEffect(() => {
    detectSignedInUser()
  }, [])



  useEffect(() => {
    registerListener('auth', 'authListener', (data) => {
          switch (data.payload.event) {
            case 'signIn':
              return setSignedInUser(true)
            case 'signOut':
              return setSignedInUser(false)
          }
        })
    return () => {
      removeListener('auth', 'authListener')
    }
  }, [])
  // useEffect(() => {
  //   // authListener()
  //   return () => {
  //     removeListener('auth', 'authListener')
  //   }
  // }, [])
  // async function authListener() {
  //   registerListener('auth', 'authListener', (data) => {
  //     switch (data.payload.event) {
  //       case 'signIn':
  //         return setSignedInUser(true)
  //       case 'signOut':
  //         return setSignedInUser(false)
  //     }
  //   })
  //   try {
  //     await Auth.currentAuthenticatedUser()
  //     setSignedInUser(true)
  //   } catch (err) {}
  // }

  return (
    <div>
    <nav className="p-6 border-b border-gray-300">
      <Link href="/">
        <span className="mr-6 cursor-pointer">Home</span>
      </Link>
      <Link href="/create-post">
        <span className="mr-6 cursor-pointer">Create Post</span>
      </Link>
      <Link href="/profile">
        <span className="mr-6 cursor-pointer">Profile</span>
      </Link>
      {
        signedInUser && (
          <Link href="/my-posts">
            <span className="mr-6 cursor-pointer">My Posts</span>
          </Link>
        )
      }
    </nav>
    <div className="py-8 px-16">
      <Component {...pageProps} />
    </div>
  </div>
  )
}

export default MyApp