'use client'

import { Box } from 'theme-ui'

const team = [
  {
    name: 'name 1',
    bio: 'bio 1',
  },
  {
    name: 'name 2',
    bio: 'bio 2',
  },
]

const Team: React.FC = () => {
  return (
    <Box>
      {team.map(({ name, bio }) => (
        <Box key={name}>
          <Box as='h2'>{name}</Box>
          <Box>{bio}</Box>
        </Box>
      ))}
    </Box>
  )
}

export default Team
