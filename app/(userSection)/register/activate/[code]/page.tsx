import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'

import { activateAccount } from '../../../../../actions/account'
import ErrorState from './error-state'

type Props = { params: { code: string } }
const Page = async ({ params: { code } }: Props) => {
  const { rows } =
    await sql`SELECT account_id FROM confirmation_codes WHERE confirmation_code = ${code}`
  if (rows.length === 1 && rows[0].account_id) {
    try {
      await activateAccount(rows[0].account_id, code)
    } catch {
      return <ErrorState />
    }
  } else {
    return (
      <ErrorState text='Activation code not found. If your account may have already been activated, try logging in instead.' />
    )
  }
  redirect('/account?activated=true')
}

export default Page
