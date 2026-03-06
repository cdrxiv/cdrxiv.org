import { Box } from 'theme-ui'
import { MultiSelect } from '../../../../components'
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
      <MultiSelect
        options={CHANNELS.map(({ id, label }) => ({ value: id, label }))}
        values={channels}
        setValues={setChannels}
      />
    </>
  )
}

export default Channel
