'use server'

import { headers } from 'next/headers'
import { User } from 'next-auth'

import { fetchWithToken } from '../app/api/utils'

export async function updateAccount(user: User, params: Partial<User>) {
  const res = await fetchWithToken(
    headers(),
    `https://carbonplan.endurance.janeway.systems/carbonplan/api/accounts/${user.id}/`,
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

  // TODO: update user stored on session

  return updatedUser
}
