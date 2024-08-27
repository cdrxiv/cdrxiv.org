export type Creator = {
  name: string // Name of creator in the format Family name, Given names
  affiliation?: string
  orcid?: string
  gnd?: string
}

export type RelatedIdentifier = {
  identifier: string
  relation: string
  resource_type?: string
}
export type Subject = {
  term: string
  identifier: string
}

export type Deposition = {
  created: string
  id: number
  metadata?: {
    upload_type: 'dataset'
    title: string
    creators: Creator[]
    description: string
    doi?: string
    keywords?: string[]
    related_identifiers?: RelatedIdentifier[]
    communities: [{ identifier: 'cdrxiv' }]
    subjects?: Subject[]
  }
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
