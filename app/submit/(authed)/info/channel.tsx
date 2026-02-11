import { Box, Flex, Label } from 'theme-ui'
import { Checkbox, Link } from '../../../../components'
import { CHANNELS } from '../../../../utils/data'

type Props = {
  channel: string
  setChannel: (value: string) => void
}
const Channel: React.FC<Props> = ({ channel, setChannel }) => {
  return (
    <>
      <Box sx={{ variant: 'text.mono' }}>
        Select applicable organizational channel(s) here. The channel’s point of
        contact will be asked to approve the submission to add it to the
        channel.
      </Box>
      <Flex sx={{ flexDirection: 'column' }} role='group'>
        {CHANNELS.map(({ id, label }) => (
          <Label key={id}>
            <Checkbox
              checked={channel === id}
              onChange={(e) =>
                e.target.checked ? setChannel(id) : setChannel('')
              }
              sx={{ mt: '-1px' }}
            />
            {label}
            <Link
              href={`/channels/${id}`}
              sx={{ variant: 'forms.label', ml: 2 }}
              forwardArrow
            />
          </Label>
        ))}
      </Flex>
    </>
  )
}

export default Channel
