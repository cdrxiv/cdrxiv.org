'use client'

import { Flex, Input, Textarea } from 'theme-ui'
import Field from '../../../components/field'
import Select from '../../../components/select'
import KeywordInput from '../../../components/keyword-input'
import FundingSources from '../../../components/funding-sources'

const SubmissionInformation = () => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      <Field label='Title' id='title'>
        <Input onChange={() => {}} id='title' />
      </Field>
      <Field
        label='Abstract'
        id='abstract'
        description='Some info about abstract formatting'
      >
        <Textarea onChange={() => {}} id='abstract' />
      </Field>
      <Field label='License' id='license'>
        <Select onChange={() => {}} id='license'>
          <option value='CC-BY'>CC-BY</option>
        </Select>
      </Field>
      <Field
        label='DOI'
        id='doi'
        description="You can add a DOI linking to this item's published version using this field. Please provide the full DOI, e.g., https://doi.org/10.1017/CBO9781316161012."
      >
        <Input onChange={() => {}} id='doi' />
      </Field>
      <Field label='Subject' id='subject'>
        <Select onChange={() => {}} id='subject'>
          <option value='Alkaline waste mineralization'>
            Alkaline waste mineralization
          </option>
        </Select>
      </Field>
      <Field
        label='Keywords'
        id='keywords'
        description='Hit Enter to add a new keyword.'
      >
        <KeywordInput id='keywords' />
      </Field>

      <Field label='Funding sources' id='funding'>
        <FundingSources />
      </Field>
    </Flex>
  )
}

export default SubmissionInformation
