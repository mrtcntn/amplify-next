import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listPosts } from '../src/graphql/queries'
import { Post } from '../src/API'
import { CustomAPI } from '../src/gql-wrapper'

export default function Home() {

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Not Found</h1>
    </div>
  )
}