import { ImageResponse } from 'next/og'
import { theme } from '../theme/theme'
import BorderFrame from '../components/og-image/border-frame'
import Lockup from '../components/og-image/lockup'

export const runtime = 'edge'
export const contentType = 'image/png'
export const alt = 'CDRXIV - Preprints and Data for Carbon Dioxide Removal'

export const size = {
  width: 1200,
  height: 630,
}

const getPreprintCount = async () => {
  const preprints = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/?limit=1`,
    {
      cache: 'no-store',
    },
  )
  const data = await preprints.json()
  return data.count
}

const getFonts = async () => {
  const [quadrantItalic, gtPressura] = await Promise.all([
    fetch(
      'https://fonts.carbonplan.org/quadrant/QuadrantText-RegularItalic.otf',
      {
        next: { revalidate: false },
      },
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.carbonplan.org/gt_pressura_mono/GT-Pressura-Mono-Regular.otf',
      {
        next: { revalidate: false },
      },
    ).then((res) => res.arrayBuffer()),
  ])

  return [
    {
      name: 'Quadrant Italic',
      data: quadrantItalic,
    },
    {
      name: 'GT Pressura',
      data: gtPressura,
    },
  ]
}

export default async function Image() {
  const [fonts, preprintCount] = await Promise.all([
    getFonts(),
    getPreprintCount(),
  ])

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
            gap: '75px',
            paddingLeft: '50px',
            paddingRight: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Lockup width={1100} />
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
                color: theme?.colors?.blue as string,
                marginTop: '5px',
              }}
            >
              <div>Visit us on the</div>
              <div>world wide web!</div>
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
                Preprints Available
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
