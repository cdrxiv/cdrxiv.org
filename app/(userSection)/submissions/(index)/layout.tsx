import SharedLayout from '../../shared-layout'

export const metadata = {
  title: 'Submissions – CDRXIV',
}
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SharedLayout title='Submissions'>{children}</SharedLayout>
}

export default Layout
