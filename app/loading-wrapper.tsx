import Loading from '../components/loading'

// this is used in main page.tsx to avoid a bug where passing a client component to suspense causes errors
const LoadingWrapper = () => {
  return (
    <Loading
      sx={{
        ml: 'auto',
        mr: 'auto',
      }}
    />
  )
}

export default LoadingWrapper
