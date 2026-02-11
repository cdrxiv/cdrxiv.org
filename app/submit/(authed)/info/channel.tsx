import { Box } from 'theme-ui'
import { Select } from '../../../../components'

type Props = {
  channel: string
  setChannel: (value: string) => void
}

const Channel: React.FC<Props> = ({ channel, setChannel }) => {
  return (
    <Select
      value={channel}
      onChange={(e) => {
        setChannel(e.target.value)
      }}
      id='channel'
    >
      <option value={''}>Select one</option>
      <option value={'_CHANNEL-ycncc'}>
        Yale Center for Natural Carbon Capture
      </option>
      <option value={'_CHANNEL-mati'}>Mati Carbon</option>
      <option value={'_CHANNEL-cascade'}>Cascade Data Quarry</option>
    </Select>
  )
}

export default Channel
