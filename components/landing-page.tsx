import React from 'react'
import Controls from './controls'
import PreprintsView from './preprints-view'
import { Preprints } from '../types/preprint'
import { Subjects } from '../types/subject'

interface LandingPageProps {
  preprints: Preprints
  subjects: Subjects
}

const LandingPage: React.FC<LandingPageProps> = ({ preprints, subjects }) => {
  return (
    <>
      <Controls subjects={subjects} />
      <PreprintsView preprints={preprints} />
    </>
  )
}

export default LandingPage
