'use client'

import { Flex } from 'theme-ui'

import NavButtons from '../../nav-buttons'
import Field from '../../../../components/field'
import AuthorForm from './author-form'
import { usePreprint } from '../preprint-context'
import Row from '../../../../components/row'
import AuthorSearch from './author-search'
import AuthorCard from './author-card'
import AddSelf from './add-self'

const Authors = () => {
  const { preprint } = usePreprint()
  return (
    <div>
      <Flex sx={{ flexDirection: 'column', gap: 8 }}>
        <Field
          label='Overview'
          id='overview'
          description={
            <ol>
              <li>
                You can add yourself as an author using the button below. This
                will copy metadata from your profile to create a submission
                author record.
              </li>
              <li>
                You can search the database of existing authors to add them as
                authors.
              </li>
              <li>
                You can create new records for authors using the form below.
              </li>
            </ol>
          }
        >
          <Row columns={[1, 1, 2, 2]} gap={[5, 6, 6, 8]}>
            {preprint.authors.map((a) => (
              <AuthorCard key={a.email} author={a} />
            ))}
          </Row>
        </Field>

        <Field
          label='Add self'
          id='self'
          description={
            <>
              Your account will be the owner of this submission, but is not an
              author on record by default. Click the button above to add
              yourself as an author.
              <br />
              <br />
              To have the submission linked to a different account, have the
              owner of that account complete this process from their account.
            </>
          }
        >
          <AddSelf />
        </Field>

        <Field
          label='Search for an author'
          id='search'
          description='You can search by email or ORCID'
        >
          <AuthorSearch />
        </Field>

        <Field label='Add new author' id='new'>
          <AuthorForm />
        </Field>
      </Flex>

      <NavButtons />
    </div>
  )
}

export default Authors
