'use client'

import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'

import { Search } from '../../../../components'
import { usePreprint } from '../preprint-context'
import { searchAuthor, updatePreprint } from '../actions'

const AuthorSearch = () => {
  const { preprint, setPreprint } = usePreprint()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    setError('')
    const searchResults = await searchAuthor(value)
    const author = searchResults.results[0]
    if (author && searchResults.results.length === 1) {
      const updatedPreprint = await updatePreprint(preprint, {
        authors: [...preprint.authors, author],
      })

      setPreprint(updatedPreprint)
      setValue('')
    } else {
      setError('No author found.')
    }
  }, [value, preprint, setPreprint])

  return (
    <>
      {error && <Box sx={{ variant: 'text.mono', color: 'red' }}>{error}</Box>}
      <Search
        id='search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSubmit={handleSubmit}
        sx={{ variant: 'text.body' }}
      />
    </>
  )
}

export default AuthorSearch
