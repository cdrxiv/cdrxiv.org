import { SVGProps, useState } from 'react'
import { Box, BoxProps, get, Link, useThemeUI } from 'theme-ui'
import useBackgroundColors from '../hooks/use-background-colors'

type GBoxProps = BoxProps & SVGProps<SVGGElement>
const GBox: React.FC<GBoxProps> = (props) => <Box as='g' {...props} />

type SVGBoxProps = BoxProps & SVGProps<SVGSVGElement>
const SVGBox: React.FC<SVGBoxProps> = (props) => <Box as='svg' {...props} />

type PathBoxProps = BoxProps & SVGProps<SVGPathElement>
const PathBox: React.FC<PathBoxProps> = (props) => <Box as='path' {...props} />

const foldSize = 100

interface PageCornerProps {
  onToggle?: () => void
  isHomePage: boolean
}

const PageCorner: React.FC<PageCornerProps> = ({ onToggle, isHomePage }) => {
  const { theme } = useThemeUI()
  const { overallBackground } = useBackgroundColors()
  const [hovered, setHovered] = useState<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      event.preventDefault()
      onToggle?.()
    }
  }

  return (
    <Link
      href='/'
      onClick={handleClick}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <SVGBox
        viewBox={`0 0 ${foldSize} ${foldSize}`}
        fill='transparent'
        sx={{
          width: [65, 65, 100, 100],
          height: [65, 65, 100, 100],
          position: 'fixed',
          zIndex: 3,

          // matched to our standard margin [2, 2, 3, 3]
          // but with a 1px adjustments for small screens
          top: [`7px`, `7px`, `12px`, `12px`],
          right: [`7px`, `7px`, `12px`, `12px`],
        }}
      >
        {overallBackground.map((color, idx) => (
          <PathBox
            key={`${idx}-${color}`}
            d={`M0 0 H${foldSize} V${foldSize} H0 L0 0`}
            fill={get(theme, `colors.${color}`)}
            sx={{
              display: overallBackground.map((el, j) =>
                idx === j ? 'inherit' : 'none',
              ),
            }}
          />
        ))}

        <GBox
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <PathBox
            id='fold'
            d={`M1 ${foldSize - 1} L1 3.5 L${foldSize - 3.5} ${foldSize - 1} Z`}
            fill={get(theme, hovered ? 'colors.highlight' : 'colors.muted')}
            stroke={get(theme, 'colors.text')}
            strokeWidth={1.5}
            sx={{ display: ['inherit', 'inherit', 'none', 'none'] }}
          />
          <PathBox
            id='fold'
            d={`M0.5 ${foldSize - 0.5} L0.5 0.5 L${foldSize - 0.5} ${foldSize - 0.5} Z`}
            fill={get(theme, hovered ? 'colors.highlight' : 'colors.muted')}
            stroke={get(theme, 'colors.text')}
            sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
          />
          <path
            d='M18.9089 37.031C20.0902 38.1695 20.745 39.4643 20.8748 40.9155H18.6184C18.3677 39.8153 17.8663 38.9423 17.1172 38.2993C16.3665 37.6533 15.3135 37.3319 13.9583 37.3319C12.3051 37.3319 10.9705 37.9247 9.95439 39.1075C8.93684 40.2902 8.42953 42.1042 8.42953 44.5493C8.42953 46.552 8.88818 48.1772 9.80691 49.4219C10.7242 50.6695 12.0928 51.2919 13.914 51.2919C15.5893 51.2919 16.8664 50.6371 17.7424 49.3245C18.207 48.6343 18.5535 47.7288 18.7821 46.6021H21.0385C20.8394 48.4013 20.1802 49.9115 19.0608 51.1267C17.7188 52.5926 15.9093 53.327 13.6338 53.327C11.6709 53.327 10.0237 52.7253 8.68903 51.5219C6.93411 49.9321 6.05664 47.4752 6.05664 44.1541C6.05664 41.6322 6.71584 39.5646 8.03427 37.9513C9.45886 36.1963 11.4247 35.3203 13.9317 35.3203C16.0701 35.3203 17.7291 35.8895 18.9089 37.031Z'
            fill={get(theme, 'colors.text')}
          />
          <path
            d='M7.64348 55.7102H14.4744C16.7927 55.7102 18.5904 56.542 19.869 58.2114C21.009 59.7156 21.5782 61.6416 21.5782 63.9924C21.5782 65.8064 21.242 67.4463 20.5695 68.9122C19.3823 71.5018 17.3428 72.7967 14.4508 72.7967H7.64348V55.7102ZM14.0202 70.8205C14.7856 70.8205 15.4153 70.7379 15.9079 70.5757C16.7868 70.2719 17.508 69.6909 18.0683 68.8296C18.5167 68.1394 18.8381 67.2575 19.0358 66.178C19.1493 65.535 19.2054 64.9363 19.2054 64.3877C19.2054 62.27 18.7939 60.6271 17.9725 59.4561C17.1496 58.2852 15.8238 57.6982 13.9966 57.6982H9.98239V70.8206L14.0202 70.8205Z'
            fill={get(theme, 'colors.text')}
          />
          <path
            d='M7.81896 75.6341H15.5849C16.865 75.6341 17.9194 75.8229 18.7497 76.2034C20.3261 76.9319 21.1136 78.2769 21.1136 80.2383C21.1136 81.2618 20.9028 82.0994 20.4795 82.7513C20.0562 83.4031 19.4664 83.9281 18.7054 84.3234C19.372 84.5947 19.8749 84.9516 20.2126 85.3911C20.5488 85.8335 20.7376 86.5532 20.7759 87.5442L20.857 89.836C20.8806 90.4878 20.9352 90.9716 21.0207 91.2901C21.1608 91.8328 21.4086 92.1809 21.7655 92.3372V92.7206H18.9266C18.8499 92.5731 18.788 92.3844 18.7408 92.1514C18.6936 91.9183 18.6553 91.4671 18.6243 90.8005L18.4842 87.9512C18.4326 86.8334 18.0285 86.0872 17.2764 85.7067C16.8458 85.4973 16.1718 85.3911 15.2531 85.3911H10.1328V92.7206H7.81899L7.81896 75.6341ZM15.3371 83.4621C16.3916 83.4621 17.2278 83.2438 17.8427 82.8103C18.4562 82.3767 18.7644 81.5921 18.7644 80.4595C18.7644 79.2443 18.3338 78.4126 17.474 77.9701C17.0139 77.7401 16.4004 77.6221 15.6306 77.6221H10.1328V83.4621H15.3371Z'
            fill={get(theme, 'colors.text')}
          />
          <path
            d='M25.7045 92.7206H22.9232L28.971 83.9547L23.3022 75.6341H26.1882L30.4989 82.1702L34.7756 75.6341H37.523L31.8557 83.9547L37.8003 92.7206H34.9364L30.3839 85.6949L25.7045 92.7206Z'
            fill={get(theme, 'colors.text')}
          />
          <path
            d='M39.7248 75.6341H42.0637V92.7206H39.7248V75.6341Z'
            fill={get(theme, 'colors.text')}
          />
          <path
            d='M46.6988 75.6341L51.6081 90.184L56.4585 75.6341H59.0526L52.8175 92.7206H50.3635L44.1401 75.6341H46.6988Z'
            fill={get(theme, 'colors.text')}
          />
        </GBox>
      </SVGBox>
    </Link>
  )
}

export default PageCorner
