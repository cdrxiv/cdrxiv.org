'use client'

import { notFound } from 'next/navigation'
import PreprintsView from '../../components/preprints-view'
import { Flex, Box } from 'theme-ui'
import Column from '../../components/column'
import StyledLink from '../../components/link'
import Row from '../../components/row'
import Topics from '../../components/topics'

export default function ViewPage({ params }: { params: { view: string } }) {
  const validViews = ['stack', 'grid', 'list']
  if (!validViews.includes(params.view)) {
    notFound()
  }
  return (
    <>
      <Topics />
      <Row columns={12} sx={{ mt: 3 }}>
        <Column start={1} width={[12, 8, 6, 4]}>
          <Flex
            sx={{
              my: 8,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ variant: 'text.monoCaps' }}>Recent preprints</Box>
            {validViews.map((view) => (
              <StyledLink
                key={view}
                href={`/${view}`}
                sx={{
                  textDecoration: params.view === view ? 'underline' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {view}
              </StyledLink>
            ))}
          </Flex>
        </Column>
      </Row>
      <PreprintsView view={params.view} />
    </>
  )
}
