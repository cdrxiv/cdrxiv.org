import { usePreprints } from './preprints-provider'
import Stack from './stack'
import { Preprints } from '../types/preprint'

const PreprintsView = ({ view }: { view?: string }) => {
  const preprints: Preprints | null = usePreprints()

  if (!preprints) return

  const renderData = () => {
    switch (view?.toLowerCase()) {
      case 'grid':
        return <div>Grid View of Data</div>
      case 'list':
        return <div>List View of Data</div>
      default:
        return <Stack preprints={preprints} />
    }
  }

  return <>{renderData()}</>
}

export default PreprintsView
