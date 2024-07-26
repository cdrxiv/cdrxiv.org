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
        <Column start={1} width={[8, 6, 4, 4]}>
          <Flex sx={{ my: 8, justifyContent: 'space-between' }}>
            <Box sx={{ variant: 'text.monoCaps' }}>Recent preprints</Box>
            <StyledLink href={'/stack'}>Stack</StyledLink>
            <StyledLink href={'/grid'}>Grid</StyledLink>
            <StyledLink href={'/list'}>List</StyledLink>
          </Flex>
        </Column>
      </Row>
      <Row sx={{ mt: 3 }}>
        <Column start={1} width={[6, 8, 12, 12]}>
          <PreprintsView view={params.view} />
        </Column>
      </Row>
    </>
  )
}
