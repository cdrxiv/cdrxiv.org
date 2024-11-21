'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { NavSidebar } from '../../components'
import { PATHS } from './constants'
import { NavigationProvider, useLinkWithWarning } from './navigation-context'
import PaneledPage from '../../components/layouts/paneled-page'
import { usePreprint, usePreprintFiles } from './preprint-context'
import {
  deletePreprintFile,
  updatePreprint,
  deleteZenodoEntity,
  PREPRINT_BASE,
} from '../../actions'
import { isPreprintEmpty } from '../../utils/data'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { preprint, setPreprint } = usePreprint()
  const { files } = usePreprintFiles()
  const { onClick } = useLinkWithWarning()

  let index = PATHS.findIndex((p) => p.href === pathname)
  index = index >= 0 ? index : 0
  const active = PATHS[index]

  const handleDiscard = useCallback(async () => {
    if (
      window.confirm(
        'This will clear your current submission and all related files. Are you sure want to proceed?',
      )
    ) {
      const dataFile = preprint.supplementary_files.find(
        (file) => file.label === 'CDRXIV_DATA_DRAFT',
      )

      const filesCleanup = files.map((file) => deletePreprintFile(file.pk))
      if (dataFile) {
        filesCleanup.push(deleteZenodoEntity(dataFile.url))
      }

      if (filesCleanup.length > 0) {
        await Promise.all(filesCleanup)
      }

      const updatedPreprint = await updatePreprint(preprint, PREPRINT_BASE)
      setPreprint(updatedPreprint)

      router.push('/submit')
    }
  }, [router, preprint, files])

  const { paths, count } = useMemo(() => {
    const visiblePaths = PATHS.filter((p) => !p.hidden)
    return {
      paths: [
        ...visiblePaths,
        {
          key: 'discard',
          href: '',
          title: '(X) Discard draft',
          sx: {
            display: isPreprintEmpty(preprint) ? 'none' : 'initial',
            variant: 'text.mono',
            color: 'blue',
            ':hover': {},
            '::before': {},
            '&:hover::before': {},
          },
          onClick: handleDiscard,
          public: true,
        },
      ],
      count: visiblePaths.length,
    }
  }, [handleDiscard, preprint])

  return (
    <PaneledPage
      title={active.title}
      rightCorner={active.hidden ? <>&nbsp;</> : `Step ${index + 1} / ${count}`}
      sidebar={<NavSidebar paths={paths} onClick={onClick} />}
    >
      {children}
    </PaneledPage>
  )
}

const SubmitLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // this wrapper allows use of useLinkWithWarning below
  return (
    <NavigationProvider>
      <Layout>{children}</Layout>
    </NavigationProvider>
  )
}

export default SubmitLayout
