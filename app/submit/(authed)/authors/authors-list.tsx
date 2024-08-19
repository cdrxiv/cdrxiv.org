'use client'

import { usePreprint } from '../preprint-context'
import { Row } from '../../../../components'
import AuthorCard from './author-card'

type Props = {
  removable?: boolean
}
const AuthorsList: React.FC<Props> = ({ removable = true }) => {
  const { preprint } = usePreprint()
  return (
    <Row columns={[1, 1, 2, 2]} gap={[5, 6, 6, 8]}>
      {preprint.authors.map((a) => (
        <AuthorCard key={a.email} author={a} removable={removable} />
      ))}
    </Row>
  )
}

export default AuthorsList
