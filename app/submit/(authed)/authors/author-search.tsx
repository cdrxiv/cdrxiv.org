'use client'

import { Box } from 'theme-ui'
import { useCallback, useState } from 'react'

import { Search } from '../../../../components'
import { usePreprint } from '../preprint-context'
import { fetchAccount, searchAuthor, updatePreprint } from '../actions'
import { track } from '@vercel/analytics'

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

  const handleSubmit = useCallback(async () => {
    let success = false
    setError('')
    const type = validateAuthorSearch(value)

    try {
      const searchResults = await searchAuthor(value)
      const author = searchResults.results[0]
      if (author && searchResults.results.length === 1) {
        const account = await fetchAccount(author.pk) // TODO: remove if search endpoint can return email
        const updatedPreprint = await updatePreprint(preprint, {
          authors: [...preprint.authors, account],
        })
        success = true
        setPreprint(updatedPreprint)
        setValue('')
      }
    } catch (error) {
      console.error('Error in author search or update:', error)
    } finally {
      if (!success) setError('Author not found.')
      track('author_search_attempt', {
        success,
        type: type === 'invalid' ? `invalid (${value})` : type,
      })
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
