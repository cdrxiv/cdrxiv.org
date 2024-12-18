import { ImageResponse } from 'next/og'
import { theme } from '../../../theme/theme'
import BorderFrame from '../../../components/og-image/border-frame'
import LogoSVG from '../../../components/og-image/logo'
import Badge from '../../../components/og-image/badge'
import { Author, Preprint } from '../../../types/preprint'
import {
  formatDate,
  authorList,
  submissionTypes,
} from '../../../utils/formatters'

export const contentType = 'image/png'
export const alt = 'CDRXIV submission social card'

export const size = {
  width: 1200,
  height: 630,
}

const getPreprint = async (id: string): Promise<Preprint> => {
  const preprints = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/${id}`,
    {
      cache: 'no-store',
    },
  )
  const data = await preprints.json()
  return data
}

const getFonts = async () => {
  const [quadrant, gtPressura] = await Promise.all([
    fetch('https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.otf', {
      cache: 'force-cache',
    }).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.otf',
      {
        cache: 'force-cache',
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

const formatAuthors = (authors: Author[]): string => {
  if (!authors?.length) return ''
  const fullAuthorString = authorList(authors)
  if (fullAuthorString.length < 35) {
    return fullAuthorString
  }
  return authorList(authors, { abbreviate: true })
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
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    },
  )
}
