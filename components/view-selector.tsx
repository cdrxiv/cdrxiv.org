import { Flex } from 'theme-ui'
import Link from './link'
import { useSearchParams } from 'next/navigation'

export type ViewType = 'grid' | 'list'

interface ViewSelectorProps {
  currentView: ViewType
  onViewChange?: (view: ViewType) => void
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  const searchParams = useSearchParams()

  const createViewUrl = (view: ViewType) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('view', view)
    return `?${params.toString()}`
  }

  const handleViewChange = (
    view: ViewType,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (onViewChange) {
      e.preventDefault()
      onViewChange(view)
    }
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
