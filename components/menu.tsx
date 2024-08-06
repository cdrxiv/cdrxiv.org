import { Box, Button, Flex, ThemeUIStyleObject } from 'theme-ui'

interface MenuProps {
  setMenuOpen: (open: boolean) => void
  children: React.ReactNode
  sx?: ThemeUIStyleObject
}

const Menu: React.FC<MenuProps> = ({ setMenuOpen, children, sx }) => {
  return (
    <Box
      onClick={() => setMenuOpen(false)}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        zIndex: 2,
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 2,
          position: 'fixed',
          width: 200,
          bg: 'white',
          p: 3,
          border: '1px solid',
          borderColor: 'background',
          boxShadow: (theme) =>
            `1px 1px 1px 1px ${theme?.colors?.muted} inset, -1px -1px 1px 1px ${theme?.colors?.text} inset`,
          maxHeight: '100vh',
          overflowY: 'auto',
          ...sx,
        }}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(false)
          }}
          sx={{
            variant: 'text.monoCaps',
            position: 'sticky',
            top: 0,
            right: 0,
            color: 'blue',
            bg: 'transparent',
            cursor: 'pointer',
            p: 0,
            mt: -6,
            alignSelf: 'flex-end',
          }}
        >
          (x)
        </Button>
        {children}
      </Flex>
    </Box>
  )
}

export default Menu
