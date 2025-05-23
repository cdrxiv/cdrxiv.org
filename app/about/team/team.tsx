'use client'

import { Box } from 'theme-ui'
import { Row, Column } from '../../../components'
import { ThemeUIStyleObject } from 'theme-ui'

type Affiliate = {
  name: string
  affiliation: string
}

type AdvisoryBoard = {
  name: string
  role: string
  affiliation: string
}

type ContentTeam = {
  name: string
  role: string
  affiliation: string
}

const sortByLastName = <T extends { name: string }>(arr: T[]) =>
  arr.sort((a, b) =>
    a.name.split(' ').pop()!.localeCompare(b.name.split(' ').pop()!),
  )

const contentTeam: ContentTeam[] = sortByLastName([
  {
    name: 'Tyler Kukla',
    role: 'Content Manager',
    affiliation: 'CarbonPlan',
  },
])

const advisoryBoard: AdvisoryBoard[] = sortByLastName([
  {
    name: 'Jennifer Pett-Ridge',
    role: 'Senior Staff Scientist',
    affiliation: 'Lawrence Livermore National Laboratory',
  },
  {
    name: 'Simon Nicholson',
    role: 'Co-Director',
    affiliation:
      'Institute for Responsible Carbon Removal, American University',
  },
  {
    name: 'Freya Chay',
    role: 'Carbon Removal Program Lead',
    affiliation: 'CarbonPlan',
  },
  {
    name: 'Grace Andrews',
    role: 'Founder & Executive Director',
    affiliation: 'Hourglass Climate',
  },
  {
    name: 'Sam Hindle',
    role: 'Content Manager',
    affiliation: 'bioRxiv and medRxiv',
  },
])

const affiliates: Affiliate[] = sortByLastName([
  {
    name: 'Katherine Almquist',
    affiliation: 'Northwestern University',
  },
  {
    name: 'Jonah Bernstein-Schalet',
    affiliation: 'Mati Carbon',
  },
  {
    name: 'Kenzo Esquivel',
    affiliation: 'Lawrence Livermore National Laboratory',
  },
  {
    name: 'Evan Ramos',
    affiliation: 'University of Pittsburgh',
  },
  {
    name: 'Alexandra Ringsby',
    affiliation: 'Stanford University',
  },
  {
    name: 'Brian Rogers',
    affiliation: 'Stanford University',
  },
  {
    name: 'Mary Margaret Stoll',
    affiliation: 'University of Washington',
  },
  {
    name: 'Allegra Tashjian',
    affiliation: 'Northwestern University',
  },
  {
    name: 'Trent Thomas',
    affiliation: 'University of Washington',
  },
])

const PersonInfo: React.FC<{
  name: string
  role?: string
  affiliation: string
  sx?: ThemeUIStyleObject
}> = ({ name, role, affiliation, sx = {} }) => (
  <Box sx={{ mb: 3, ...sx }}>
    <Box>{name}</Box>
    <Box variant='text.mono'>
      {role ? `${role}, ` : ''}
      {affiliation}
    </Box>
  </Box>
)

const Team: React.FC = () => {
  return (
    <Box>
      <Box as='h2' sx={{ mb: 4, mt: 7 }}>
        Advisory Board
      </Box>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={[1]} width={[6, 6, 8, 8]}>
          {advisoryBoard.map(({ name, role, affiliation }, i) => (
            <PersonInfo
              key={name}
              name={name}
              role={role}
              affiliation={affiliation}
              sx={i === advisoryBoard.length - 1 ? { mb: 0 } : undefined}
            />
          ))}
        </Column>
      </Row>

      <Box sx={{ mt: 7 }}>
        <Box as='h2' sx={{ mb: 4 }}>
          Content Team
        </Box>
        <Box sx={{ mb: 6 }}>
          <Box variant='text.monoCaps' sx={{ fontSize: [2, 2, 2, 3], mb: 4 }}>
            {contentTeam[0].role}
          </Box>
          <Box>
            <PersonInfo
              name={contentTeam[0].name}
              affiliation={contentTeam[0].affiliation}
            />
          </Box>
        </Box>

        <Box variant='text.monoCaps' sx={{ fontSize: [2, 2, 2, 3], mb: 4 }}>
          Affiliate expert Screeners
        </Box>
        <Row columns={[6, 6, 8, 8]}>
          <Column start={[1]} width={[6, 3, 4, 4]}>
            {affiliates
              .slice(0, Math.ceil(affiliates.length / 2))
              .map(({ name, affiliation }) => (
                <PersonInfo key={name} name={name} affiliation={affiliation} />
              ))}
          </Column>
          <Column start={[1, 4, 5, 5]} width={[6, 3, 4, 4]}>
            {affiliates
              .slice(Math.ceil(affiliates.length / 2))
              .map(({ name, affiliation }) => (
                <PersonInfo key={name} name={name} affiliation={affiliation} />
              ))}
          </Column>
        </Row>
      </Box>
    </Box>
  )
}

export default Team
