import { theme } from '../../theme/theme'

const BorderFrame = ({
  borderWidth = 10,
  children,
}: {
  borderWidth?: number
  children: React.ReactNode
}) => (
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
          ${theme?.colors?.listBorderGrey as string} 50%, 
          ${theme?.colors?.listBorderGrey as string} 100%)`,
      }}
    />
    {children}
  </div>
)

export default BorderFrame
