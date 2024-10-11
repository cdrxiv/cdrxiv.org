import React, { createContext, useState, useContext } from 'react'
import { Box, Flex } from 'theme-ui'

export type ValidTag =
  | 'general'
  | 'account'
  | 'submissions'
  | 'submissions-article'
  | 'submissions-data'

const tags: ValidTag[] = [
  'general',
  'account',
  'submissions',
  'submissions-article',
  'submissions-data',
]

interface TagContextType {
  selectedTag: ValidTag | null
  setSelectedTag: (tag: ValidTag | null) => void
}

const TagContext = createContext<TagContextType | undefined>(undefined)

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTag, setSelectedTag] = useState<ValidTag | null>(null)

  return (
    <TagContext.Provider value={{ selectedTag, setSelectedTag }}>
      {children}
    </TagContext.Provider>
  )
}

export const useTag = () => {
  const context = useContext(TagContext)
  if (context === undefined) {
    throw new Error('useTag must be used within a TagProvider')
  }
  return context
}

export const TagSelector = () => {
  const { selectedTag, setSelectedTag } = useTag()

  const renderTag = (tag: ValidTag | 'All') => (
    <Box
      as='button'
      onClick={() => setSelectedTag(tag === 'All' ? null : tag)}
      key={tag}
      sx={{
        display: 'block',
        variant: 'text.body',
        cursor: 'pointer',
        width: 'fit-content',
        padding: 0,
        border: 'none',
        textAlign: 'left',
        bg:
          selectedTag === tag || (tag === 'All' && selectedTag === null)
            ? 'highlight'
            : 'transparent',
        mb: '2px',
        ':hover': {
          bg: 'highlight',
        },
      }}
    >
      {tag}
    </Box>
  )

  return (
    <>
      <Box variant='text.monoCaps' sx={{ mt: 5 }}>
        Topics
      </Box>
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 2,
          mt: 5,
        }}
      >
        {renderTag('All')}
        {tags.map((tag) => renderTag(tag))}
      </Flex>
    </>
  )
}
