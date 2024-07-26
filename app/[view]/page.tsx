'use client'

import PreprintsView from '../../components/preprints-view'
import { Flex, Box } from 'theme-ui'
import StyledLink from '../../components/link'
import Topics from '../../components/topics'

import { redirect } from 'next/navigation'

export default function ViewPage({ params }: { params: { view: string } }) {
  const validViews = ['grid', 'list']
  if (!validViews.includes(params.view)) {
    redirect(`/${validViews[0]}`)
  }

  return (
    <>
      <Topics />
      <Flex
        sx={{
          my: [4, 4, 8],
          justifyContent: 'flex-start',
          gap: 6,
        }}
      >
        <Box sx={{ variant: 'text.monoCaps' }}>Recent preprints</Box>
        {validViews.map((view) => (
          <StyledLink
            key={view}
            href={`/${view}`}
            sx={{
              variant: 'text.body',
              fontSize: [2, 2, 2, 3],
              textDecoration: params.view === view ? 'underline' : 'none',
              textTransform: 'capitalize',
            }}
          >
            {view}
          </StyledLink>
        ))}
      </Flex>
      <PreprintsView view={params.view} />
    </>
  )
}
