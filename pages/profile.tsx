import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Auth, { CognitoUser } from '@aws-amplify/auth'
import { useState, useEffect } from 'react'

function Profile() {
  const [user, setUser] = useState<CognitoUser | null>(null)
  useEffect(() => {
    checkUser()
  }, [])
  async function checkUser() {
    const user = await (Auth.currentAuthenticatedUser() as Promise<CognitoUser>)
    setUser(user)
    
  }
  if (!user) return null
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
      <h3 className="font-medium text-gray-500 my-2">Username: {user.getUsername()}</h3>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(Profile)