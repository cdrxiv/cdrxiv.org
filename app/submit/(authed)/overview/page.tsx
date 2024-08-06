'use client'

import { Flex, Label } from 'theme-ui'

import Checkbox from '../../../../components/checkbox'
import Field from '../../../../components/field'
import NavButtons from '../../nav-buttons'
import { usePreprint } from '../preprint-context'
import { updatePreprint } from '../actions'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SubmissionOverview = () => {
  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        <Field label='Submission agreement' id='agreement'>
          <Label>
            <Checkbox id='agreement' />
            Authors grant us the right to publish, on this website, their
            uploaded manuscript, supplementary materials and any supplied
            metadata.
          </Label>
        </Field>

        <Field
          label='Submission contents'
          id='contents'
          description='Select the content types you’d like to include in your submission.'
        >
          <Flex sx={{ gap: 8 }}>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox value='article' />
              Article
            </Label>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox value='data' />
              Data
            </Label>
          </Flex>
        </Field>
      </Flex>

      <NavButtons />
    </>
  )
}

export default SubmissionOverview
