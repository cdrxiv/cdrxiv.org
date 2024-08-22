export type Deposition = {
  created: string
  id: number
  metadata: {}
  files: DepositionFile[]
  links: {
    self: string
  }
}
export type DepositionFile = {
  id: string
  filename: string
  filesize: number
  checksum: string
  links: { self: string; download: string }
}
