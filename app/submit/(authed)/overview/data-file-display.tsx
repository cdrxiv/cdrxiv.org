'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { fetchDataDeposition } from '../../../../actions/zenodo'
import { Deposition } from '../../../../types/zenodo'
import FileDisplay from './file-display'
import { FileInputValue } from '../../../../components'

type Props = {
  file: FileInputValue
}
const DataFileDisplay: React.FC<Props> = ({ file: fileProp }) => {
  const [deposition, setDeposition] = useState<Deposition | null>(null)
  const [loading, setLoading] = useState<boolean>(fileProp ? true : false)

  useEffect(() => {
    if (fileProp?.url) {
      fetchDataDeposition(fileProp.url).then((deposition) => {
        setDeposition(deposition)
        setLoading(false)
      })
    }
  }, [fileProp])

  const file = useMemo(
    () =>
      deposition && deposition.files[0]
        ? {
            name: deposition.files[0].filename,
            href: deposition.files[0].links.download,
          }
        : null,
    [deposition],
  )

  return loading ? (
    'Loading...'
  ) : (
    <FileDisplay name={file?.name} href={file?.href} />
  )
}

export default DataFileDisplay
