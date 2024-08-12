'use client'

import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'

import Search from '../../../../components/search'
import { usePreprint } from '../preprint-context'
import { fetchAccount, searchAuthor, updatePreprint } from '../actions'

const AuthorSearch = () => {
  const { preprint, setPreprint } = usePreprint()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    setError('')
    const searchResults = await searchAuthor(value)
    const author = searchResults.results[0]
    if (author && searchResults.results.length === 1) {
      const account = await fetchAccount(author.pk) // TODO: remove if search endpoint can return email
      const updatedPreprint = await updatePreprint(preprint, {
        authors: [...preprint.authors, account],
      })

      setPreprint(updatedPreprint)
      setValue('')
    } else {
      setError('No author found.')
    }
  }, [value, preprint])

  return (
    <>
      {error && <Box sx={{ variant: 'text.mono', color: 'red' }}>{error}</Box>}
      <Search
        id='search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AuthorSearch
