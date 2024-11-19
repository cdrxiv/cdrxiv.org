'use client'

import { Box } from 'theme-ui'
import Image, { StaticImageData } from 'next/image'
import { Link, Row, Column } from '../../../components'

import tk from './images/tk.jpg'

type Affiliate = {
  name: string
  affiliation: string
  affiliationLink: string
}

type EditorialBoardMember = {
  name: string
  role: string
  image: StaticImageData
  affiliation: string
  affiliationLink: string
}

const editorialBoard: EditorialBoardMember[] = [
  {
    name: 'Tyler Kukla',
    role: 'Editor-in-Chief',
    image: tk,
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    role: 'Editor-in-Chief',
    image: tk,
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    role: 'Editor-in-Chief',
    image: tk,
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    role: 'Editor-in-Chief',
    image: tk,
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    role: 'Editor-in-Chief',
    image: tk,
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
]

const affiliates: Affiliate[] = [
  {
    name: 'Tyler Kukla',
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
  {
    name: 'Tyler Kukla',
    affiliation: 'CarbonPlan',
    affiliationLink: 'https://carbonplan.org/',
  },
]

const Team: React.FC = () => {
  return (
    <Box>
      <Box as='h2' sx={{ mb: 4 }}>
        Editorial board
      </Box>
      <Row columns={[6, 6, 8, 9]}>
        {editorialBoard.map(
          ({ name, role, image, affiliation, affiliationLink }, index) => (
            <Column
              key={name + index}
              start={[
                index % 2 === 0 ? 1 : 4,
                index % 2 === 0 ? 1 : 4,
                index % 2 === 0 ? 1 : 5,
                (index % 3) * 3 + 1,
              ]}
              width={[3, 3, 4, 3]}
              sx={{ mb: 6 }}
            >
              <Image
                src={image}
                alt={name}
                style={{ width: '100%', height: 'auto' }}
              />
              <Box sx={{ fontSize: [3, 3, 4, 4] }}>{name}</Box>
              <Box variant='text.monoCaps'>{role}</Box>
              <Box>
                <Link
                  href={affiliationLink}
                  target='_blank'
                  variant='text.mono'
                >
                  {affiliation}
                </Link>
              </Box>
            </Column>
          ),
        )}
      </Row>
      <Box as='h2' sx={{ mb: 2, mt: 4 }}>
        Affiliates
      </Box>
      {affiliates.map(({ name, affiliation, affiliationLink }, index) => (
        <Box key={name + index} sx={{ mb: 3 }}>
          <Box>{name}</Box>
          <Box sx={{ variant: 'text.mono' }}>
            <Link href={affiliationLink} variant='text.mono'>
              {affiliation}
            </Link>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Team
