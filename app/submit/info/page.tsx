'use client'

import { Flex, Input, Textarea } from 'theme-ui'
import Field from '../../../components/field'
import Select from '../../../components/select'

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
      <Field label='DOI' id='doi'>
        <Input onChange={() => {}} id='doi' />
      </Field>
    </Flex>
  )
}

export default SubmissionInformation
