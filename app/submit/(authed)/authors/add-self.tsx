import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

import { Button } from '../../../../components'
import { usePreprint } from '../../preprint-context'
import { updatePreprint } from '../../../../actions/preprint'

const AddSelf = () => {
  const { data: session } = useSession()
  const { preprint, setPreprint } = usePreprint()

  const handleClick = useCallback(() => {
    if (session?.user && session?.user.email) {
      updatePreprint(preprint, {
        authors: [
          ...preprint.authors,
          { pk: session?.user.id, email: session?.user.email },
        ],
      }).then((updatedPreprint) => setPreprint(updatedPreprint))
    }
  }, [preprint, session?.user, setPreprint])

  const isAdded = !!preprint.authors.find(({ pk }) => pk === session?.user?.id)
  return (
    <Button
      sx={{ width: 'fit-content', color: isAdded ? 'purple' : 'blue' }}
      onClick={handleClick}
      disabled={isAdded}
    >
      Add self as author
    </Button>
  )
}

export default AddSelf
