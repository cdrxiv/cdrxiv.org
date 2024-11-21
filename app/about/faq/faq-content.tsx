'use client'

import React, { useEffect } from 'react'
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
    question: 'Are CDRXIV submissions peer-reviewed?',
    answer:
      'No. CDRXIV does not conduct peer review for submissions, but we do [screen](/about/screening) submissions to ensure they comply with basic  scope, safety, privacy, and anti-plagiarism requirements. Upon publication in a peer-reviewed journal, authors are encouraged to update their CDRXIV submission to include the DOI for the published article so CDRXIV readers may easily find the peer-reviewed version.',
    tags: ['general'],
    slug: 'are-submissions-peer-reviewed',
  },
  {
    question: 'What content will CDRXIV consider publishing?',
    answer:
      'CDRXIV will consider preprint articles and data that represent new research results on human-driven carbon dioxide removal. For more information on the format and scope of submissions we consider, see the CDRXIV [scope](/about/scope) page.',
    tags: ['general'],
    slug: 'what-content-will-cdrxiv-consider',
  },
  {
    question: 'Can I submit a dataset without a related preprint article?',
    answer:
      'Yes. CDRXIV accepts data submissions even if they are not accompanied by a preprint article. These data-only submissions still require an abstract which describes the provenance and contents of the data files. See our [screening process](/about/screening) for more information on the requirements for data submissions.',
    tags: ['submissions-data'],
    slug: 'submit-dataset-without-preprint',
  },
  {
    question: 'What is the maximum file size I can submit?',
    answer:
      'Preprint files must be PDFs less than 3 GB, and data files must be less than 10 GB. Data must be submitted as a single file. If you have multiple files, please compress them into a zip file before submitting.',
    tags: ['submissions', 'submissions-article', 'submissions-data'],
    slug: 'maximum-file-size',
  },
  {
    question: 'How long does it take for my submission to be publicly posted?',
    answer:
      'Our screening and approval process is usually complete within 1-4 business days. We will notify you when your submission is publicly posted, or if the screening process is prolonged for any reason.',
    tags: ['general'],
    slug: 'submission-posting-time',
  },
  {
    question: 'What are CDRXIV’s rules for authorship?',
    answer: `
If authors are planning to eventually submit their preprint to a journal, we encourage them to consult the authorship guidelines of the journal. We also recognize that not all CDRXIV submissions are destined for peer-reviewed publication. With this in mind, CDRXIV has a few of its own rules around authorship.

CDRXIV requires that authors are individuals. Companies or other institutions cannot serve as authors. In the interest of clear provenance around data and methods, the author list should include those who played a prominent role in the substance of the contribution (such as data collection, model simulations, and idea formulation). See the Contributor Role Taxonomy ([CRediT](https://credit.niso.org/)) for a list of contribution types that may warrant authorship. 

Because there can be some ambiguity around authorship, especially for data submissions without a written manuscript, we’re happy to discuss authorship considerations on a case-by-case basis. If that’s needed, please reach out to us at [support@cdrxiv.org](mailto:support@cdrxiv.org). 
`,
    tags: ['general', 'submissions'],
    slug: 'authorship-rules',
  },
  {
    question: 'How do I create a CDRXIV account?',
    answer: `
You will need an account to submit content to CDRXIV. You can visit the [account page](/account) to [create a new account](/register). Once you create your account, check your email for an activation link, which will allow you to use your new account to log into Janeway and authenticate with CDRXIV.

If there is an existing account associated with your email, you can [use the Janeway system](${process.env.NEXT_PUBLIC_JANEWAY_URL}/reset/step/1/) to reset your password.
    `,
    tags: ['general', 'account'],
    slug: 'account-creation',
  },
  {
    question: 'How do I log into my CDRXIV account using Janeway?',
    answer: `
CDRXIV relies on Janeway for authentication. To access your account, visit the [account page](/account) and follow the directions to log in on the Janeway website. If you do not have an active Janeway session, you will be prompted for your email and password. 

If you see a confirmation page with account information, this means that your last session is still active with Janeway. If you’d like to use CDRXIV with a different account, you should clear your cookies or use a new browser, after which you should be prompted for your email and password.
`,
    tags: ['general', 'account'],
    slug: 'account-log-in',
  },
  {
    question: 'What license options are available for my CDRXIV submission?',
    answer:
      'You can select your preferred license from a list on the submission page. Articles and data can be licensed differently, even if they’re part of the same submission. The article license options are: CC-BY, CC-BY-NC, and All Rights Reserved. The data license options are CC-BY and CC-BY-NC.',
    tags: ['submissions', 'submissions-article', 'submissions-data'],
    slug: 'license-options',
  },
  {
    question: 'Does CDRXIV accept postprints?',
    answer:
      'No. CDRXIV does not accept submissions of content that has already been published elsewhere.',
    tags: ['general'],
    slug: 'postprints',
  },
  {
    question: 'Can I submit to multiple preprint servers?',
    answer:
      'No. CDRXIV does not accept submissions that are already posted elsewhere. Submitting to multiple preprint servers makes it difficult to keep versions up-to-date, track engagement metrics, and find the appropriate version of an article when searching the web.',
    tags: ['general', 'submissions', 'submissions-article'],
    slug: 'multiple-preprint-servers',
  },
  {
    question: 'Can I remove my content from CDRXIV after it’s been posted?',
    answer:
      'No. Your content receives a DOI when it is posted on CDRXIV, making it discoverable in the public record and linked to that unique identifier in perpetuity. If you feel there is a need to add a withdrawal notice to your content, please contact [support@cdrxiv.org](mailto:support@cdrxiv.org).',
    tags: ['general', 'submissions'],
    slug: 'withdraw-submission',
  },
  {
    question: 'Can I update my submission?',
    answer: `
Yes. In the [account page](/account), you can view a list of all of your previous [submissions](/submissions). You will find an option to submit a revision on the right side of each of your submitted titles. 

Submitting a revision can take three forms:
1. **New version**: You can submit a new version of the preprint. This is a significant update consistent with changes made in response to peer review, for example. 
2. **Text correction**: You can submit minor updates to the text to fix small errors.
3. **Metadata correction**: You can submit an update to the submission metadata, including the abstract text or authors list, without making a change to the originally submitted article or data files.

If you are unsure about which revision type to use, contact [support@cdrxiv.org](mailto:support@cdrxiv.org). 
`,
    tags: ['general', 'submissions'],
    slug: 'update-submission',
  },
  {
    question: 'Is there a fee to publish content on CDRXIV?',
    answer: 'No. It is free to submit and publish content through CDRXIV.',
    tags: ['submissions'],
    slug: 'publish-fee',
  },
  {
    question: 'How is CDRXIV funded?',
    answer:
      'CDRXIV is philanthropically funded. We do not accept any funding from any parties who have a commercial interest in CDR.',
    tags: ['general'],
    slug: 'cdrxiv-funding',
  },
  {
    question: 'Who can view my submission after it’s published on CDRXIV?',
    answer:
      'Anyone that visits CDRXIV. Published content on CDRXIV is freely available to view and download without restrictions.',
    tags: ['submissions'],
    slug: 'submission-viewing',
  },
  {
    question: 'Who is responsible for content that appears on CDRXIV?',
    answer:
      'Authors are solely responsible for the posted content. CDRXIV assumes no responsibility. See our [Terms of Use](/terms-of-use) for more information.',
    tags: ['general'],
    slug: 'content-responsibility',
  },
  {
    question: 'Will CDRXIV content be accessible long-term?',
    answer:
      'Yes. CDRIXIV is designed to create a long-term archive of preprint and data submissions. Preprints are stored on [Digital Ocean](https://www.digitalocean.com/) and data is stored on [Zenodo](https://zenodo.org/communities/cdrxiv/).',
    tags: ['general'],
    slug: 'long-term-accessibility',
  },
  {
    question: 'How do I cite CDRXIV content?',
    answer: `
Use the Digital Object Identifier (DOI) to cite content on CDRXIV. You can use a version-specific DOI and URL for submissions that have more than one version.

_Example:_ Author A. 2024. Article title. CDRXIV doi: 10.70212/cdrxiv.5555.

Keep in mind that CDRXIV content is not peer reviewed. Unless you have a specific reason to do so, we encourage you to cite the peer reviewed journal version of an article if one exists.
`,
    tags: ['general'],
    slug: 'citations',
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
      {filteredFAQs.map((faq, index) => (
        <Box key={index} sx={{ mb: [4, 4, 7, 7] }} id={faq.slug}>
          <Box as='h3'>{faq.question}</Box>
          <ReactMarkdown>{faq.answer}</ReactMarkdown>
        </Box>
      ))}
    </>
  )
}

export default FAQContent
