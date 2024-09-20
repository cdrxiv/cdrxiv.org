'use client'

import React, { useEffect, useState } from 'react'
import { Flex } from 'theme-ui'
import PaneledPage from '../../../components/layouts/paneled-page'
import PreprintViewer from '../../preprint-viewer'
import { Loading } from '../../../components'

import { Preprint } from '../../../types/preprint'
import { Deposition } from '../../../types/zenodo'

import { getPublicPreprintAndDeposition } from '../../../actions/preprint'

const FetchPreprint = ({ preprintId }: { preprintId: string }) => {
  const [preprint, setPreprint] = useState<Preprint | null>(null)
  const [deposition, setDeposition] = useState<Deposition | undefined>(
    undefined,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPreprintAndDep = async () => {
      try {
        const result = await getPublicPreprintAndDeposition(preprintId)
        if (result) {
          const { preprint, deposition } = result
          setPreprint(preprint)
          setDeposition(deposition)
        } else {
          setError(true)
        }
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPreprintAndDep()
  }, [preprintId])

  if (loading || error || !preprint) {
    return (
      <PaneledPage sidebar={<></>}>
        <Flex sx={{ justifyContent: 'center', alignItems: 'center', my: 150 }}>
          {loading ? <Loading /> : 'Error loading preprint'}
        </Flex>
      </PaneledPage>
    )
  }

  return <PreprintViewer preprint={preprint} deposition={deposition} />
}

export default FetchPreprint
