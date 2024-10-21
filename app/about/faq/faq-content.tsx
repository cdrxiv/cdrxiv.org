'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Box } from 'theme-ui'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ValidTag } from './tag-selector'
import { useTag } from './tag-selector'

interface FAQ {
  question: string
  answer: string // markdown
  slug: string
  tags: ValidTag[]
}

const faqData: FAQ[] = [
  {
    question: 'Are preprints peer-reviewed?',
    answer:
      'Not necessarily. Preprint articles are often submitted to CDRXIV and to a peer-reviewed journal at the same time. CDRXIV does not conduct peer review for any submissions but we do screen submissions for basic requirements and scope. Upon publication in a peer-reviewed journal, authors are encouraged to update their CDRXIV submission to include the DOI that links to the published article so CDRXIV readers may find it.',
    tags: ['general'],
    slug: 'are-preprints-peer-reviewed',
  },
  {
    question: 'Can I submit a dataset without a related preprint article?',
    answer:
      'Yes. CDRXIV accepts data submissions even if they are not tied to a preprint article. These data-only submissions still require an abstract, which functions as a brief description of what the data files contain. Your dataset will be deposited in the CDRXIV Zenodo community and given a DOI. See our screening process for more information on data-only expectations.',
    tags: ['submissions-data'],
    slug: 'submit-dataset-without-preprint',
  },
  {
    question: 'What is the maximum file size I can submit?',
    answer:
      'Article files must be less than 1 GB, data files must be less than 10 GB?',
    tags: ['submissions', 'submissions-article', 'submissions-data'],
    slug: 'maximum-file-size',
  },
  {
    question: 'How long does it take for my submission to be publicly posted?',
    answer:
      'Our screening and approval process is usually complete within 1-4 business days. We will notify you if it will take longer for any reason.',
    tags: ['general'],
    slug: 'submission-posting-time',
  },
  {
    question: 'How do I create a login or change my password?',
    answer:
      'You will need an account to submit content to CDRXIV. To do so, navigate to account, click "create a new account", and enter the information. To reset your password… [TK]',
    tags: ['general', 'account'],
    slug: 'create-login-change-password',
  },
  {
    question: 'What license options are available for my CDRXIV submission?',
    answer:
      "You can select your preferred license from a present list. Articles and data can be licensed differently, even if they're part of the same submission. The article license options are: CC-BY, CC-BY-NC, CC-BY-SA, and CC0. The data license options are the same plus the MIT license.",
    tags: ['submissions', 'submissions-article', 'submissions-data'],
    slug: 'license-options',
  },
  {
    question: 'Can I submit to multiple preprint servers?',
    answer:
      "We don't recommend it and CDRXIV will not accept submissions that are already posted elsewhere. Submitting to multiple preprint servers creates a downstream mess of keeping versions up to date, tracking metrics, and cluttering search results on sites like Google Scholar. It also creates a challenge for readers who have to navigate this to find the appropriate version of an article.",
    tags: ['general', 'submissions', 'submissions-article'],
    slug: 'submit-multiple-preprint-servers',
  },
  {
    question: "Can I remove my content from CDRXIV after it's been posted?",
    answer:
      'No. Your content receives a DOI when it is posted on CDRXIV, making it discoverable in the public record and linked to that unique identifier in perpetuity. There are some instances where an author might want to withdraw content, for example if they find a fundamental error. In this case, the author can submit a notice stating the reason for withdrawal, which will be shown whenever someone navigates to the DOI link. The original document, with a "withdrawal" disclaimer, will still be discoverable as an earlier version. In rare cases, we may remove content if it poses legal or safety concerns.',
    tags: ['general', 'submissions'],
    slug: 'remove-content-after-posting',
  },
  {
    question: 'How can I update my submission?',
    answer:
      'There are three paths for updating content that already exists on CDRXIV. A major update that involves a new title and findings may be considered as a new submission. A minor update in-line with revisions in the peer review process is usually considered as a new version of the same submission. A very small update, like correcting the name of an author, can be done without creating a new version. If you are unsure whether your update is major or minor, submit it as a new version and a CDRXIV editor will make the final decision. If you believe your update is "very small", contact support@CDRXIV.org for assistance.',
    tags: ['general', 'submissions'],
    slug: 'update-submission',
  },
  {
    question: 'Who is responsible for content that appears on CDRXIV?',
    answer:
      "The content's authors are solely responsible for the posted content. CDRXIV assumes no responsibility. See our Terms of Use for more information.",
    tags: ['general'],
    slug: 'content-responsibility',
  },
]

const FAQContent: React.FC = () => {
  const params = useParams()
  const { selectedTag } = useTag()
  const filteredFAQs =
    selectedTag !== 'All'
      ? faqData.filter((faq) => faq.tags.includes(selectedTag as ValidTag))
      : faqData

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const scrollToElement = () => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
      requestAnimationFrame(scrollToElement)
    }
  }, [params])

  return (
    <>
      <Box as='h2' sx={{ mb: 4 }}>
        Frequently Asked Questions
      </Box>
      {filteredFAQs.map((faq, index) => (
        <Box key={index} sx={{ mb: 4 }} id={faq.slug}>
          <Box as='h3'>{faq.question}</Box>
          <ReactMarkdown>{faq.answer}</ReactMarkdown>
        </Box>
      ))}
    </>
  )
}

export default FAQContent
