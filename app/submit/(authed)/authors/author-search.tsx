'use client'

import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'

import { Search } from '../../../../components'
import { usePreprint } from '../preprint-context'
import { searchAuthor, updatePreprint } from '../../../../actions/preprint'
import useTracking from '../../../../hooks/use-tracking'

const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const isOrcid = (value: string) => {
  const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/
  return orcidRegex.test(value)
}

const validateAuthorSearch = (value: string) => {
  if (isEmail(value)) {
    return 'email'
  } else if (isOrcid(value)) {
    return 'orcid'
  } else {
    return 'invalid'
  }
}

const AuthorSearch = () => {
  const { preprint, setPreprint } = usePreprint()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const track = useTracking()

  const handleSubmit = useCallback(async () => {
    setError('')
    let success = false
    const searchResults = await searchAuthor(value)
    const author = searchResults.results[0]
    try {
      if (author && searchResults.results.length === 1) {
        const updatedPreprint = await updatePreprint(preprint, {
          authors: [...preprint.authors, author],
        })
        success = true
        setPreprint(updatedPreprint)
        setValue('')
      } else {
        setError('Author not found.')
      }
    } catch (e) {
      setError('An error occurred. Please try again.')
      console.error(e)
    } finally {
      track(success ? 'author_search_success' : 'author_search_failure', {
        search_type: validateAuthorSearch(value),
        search_value: value,
      })
    }
  }, [value, preprint, setPreprint, track])

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
