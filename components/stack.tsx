import React from 'react'
import Row from './row'
import Column from './column'
import { Flex, Box } from 'theme-ui'
import Card from './card'
import { Preprints } from '../types/preprint'

interface StackProps {
  preprints: Preprints
}

const Stack: React.FC<StackProps> = ({ preprints }) => {
  const groupSize = 4
  const groupsPerRow = 3

  return (
    <Box sx={{ mt: 4 }}>
      {Array.from(
        { length: Math.ceil(preprints.length / (groupSize * groupsPerRow)) },
        (_, rowIndex) => (
          <Row key={rowIndex} columns={[12]} gap={4} sx={{ mt: 3 }}>
            {Array.from({ length: groupsPerRow }, (_, groupIndex) => {
              const startIndex =
                rowIndex * groupSize * groupsPerRow + groupIndex * groupSize
              const groupPreprints = preprints.slice(
                startIndex,
                startIndex + groupSize,
              )

              return groupPreprints.length > 0 ? (
                <Column key={groupIndex} start={1 + groupIndex * 4} width={4}>
                  <Flex
                    sx={{
                      flexDirection: 'column',
                      position: 'relative',
                      height: '500px',
                    }}
                  >
                    {[...groupPreprints].reverse().map((preprint, i) => (
                      <Card
                        key={preprint.title}
                        title={preprint.title}
                        authors={preprint.authors}
                        type={'article'}
                        date={
                          preprint.date_published
                            ? new Date(preprint.date_published)
                            : null
                        }
                        sx={{
                          position: 'absolute',
                          left: `${(groupSize - 1 - i) * 40}px`,
                          top: `${i * 40}px`, // Adjust this value to control vertical stacking
                          zIndex: i + 1,
                        }}
                      />
                    ))}
                  </Flex>
                </Column>
              ) : null
            })}
          </Row>
        ),
      )}
    </Box>
  )
}

export default Stack
