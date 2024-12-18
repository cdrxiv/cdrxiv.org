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

export default Badge
