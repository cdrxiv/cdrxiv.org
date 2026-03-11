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
        For most submissions, this can be skipped.
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
