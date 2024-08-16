import SharedLayout from '../../shared-layout'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SharedLayout title='Submissions'>{children}</SharedLayout>
}

export default Layout
