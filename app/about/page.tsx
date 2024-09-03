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

const About = () => {
  return (
    <Box>
      <Box variant='text.heading' sx={{ my: 3 }}>
        About CDRXIV
      </Box>
      <Box variant='text.body' sx={{ mb: 3 }}>
        CDRXIV is a preprint and data server for the Carbon Dioxide Removal
        community.
      </Box>
      <Box variant='text.heading' sx={{ fontSize: [4, 4, 4, 5] }}>
        FAQ
      </Box>
      {faqData.map((faq, i) => (
        <Box key={i} id={`faq-${i + 1}`} sx={{ my: 3 }}>
          <Box as='h3' sx={{ mb: 2 }}>
            {faq.question}
          </Box>
          <Box variant='text.body'>{faq.answer}</Box>
        </Box>
      ))}
    </Box>
  )
}

export default About
