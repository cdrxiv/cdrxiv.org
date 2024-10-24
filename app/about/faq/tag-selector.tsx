import React, { createContext, useState, useContext } from 'react'
import { Box, Flex } from 'theme-ui'

const tagLabels = {
  All: 'All',
  general: 'General',
  account: 'Account',
  submissions: 'Submissions',
  'submissions-article': 'Article submissions',
  'submissions-data': 'Data submissions',
} as const

export type ValidTag = keyof typeof tagLabels

const tags = Object.keys(tagLabels) as ValidTag[]

interface TagContextType {
  selectedTag: ValidTag
  setSelectedTag: (tag: ValidTag) => void
}

const TagContext = createContext<TagContextType | undefined>(undefined)

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTag, setSelectedTag] = useState<ValidTag>('All')

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

const Tag: React.FC<{
  tag: ValidTag
  isSelected: boolean
  onClick: () => void
}> = ({ tag, isSelected, onClick }) => (
  <Box
    as='button'
    role='option'
    onClick={onClick}
    sx={{
      display: 'block',
      variant: 'text.body',
      cursor: 'pointer',
      width: 'fit-content',
      padding: 0,
      border: 'none',
      textAlign: 'left',
      bg: isSelected ? 'highlight' : 'transparent',
      mb: '2px',
      ':hover': {
        bg: 'highlight',
      },
    }}
  >
    {tagLabels[tag]}
  </Box>
)

export const TagSelector = () => {
  const { selectedTag, setSelectedTag } = useTag()

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
        role='listbox'
        aria-label='FAQ topics'
      >
        {tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            isSelected={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          />
        ))}
      </Flex>
    </>
  )
}
