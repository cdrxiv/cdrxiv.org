'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import SharedLayout from '../shared-layout'
import RegistrationForm from './form'

const Page = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account')
    }
  }, [status, router])

  return (
    <SharedLayout title='Register'>
      <RegistrationForm />
    </SharedLayout>
  )
}

export default Page
