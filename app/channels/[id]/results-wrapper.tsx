'use client'

import { Box, Link, Flex, Divider } from 'theme-ui'
import { Column, Row } from '../../../components'
import ViewSelector from '../../view-selector'
interface ResultsWrapperProps {
  count: number
  children?: React.ReactNode
  label: string
  shortDescription: string
  description: React.ReactNode
}

const ResultsWrapper: React.FC<ResultsWrapperProps> = ({
  count,
  label,
  shortDescription,
  description,
  children,
}) => {
  return (
    <>
      <Row columns={[6, 8, 12, 12]} sx={{ mt: 4, mb: [4, 4, 8, 8] }}>
        <Column start={1} width={3}>
          <Box sx={{ variant: 'styles.h1', mb: 4 }}>{label}</Box>
          <Divider
            sx={{ my: 4, display: ['none', 'none', 'inherit', 'inherit'] }}
          />
          <Box sx={{ variant: 'text.mono', mb: 10 }}>{shortDescription}</Box>
        </Column>
        <Column start={5} width={6}>
          <Box sx={{ mb: 8, mt: 2 }}>{description}</Box>
        </Column>

        <Column start={1} width={6}>
          <Flex
            sx={{
              gap: [0, 0, 6, 6],
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              flexDirection: ['column', 'column', 'row', 'row'],
            }}
          >
            <Box sx={{ variant: 'text.monoCaps' }}>
              Submissions ({count} total)
            </Box>
            <ViewSelector />
          </Flex>
        </Column>
      </Row>
      {children}
    </>
  )
}

export default ResultsWrapper
