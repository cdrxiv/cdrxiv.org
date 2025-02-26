import { Flex } from 'theme-ui'
import Link from '../components/link'
import { useSearchParams } from 'next/navigation'

export type ViewType = 'grid' | 'list'

const ViewSelector = () => {
  const searchParams = useSearchParams()
  const currentView = (searchParams.get('view') as ViewType) || 'grid'

  const createViewUrl = (view: ViewType) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('view', view)
    return `?${params.toString()}`
  }

  const handleViewChange = (
    view: ViewType,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  return (
    <Flex role='listbox' aria-label='View options' sx={{ gap: 3 }}>
      <Link
        role='option'
        aria-selected={currentView === 'grid'}
        onClick={(e) => handleViewChange('grid', e)}
        href={createViewUrl('grid')}
        selected={currentView === 'grid'}
        hoverEffect={true}
        sx={{ ':visited': { color: 'blue' } }}
      >
        Grid
      </Link>
      <Link
        role='option'
        aria-selected={currentView === 'list'}
        onClick={(e) => handleViewChange('list', e)}
        href={createViewUrl('list')}
        selected={currentView === 'list'}
        hoverEffect={true}
        sx={{ ':visited': { color: 'blue' } }}
      >
        List
      </Link>
    </Flex>
  )
}

export default ViewSelector
