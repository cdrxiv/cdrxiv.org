export interface Pagination<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type License = {
  pk: number
  name: string
  short_name: string
  text: string
  url: string
}

export type Author = {
  pk: number
  email: string
  first_name: string
  middle_name?: string | null
  last_name: string
  salutation?: string | null
  orcid?: string | null
  institution?: string | null
}

export type Subject = {
  name: string
}
export type Keyword = {
  word: string
}

export type Version = {
  version: number
  date_time: string
  title: string
  abstract: string | null
  public_download_url: string
}

export type SupplementaryFile = {
  url: string
  label: string
}

export type AdditionalFieldAnswer = {
  pk?: number
  answer: string
  field: {
    pk?: number
    name: string
  } | null
}

export type Funder = {
  funder: string
  award?: string
}

export type Stage =
  | 'preprint_unsubmitted'
  | 'preprint_review'
  | 'preprint_published'

export type Preprint = {
  pk: number
  title: string
  abstract: string
  stage: Stage
  license: License
  keywords: Keyword[]
  date_submitted: string | null
  date_accepted: string | null
  date_published: string | null
  doi: string | null
  preprint_doi: string | null
  authors: Author[]
  subject: Subject[]
  versions: Version[]
  supplementary_files: SupplementaryFile[]
  additional_field_answers: AdditionalFieldAnswer[]
  owner: number
}

export type VersionQueue = {
  preprint: number
  update_type: 'correction' | 'metadata_correction' | 'version'
  title: string
  abstract: string
  date_submitted: string
  date_decision: string | null
  published_doi: string | null
  approved: boolean
  file: null
}

type Modify<T, R> = Omit<T, keyof R> & R

export type PreprintParams = Partial<
  Modify<
    Preprint,
    {
      license: number
      authors: Array<Author | { pk: number; email: string }>
    }
  >
>

export type AuthorParams = Partial<
  Modify<
    Author,
    {
      pk?: number // Not included on create request
    }
  >
>

export type Preprints = Preprint[]
