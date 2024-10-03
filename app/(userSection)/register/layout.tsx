import { ReactNode } from 'react'
import SharedLayout from '../shared-layout'

export const metadata = {
  title: 'Register – CDRXIV',
}

const Layout = ({ children }: { children: ReactNode }) => (
  <SharedLayout title='Register'>{children}</SharedLayout>
)

export default Layout
