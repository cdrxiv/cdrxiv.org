import { useParams } from 'next/navigation'
import { usePreprints } from './preprints-provider'
import Stack from './stack'
import { Preprints } from '../types/preprint'

const PreprintsView = ({ view: propView }: { view?: string }) => {
  const params = useParams()
  const view: string = propView || params.view || 'stack'

  const preprints: Preprints | null = usePreprints()

  if (!preprints) {
    return <div>Loading...</div> // Or handle the null case appropriately
  }

  const renderData = () => {
    switch (view.toLowerCase()) {
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
