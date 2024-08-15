'use client'

import { Flex } from 'theme-ui'

import { Field } from '../../../../../components'
import NavButtons from '../../../nav-buttons'
import AuthorForm from '../author-form'
import AuthorSearch from '../author-search'
import AddSelf from '../add-self'
import AuthorsList from '../authors-list'

const Authors = () => {
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
          <AuthorsList />
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
