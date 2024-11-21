'use server'

import { User } from 'next-auth'
import { db } from '@vercel/postgres'

import { fetchWithAlerting, fetchWithToken } from './server-utils'

export async function registerAccount(
  params: Partial<User> & { password: string },
) {
  const res = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/register/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        repository: process.env.NEXT_PUBLIC_JANEWAY_REPOSITORY,
      }),
    },
  )

  const user = await res.json()
  if (user.pk) {
    const client = await db.connect()
    if (params.password) {
      await client.sql`INSERT INTO user_agreements (account_id) VALUES (${user.pk});`
    }
    if (user.confirmation_code) {
      await client.sql`INSERT INTO confirmation_codes (account_id, confirmation_code) VALUES (${user.pk}, ${user.confirmation_code});`
    }
  }
  return user
}

export async function activateAccount(
  user: number,
  confirmation_code: string,
  { recordAgreement }: { recordAgreement: boolean },
) {
  const client = await db.connect()

  if (recordAgreement) {
    await client.sql`INSERT INTO user_agreements (account_id) VALUES (${user});`
  }
  const res = await fetchWithAlerting(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/activate/${user}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        confirmation_code,
      }),
    },
  )

  const result = await res.json()

  if (result) {
    await client.sql`DELETE FROM confirmation_codes WHERE confirmation_code = ${confirmation_code};`
  }
  return result
}

export async function updateAccount(user: User, params: Partial<User>) {
  const res = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/update/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        repository: process.env.NEXT_PUBLIC_JANEWAY_REPOSITORY,
      }),
    },
  )

  return res.json()
}
