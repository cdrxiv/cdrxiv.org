import { ImageResponse } from 'next/og'
import { theme } from '../../../theme/theme'
import BorderFrame from '../../../components/og-image/border-frame'
import LogoSVG from '../../../components/og-image/logo'
import { Author, Preprint } from '../../../types/preprint'

export const runtime = 'nodejs' // required for revalidation parameter
export const revalidate = 604800 // 1 week
export const size = {
  width: 1200,
  height: 630,
}

export const generateImageMetadata = async ({
  params,
}: {
  params: { id: string }
}) => {
  const preprint = await getPreprint(params.id)
  return [
    {
      id: 1, // preview at /opengraph-image/1
      contentType: 'image/png',
      size,
      alt: `${preprint.title} by ${formatAuthors(preprint.authors)}${
        preprint.date_published
          ? ` - ${formatDate(new Date(preprint.date_published))}`
          : ''
      } | CDRXIV`,
    },
  ]
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
  if (fullAuthorString.length < 35) {
    return fullAuthorString
  }
  const firstAuthor = authors[0]
  return `${firstAuthor?.last_name || ''} et al.`
}

export const submissionTypes = (
  preprint: Preprint | null,
): { label: string; color: string }[] => {
  if (!preprint) return []

  const additionalField = preprint.additional_field_answers.find(
    (field) => field.field?.name === 'Submission type',
  )
  const type = additionalField?.answer

  return [
    { label: 'Article', color: 'pink' },
    { label: 'Data', color: 'green' },
  ].filter((badge) =>
    [badge.label, 'Both'].find((el) => type?.match(new RegExp(el, 'i'))),
  )
}

export const formatDate = (
  date: Date,
  dateOptions?: Intl.DateTimeFormatOptions,
): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: dateOptions?.year ?? 'numeric',
    month: dateOptions?.month ?? 'long',
    day: dateOptions?.day ?? 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export default async function Image({ params }: { params: { id: string } }) {
  const [fonts, preprint] = await Promise.all([
    getFonts(),
    getPreprint(params.id),
  ])

  return new ImageResponse(
    (
      <BorderFrame>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            paddingLeft: '50px',
            paddingRight: '50px',
            paddingTop: '100px',
            paddingBottom: '100px',
            gap: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '175px',
            }}
          >
            <LogoSVG size={175} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-between',
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
                  paddingTop: '10px',
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '44px',
                fontFamily: 'GT Pressura',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                }}
              >
                {submissionTypes(preprint).map((type) => (
                  <Badge
                    key={type.label}
                    color={theme?.colors?.[type.color] as string}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
              <div>
                {preprint.date_published
                  ? formatDate(new Date(preprint.date_published), {
                      month: 'short',
                    })
                  : ''}
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
