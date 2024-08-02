import { Box, Button, Flex } from 'theme-ui'

interface MenuProps {
  setMenuOpen: (open: boolean) => void
  children: React.ReactNode
  position: { top: number; right: number }
}

const Menu: React.FC<MenuProps> = ({ setMenuOpen, children, position }) => {
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
          top: position.top,
          right: position.right,
          border: '1px solid',
          borderColor: 'background',
          boxShadow: (theme) =>
            `1px 1px 1px 1px ${theme?.colors?.muted} inset, -1px -1px 1px 1px ${theme?.colors?.text} inset`,
        }}
      >
        <Button
          onClick={() => setMenuOpen(false)}
          sx={{
            variant: 'text.monoCaps',
            position: 'absolute',
            top: 0,
            right: 0,
            color: 'blue',
            bg: 'transparent',
            cursor: 'pointer',
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
