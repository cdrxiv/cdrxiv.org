'use client'

import { Box } from 'theme-ui'

const faqData = [
  {
    question: 'Question 1',
    answer: 'Answer 1',
  },
  {
    question: 'Question 2',
    answer: 'Answer 2',
  },
]

const FAQ: React.FC = () => {
  return (
    <Box>
      {faqData.map(({ question, answer }) => (
        <Box key={question}>
          <Box as='h2'>{question}</Box>
          <Box>{answer}</Box>
        </Box>
      ))}
    </Box>
  )
}

export default FAQ
