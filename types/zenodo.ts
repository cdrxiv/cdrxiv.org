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
  modified: string
  id: number
  doi?: string
  doi_url?: string
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
    license: string
  }
  files: DepositionFile[]
  links: {
    self: string
    newversion: string
    record: string
  }
  submitted: boolean
}

export type DepositionFile = {
  id: string
  filename: string
  filesize: number
  checksum: string
  links: { self: string; download: string }
}

type Modify<T, R> = Omit<T, keyof R> & R

type DepositionVersionFile = Modify<
  DepositionFile,
  { filename: undefined; key: string }
>
export type DepositionVersion = Modify<
  Deposition,
  { files: DepositionVersionFile[] }
>

export type VersionHistory = {
  hits: {
    hits: DepositionVersion[]
    total: number
  }
}
