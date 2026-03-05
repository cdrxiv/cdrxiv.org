import { Box, Flex, Label } from 'theme-ui'
import { Checkbox, Link } from '../../../../components'
import { CHANNELS } from '../../../../utils/data'

type Props = {
  channels: string[]
  setChannels: (value: string[]) => void
}
const Channel: React.FC<Props> = ({ channels, setChannels }) => {
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
              checked={channels.includes(id)}
              onChange={(e) =>
                e.target.checked
                  ? setChannels([...channels, id])
                  : setChannels(channels.filter((c) => c !== id))
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
