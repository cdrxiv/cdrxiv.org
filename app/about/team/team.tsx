'use client'

import { Box } from 'theme-ui'
import Image, { StaticImageData } from 'next/image'
import { Link, Row, Column } from '../../../components'

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

const contentTeam: ContentTeam[] = [
  {
    name: 'Tyler Kukla',
    role: 'Content Curation Lead',
    image: tk,
    affiliation: 'CarbonPlan',
  },
]

const editorialBoard: AdvisoryBoard[] = [
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
]

const affiliates: Affiliate[] = [
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
]

const Team: React.FC = () => {
  return (
    <Box>
      <Box as='h2' sx={{ mb: 4 }}>
        Advisory board
      </Box>
      <Row columns={[6, 6, 6, 9]}>
        {editorialBoard.map(({ name, role, image, affiliation }, index) => (
          <Column
            key={name + index}
            start={[
              index % 2 === 0 ? 1 : 4,
              index % 2 === 0 ? 1 : 4,
              index % 2 === 0 ? 1 : 4,
              (index % 3) * 3 + 1,
            ]}
            width={[3, 3, 3, 3]}
            sx={{ mb: 6 }}
          >
            <Image
              src={image}
              alt={name}
              style={{ width: '100%', height: 'auto' }}
            />
            <Box sx={{ fontSize: [2, 2, 3, 3] }}>{name}</Box>
            <Box variant='text.mono'>
              {role}, {affiliation}
            </Box>
          </Column>
        ))}
      </Row>

      <Box as='h2' sx={{ mb: 2, mt: -4 }}>
        Content team
      </Box>
      {contentTeam.map(({ name, role, image, affiliation }, index) => (
        <Box key={name + index} sx={{ mb: 1 }}>
          <Box>{name}</Box>
          <Box sx={{ variant: 'text.mono' }}>
            {role}, {affiliation}
          </Box>
        </Box>
      ))}

      <Box as='h2' sx={{ mb: 2, mt: 4 }}>
        Affiliate expert screeners
      </Box>
      {affiliates.map(({ name, affiliation }, index) => (
        <Box key={name + index} sx={{ mb: 1 }}>
          <Box>{name}</Box>
          <Box sx={{ variant: 'text.mono' }}>{affiliation}</Box>
        </Box>
      ))}
    </Box>
  )
}

export default Team
