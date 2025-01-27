'use client'

import { Box } from 'theme-ui'
import Image, { StaticImageData } from 'next/image'
import { Row, Column } from '../../../components'

import tk from './images/tk.jpg'
import jp from './images/jp.png'
import fc from './images/fc.png'
import ga from './images/ga.png'

type Affiliate = {
  name: string
  affiliation: string
}

type AdvisoryBoard = {
  name: string
  role: string
  image: StaticImageData
  affiliation: string
}

type ContentTeam = {
  name: string
  role: string
  image: StaticImageData
  affiliation: string
}

const sortByLastName = <T extends { name: string }>(arr: T[]) =>
  arr.sort((a, b) =>
    a.name.split(' ').pop()!.localeCompare(b.name.split(' ').pop()!),
  )

const contentTeam: ContentTeam[] = sortByLastName([
  {
    name: 'Tyler Kukla',
    role: 'Content Curation Lead',
    image: tk,
    affiliation: 'CarbonPlan',
  },
])

const editorialBoard: AdvisoryBoard[] = sortByLastName([
  {
    name: 'Jennifer Pett-Ridge',
    role: 'Senior Staff Scientist',
    image: jp,
    affiliation: 'Lawrence Livermore National Laboratory',
  },
  {
    name: 'Simon Nicholson',
    role: 'Co-Director',
    image: tk,
    affiliation:
      'Institute for Responsible Carbon Removal, American University',
  },
  {
    name: 'Freya Chay',
    role: 'Carbon Removal Program Lead',
    image: fc,
    affiliation: 'CarbonPlan',
  },
  {
    name: 'Grace Andrews',
    role: 'Founder & Executive Director',
    image: ga,
    affiliation: 'Hourglass Climate',
  },
  {
    name: 'Sam Hindle',
    role: 'tk',
    image: tk,
    affiliation: 'BioRXIV',
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
  sx?: any
}> = ({ name, role, affiliation, sx = {} }) => (
  <Box sx={{ mb: 2, ...sx }}>
    <Box>{name}</Box>
    <Box sx={{ variant: 'text.mono' }}>
      {role ? `${role}, ` : ''}
      {affiliation}
    </Box>
  </Box>
)

const Team: React.FC = () => {
  return (
    <Box>
      <Box as='h2'>Content curation lead</Box>
      <PersonInfo
        name={contentTeam[0].name}
        affiliation={contentTeam[0].affiliation}
      />

      <Box as='h2' sx={{ mt: 4 }}>
        Expert screeners
      </Box>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={[1]} width={[6, 3, 3, 3]}>
          {affiliates
            .slice(0, Math.ceil(affiliates.length / 2))
            .map(({ name, affiliation }, index) => (
              <PersonInfo
                key={name + index}
                name={name}
                affiliation={affiliation}
              />
            ))}
        </Column>
        <Column start={[1, 4, 5, 5]} width={[6, 3, 3, 3]}>
          {affiliates
            .slice(Math.ceil(affiliates.length / 2))
            .map(({ name, affiliation }) => (
              <PersonInfo key={name} name={name} affiliation={affiliation} />
            ))}
        </Column>
      </Row>
      <Box as='h2' sx={{ mt: 4 }}>
        Advisory board
      </Box>
      <Row columns={[6, 6, 8, 8]}>
        {editorialBoard.map(({ name, role, image, affiliation }, index) => (
          <Column
            key={name + index}
            start={[
              1,
              index % 2 === 0 ? 1 : 4,
              index % 2 === 0 ? 1 : 5,
              index % 2 === 0 ? 1 : 5,
            ]}
            width={[5, 2, 3, 3]}
            sx={{ mb: 6 }}
          >
            <Image
              src={image}
              alt={name}
              style={{ width: '100%', height: 'auto' }}
            />
            <PersonInfo name={name} role={role} affiliation={affiliation} />
          </Column>
        ))}
      </Row>
    </Box>
  )
}

export default Team
