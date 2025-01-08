'use client'

import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'

import { Search } from '../../../../components'
import { usePreprint } from '../../preprint-context'
import { searchAuthor, updatePreprint } from '../../../../actions'
import useLoadingText from '../../../../hooks/use-loading-text'
import useTracking from '../../../../hooks/use-tracking'
import { isValidOrcid } from '../../../../utils/data'

const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const validateAuthorSearch = (value: string) => {
  if (isEmail(value)) {
    return 'email'
  } else if (isValidOrcid(value, true)) {
    return 'orcid'
  } else {
    return 'invalid'
  }
}

const AuthorSearch = () => {
  const { preprint, setPreprint } = usePreprint()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const loadingText = useLoadingText({ isLoading, baseText: 'Searching' })
  const placeholderText = isLoading ? loadingText : ''
  const track = useTracking()

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    let success = false
    if (validateAuthorSearch(value) === 'invalid') {
      setIsLoading(false)
      setError(
        'Invalid search value. Please enter an email (e.g., name@example.com) or an ORCID identifier (e.g., 0000-0000-0000-0000).',
      )
      return
    }

    try {
      const searchResults = await searchAuthor(value.toUpperCase())
      const author = searchResults.results[0]
      if (author && searchResults.results.length === 1) {
        const updatedPreprint = await updatePreprint(preprint, {
          authors: [...preprint.authors, author],
        })
        success = true
        setPreprint(updatedPreprint)
        setValue('')
        setError('')
      } else {
        setError('Author not found.')
      }
    } catch (e) {
      setError('An error occurred. Please try again.')
      console.error(e)
    } finally {
      setIsLoading(false)
      track(success ? 'author_search_success' : 'author_search_failure', {
        search_type: validateAuthorSearch(value),
        search_value: value,
      })
    }
  }, [value, preprint, setPreprint, track])

  return (
    <>
      {error && <Box sx={{ variant: 'styles.error' }}>{error}</Box>}
      <Search
        id='search'
        value={isLoading ? '' : value}
        onChange={(e) => setValue(e.target.value)}
        onSubmit={handleSubmit}
        placeholder={placeholderText}
        disabled={isLoading}
        sx={{ variant: 'text.body' }}
      />
    </>
  )
}

export default AuthorSearch
