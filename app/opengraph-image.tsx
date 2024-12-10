import { ImageResponse } from 'next/og'
import { theme } from '../theme/theme'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const getPreprintCount = async () => {
  const preprints = await fetch(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints`,
  )
  const data = await preprints.json()
  return data.count
}

const LogoSVG = ({ size }: { size: number }) => (
  <svg
    id='Layer_1'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 500 500'
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
  >
    <path
      style={{ fill: theme?.colors?.background as string }}
      d='M0,0v499.99427h500L0,0Z'
    />
    <path d='M101.06544,166.91651c6.15104,5.92834,9.56061,12.67068,10.23638,20.22702h-11.74918c-1.30546-5.72868-3.91639-10.27477-7.81743-13.6229-3.90871-3.36349-9.39166-5.03756-16.44885-5.03756-8.60839,0-15.55806,3.08704-20.84903,9.24576-5.29865,6.15872-7.94029,15.60414-7.94029,28.33625,0,10.42836,2.38823,18.89084,7.17237,25.37208,4.77646,6.4966,11.90276,9.73723,21.38658,9.73723,8.72357,0,15.37376-3.40957,19.93521-10.24406,2.41895-3.59387,4.22356-8.3089,5.41384-14.17581h11.74918c-1.03669,9.36863-4.4693,17.23213-10.29781,23.55979-6.98807,7.63313-16.41045,11.45737-28.25946,11.45737-10.22102,0-18.79869-3.13311-25.74836-9.39934-9.13825-8.27818-13.70738-21.07173-13.70738-38.36529,0-13.13144,3.4326-23.89768,10.29781-32.29872,7.41811-9.13825,17.65448-13.6997,30.70913-13.6997,11.13484,0,19.77394,2.96417,25.91731,8.90787Z' />
    <path d='M42.40402,264.18128h35.57006c12.07171,0,21.43265,4.33107,28.09052,13.02393,5.93602,7.83279,8.90019,17.86182,8.90019,30.10247,0,9.44542-1.75086,17.98469-5.25257,25.61782-6.18176,13.48468-16.80209,20.22702-31.86101,20.22702h-35.4472v-88.97123ZM75.60889,342.86238c3.98551,0,7.26452-.43004,9.82938-1.27475,4.5768-1.58192,8.33193-4.60752,11.25003-9.09217,2.33448-3.59387,4.00854-8.18603,5.03756-13.8072.5913-3.34813.88311-6.46589.88311-9.32255,0-11.02733-2.1425-19.58196-6.41981-25.67925-4.28499-6.09729-11.1886-9.15361-20.70313-9.15361h-20.90279v68.32954h21.02565Z' />
    <path d='M43.31784,367.92729h40.43868c6.66555,0,12.15618.98294,16.47957,2.96417,8.20907,3.79353,12.30976,10.79696,12.30976,21.0103,0,5.32937-1.09813,9.69115-3.30206,13.08536-2.20393,3.39421-5.27561,6.128-9.23808,8.18603,3.471,1.41297,6.08961,3.27134,7.84814,5.55974,1.75086,2.30376,2.7338,6.05121,2.93346,11.21163l.42236,11.93348c.12287,3.39421.407,5.91299.85239,7.57169.72952,2.82595,2.01963,4.63824,3.878,5.45223v1.99659h-14.78246c-.39932-.76792-.72184-1.75086-.96758-2.96417-.24573-1.21331-.44539-3.56315-.60666-7.03415l-.72952-14.83622c-.26877-5.82083-2.37287-9.70651-6.28927-11.68775-2.24233-1.09045-5.75172-1.64335-10.53586-1.64335h-26.66219v38.16563h-12.04867v-88.97123ZM82.46641,408.6885c5.49063,0,9.84474-1.13652,13.04696-3.39421,3.19455-2.25769,4.7995-6.34302,4.7995-12.24065,0-6.32766-2.24233-10.65873-6.7193-12.96249-2.39591-1.19796-5.59046-1.81229-9.599-1.81229h-28.62806v30.40964h27.0999Z' />
    <path d='M136.4512,456.89852h-14.48297l31.49241-45.64518-29.51885-43.32606h15.0282l22.44631,34.03422,22.26969-34.03422h14.30635l-29.51117,43.32606,30.95486,45.64518h-14.91301l-23.7057-36.58372-24.36611,36.58372Z' />
    <path d='M209.45737,367.92729h12.17921v88.97123h-12.17921v-88.97123Z' />
    <path d='M245.77232,367.92729l25.56406,75.763,25.25689-75.763h13.50772l-32.46767,88.97123h-12.77819l-32.40623-88.97123h13.32342Z' />
    <path d='M11.74146,28.34462l459.91105,459.90818H11.74146V28.34462M0,0v499.99427h500L0,0h0Z' />
  </svg>
)

const getFonts = async () => {
  const [quadrant, quadrantItalic, gtPressura] = await Promise.all([
    fetch('https://fonts.carbonplan.org/quadrant/QuadrantText-Regular.otf', {
      next: { revalidate: false },
    }).then((res) => res.arrayBuffer()),
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
      name: 'Quadrant',
      data: quadrant,
    },
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
  const fonts = await getFonts()
  const preprintCount = await getPreprintCount()

  const borderWidth = 7

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme?.colors?.muted as string,
          color: theme?.colors?.text as string,
          position: 'relative',
          border: '2px solid',
          borderColor: theme?.colors?.listBorderGrey as string,
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Main borders */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: `${borderWidth}px`,
              height: '100%',
              backgroundColor: theme?.colors?.text as string,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${borderWidth}px`,
              backgroundColor: theme?.colors?.listBorderGrey as string,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${borderWidth}px`,
              height: '100%',
              backgroundColor: theme?.colors?.listBorderGrey as string,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${borderWidth}px`,
              backgroundColor: theme?.colors?.text as string,
            }}
          />
          {/* Corner overlays */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: `${borderWidth}px`,
              height: `${borderWidth}px`,
              background: `linear-gradient(-45deg, 
                ${theme?.colors?.text} 0%, 
                ${theme?.colors?.text} 49.9%, 
                transparent 50%, 
                transparent 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${borderWidth}px`,
              height: `${borderWidth}px`,
              background: `linear-gradient(-45deg, 
                transparent 0%, 
                transparent 49.9%, 
                ${theme?.colors?.listBorderGrey} 50%, 
                ${theme?.colors?.listBorderGrey} 100%)`,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            fontSize: '88px',
            fontFamily: 'Quadrant',
          }}
        >
          <div style={{ display: 'flex' }}>
            <LogoSVG size={245} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div>Preprints and</div>
            <div>Data for Carbon</div>
            <div>Dioxide Removal</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginTop: '30px',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '36px',
              fontFamily: 'Quadrant Italic',
              color: theme?.colors?.blue as string,
              marginRight: '50px',
            }}
          >
            <div>Visit us on the</div>
            <div>world wide web!</div>
          </div>
          <div style={{ display: 'flex' }}>
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
                    borderTop: `2px solid ${theme?.colors?.text}`,
                    borderLeft: `2px solid ${theme?.colors?.text}`,
                    borderBottom: `2px solid ${theme?.colors?.listBorderGrey}`,
                    borderRight: `2px solid ${theme?.colors?.listBorderGrey}`,
                    fontSize: '55px',
                    lineHeight: 1,
                    fontFamily: 'GT Pressura',
                  }}
                >
                  {digit}
                </div>
              ))}
            <div
              style={{
                fontSize: '36px',
                lineHeight: 1,
                fontFamily: 'GT Pressura',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                width: '100px',
                marginLeft: '10px',
              }}
            >
              Preprints Submitted
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  )
}
