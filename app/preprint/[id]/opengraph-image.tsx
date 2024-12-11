import { ImageResponse } from 'next/og'
import { theme } from '../../../theme/theme'
import BorderFrame from '../../../components/og-image/border-frame'
import LogoSVG from '../../../components/og-image/logo'
import { Author, Preprint } from '../../../types/preprint'

export const runtime = 'nodejs'
export const revalidate = 604800 // 1 week

export const generateImageMetadata = async ({
  params,
}: {
  params: { id: string }
}) => {
  const preprint = await getPreprint(params.id)
  return [
    {
      id: 1, // preview at /opengraph-image/1
      type: 'image/png',
      size,
      alt: `${preprint.title} by ${formatAuthors(preprint.authors)} - ${formatPublishedDate(preprint.date_published)} | CDRXIV`,
    },
  ]
}

export const size = {
  width: 1200,
  height: 630,
}

const getPreprint = async (id: string): Promise<Preprint> => {
  const preprints = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/${id}`,
  )
  const data = await preprints.json()
  return data
}

const getFonts = async () => {
  const [quadrant, gtPressura] = await Promise.all([
    fetch('https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.otf', {
      next: { revalidate: false },
    }).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.otf',
      {
        next: { revalidate: false },
      },
    ).then((res) => res.arrayBuffer()),
  ])

  return [
    {
      name: 'Quadrant',
      data: quadrant,
    },
    {
      name: 'GT Pressura',
      data: gtPressura,
    },
  ]
}

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

const Badge = ({
  children,
  color,
}: {
  children: React.ReactNode
  color: string
}) => {
  return (
    <div
      style={{
        padding: '0px 10px 6px 10px',
        backgroundColor: color,
        lineHeight: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

const formatAuthors = (authors: Author[]): string => {
  if (!authors?.length) return ''
  const fullAuthorString = authors
    .map((author) =>
      [author?.first_name || '', author?.last_name || '']
        .filter((name) => name.length > 0)
        .join(' '),
    )
    .join(', ')
  if (fullAuthorString.length < 40) {
    return fullAuthorString
  }
  const firstAuthor = authors[0]
  return `${firstAuthor?.last_name || ''} et al.`
}

const getSubmissionType = (
  preprint: Preprint | null,
  fieldName: string,
): string | null => {
  if (!preprint) {
    return null
  }
  const additionalField = preprint.additional_field_answers.find(
    (field) => field.field?.name === fieldName,
  )
  if (!additionalField) {
    return null
  }
  return additionalField.answer
}
export const submissionTypes = (
  preprint: Preprint,
): { label: string; color: string }[] => {
  const type = getSubmissionType(preprint, 'Submission type')

  return [
    { label: 'Article', color: 'pink' },
    { label: 'Data', color: 'green' },
  ].filter((badge) =>
    [badge.label, 'Both'].find((el) => type?.match(new RegExp(el, 'i'))),
  )
}

const formatPublishedDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-').map((num) => parseInt(num))
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

export default async function Image({ params }: { params: { id: string } }) {
  const [fonts, preprint] = await Promise.all([
    getFonts(),
    getPreprint(params.id),
  ])
  const submissionType = submissionTypes(preprint)

  return new ImageResponse(
    (
      <BorderFrame>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '50px',
            bottom: '50px',
            right: '75px',
            left: '75px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '60px',
                fontFamily: 'Quadrant',
              }}
            >
              {preprint.title}
            </div>
            <div
              style={{
                fontSize: '40px',
                fontFamily: 'GT Pressura',
                display: '-webkit-box',
                WebkitLineClamp: 1, // fallback for character limit
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatAuthors(preprint.authors)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <LogoSVG size={175} />
            <div
              style={{
                fontSize: '44px',
                fontFamily: 'GT Pressura',
                letterSpacing: '0.03em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '17px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {formatPublishedDate(preprint.date_published)}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'flex-end',
                }}
              >
                {submissionType.map((type) => (
                  <Badge
                    key={type.label}
                    color={theme?.colors?.[type.color] as string}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BorderFrame>
    ),
    {
      ...size,
      fonts,
    },
  )
}
