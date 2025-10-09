import UserCredentialCard from '@/src/views/components/profile/UserCredentialCard'
import UserInfoCard from '@/src/views/components/profile/UserInfoCard'
import UserMetaCard from '@/src/views/components/profile/UserMetaCard'
import { auth } from '@/src/lib/auth'
import React from 'react'

const AccountSettings =  async () => {
  
  return (
    <main className="rounded-2xl border p-5 lg:p-6">
      <h3 className="mb-5 text-lg font-semibold lg:mb-7">Profile</h3>
      <div className="space-y-6">
        <UserMetaCard />
        <UserInfoCard />
        <UserCredentialCard />
      </div>
    </main>
  )
}

export default AccountSettings