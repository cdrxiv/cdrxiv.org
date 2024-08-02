'use client'

import React, { useState } from 'react'
import Topics from './topics'
import PreprintsView from './preprints-view'
import { Preprints } from '../types/preprint'
import { Subjects } from '../types/subject'

interface LandingPageProps {
  preprints: Preprints
  subjects: Subjects
}

const LandingPage: React.FC<LandingPageProps> = ({ preprints, subjects }) => {
  const [filteredPreprints, setFilteredPreprints] =
    useState<Preprints>(preprints)
  const [filter, setFilter] = useState('')

  const handleFilterChange = async (newFilter: string) => {
    if (newFilter === 'All') {
      setFilter('')
      setFilteredPreprints(preprints)
      return
    } else {
      setFilter(newFilter)
    }
    const res: Response = await fetch(`/api/preprints?subject=${newFilter}`)
    const json = await res.json()
    const data: Preprints = json.results
    setFilteredPreprints(data)
  }

  return (
    <>
      <Topics
        subjects={subjects}
        handleFilterChange={handleFilterChange}
        filter={filter}
      />
      <PreprintsView preprints={filteredPreprints} />
    </>
  )
}

export default LandingPage
