'use server'

import { headers } from 'next/headers'
import { User } from 'next-auth'
import { sql } from '@vercel/postgres'

import { fetchWithToken } from '../app/utils/fetch-with-token/server'

export async function registerAccount(
  params: Partial<User> & { password: string },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/register/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        repository: 1,
      }),
    },
  )
  if (res.status !== 201) {
    let keyErrors
    try {
      const data = await res.json()
      keyErrors = Object.keys(data).map((key) =>
        data[key]
          .map((err: string) => err[0].toUpperCase() + err.slice(1))
          .join(' '),
      )
    } catch {
      console.warn('Unable to extract error message from response')
    }
    throw new Error(
      keyErrors
        ? `Status ${res.status}: Unable to register account. ${keyErrors.join(' ')}`
        : `Status ${res.status}: Unable to register account. ${res.statusText}`,
    )
  }

  const user = await res.json()

  if (user.confirmation_code && user.pk) {
    await sql`INSERT INTO confirmation_codes (account_id, confirmation_code) VALUES (${user.pk}, ${user.confirmation_code});`
  }
  return user
}

export async function activateAccount(user: number, confirmation_code: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/activate/${user}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        confirmation_code,
      }),
    },
  )

  if (res.status > 200) {
    throw new Error(
      `Status ${res.status}: Unable to activate account. ${res.statusText}`,
    )
  }

  const result = await res.json()

  if (result) {
    await sql`DELETE FROM confirmation_codes WHERE confirmation_code = ${confirmation_code};`
  }
  return result
}

export async function updateAccount(user: User, params: Partial<User>) {
  const res = await fetchWithToken(
    headers(),
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/account/update/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        repository: 1,
      }),
    },
  )
  if (res.status !== 200) {
    let keyErrors
    try {
      const data = await res.json()
      keyErrors = Object.keys(data).map(
        (key) => `${key} (${data[key].join(', ')})`,
      )
    } catch {
      console.warn('Unable to extract error message from response')
    }
    throw new Error(
      keyErrors
        ? `Status ${res.status}: Unable to update account. Error updating field(s): ${keyErrors.join('; ')}.`
        : `Status ${res.status}: Unable to update account ${user.id}. ${res.statusText}`,
    )
  }

  const updatedUser = res.json()

  return updatedUser
}
