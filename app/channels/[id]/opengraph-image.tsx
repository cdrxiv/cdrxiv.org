import { ImageResponse } from 'next/og'
import { theme } from '../../../theme/theme'
import BorderFrame from '../../../components/og-image/border-frame'
import { getFonts } from '../../../utils/og-fonts'
import LogoSVG from '../../../components/og-image/logo'
import { CHANNEL_PREFIX, CHANNELS } from '../../../utils/data'

export const runtime = 'edge'
export const contentType = 'image/png'
export const alt = 'CDRXIV channel social card'

export const size = {
  width: 1200,
  height: 630,
}

const fontConfig = [
  {
    url: 'https://fonts.carbonplan.org/quadrant/QuadrantText-RegularItalic.woff',
    name: 'Quadrant Italic',
  },
  {
    url: 'https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.woff',
    name: 'Quadrant Regular',
  },
  {
    url: 'https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.woff',
    name: 'GT Pressura',
  },
]

const getPreprintCount = async (id: string) => {
  const query = new URLSearchParams({
    search: `${CHANNEL_PREFIX}${id}`,
    limit: '1',
  })
  const preprints = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?${query.toString()}`,
    {
      cache: 'no-store',
    },
  )
  const data = await preprints.json()
  return data.count
}

export default async function Image({ params }: { params: { id: string } }) {
  const [fonts, preprintCount] = await Promise.all([
    getFonts(fontConfig),
    getPreprintCount(params.id),
  ])

  const channel = CHANNELS.find((c) => c.id === params.id)

  return new ImageResponse(
    (
      <BorderFrame>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            gap: '45px',
            paddingLeft: '50px',
            paddingRight: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '64px',
              marginTop: '10px',
            }}
          >
            <LogoSVG size={275} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '260px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'Quadrant Regular',
                  fontSize: '60px',
                  width: '800px',
                }}
              >
                <div>{channel?.label}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  fontSize: '40px',
                  fontFamily: 'Quadrant Italic',
                  color: theme?.colors?.blue as string,
                }}
              >
                <div>Special collection!</div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '50px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                fontSize: '40px',
                fontFamily: 'Quadrant Italic',
                color: 'transparent',
                marginTop: '5px',
                paddingRight: '107px',
              }}
            >
              <div>Special</div>
              <div>collection!</div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              {String(preprintCount)
                .padStart(5, '0')
                .split('')
                .map((digit, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '60px',
                      height: '80px',
                      backgroundColor: theme?.colors?.background as string,
                      borderTop: `3px solid ${theme?.colors?.text}`,
                      borderLeft: `3px solid ${theme?.colors?.text}`,
                      fontSize: '65px',
                      fontFamily: 'GT Pressura',
                    }}
                  >
                    <div style={{ marginTop: '-10px' }}>{digit}</div>
                  </div>
                ))}
              <div
                style={{
                  fontSize: '40px',
                  lineHeight: 1,
                  fontFamily: 'GT Pressura',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  width: '100px',
                  marginLeft: '10px',
                  display: 'flex',
                  height: '80px',
                  alignItems: 'center',
                  marginTop: '-5px',
                }}
              >
                {preprintCount === '1' ? 'Submissions' : 'Submission'}{' '}
                Contributed
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
