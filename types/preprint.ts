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

type CommonPreprintFields = {
  pk: number
  keywords: Keyword[]
  doi: string | null
  preprint_doi: string | null
  authors: Author[]
  subject: Subject[]
  versions: Version[]
  supplementary_files: SupplementaryFile[]
  additional_field_answers: AdditionalFieldAnswer[]
  owner: number
}

type UnsubmittedPreprint = CommonPreprintFields & {
  stage: 'preprint_unsubmitted'
  title: string | null
  abstract: string | null
  license: License | null
  date_submitted: null
  date_accepted: null
  date_published: null
}

export type ReviewPreprint = CommonPreprintFields & {
  stage: 'preprint_review'
  title: string
  abstract: string
  license: License
  date_submitted: string
  date_accepted: null
  date_published: null
}

export type PublishedPreprint = CommonPreprintFields & {
  stage: 'preprint_published'
  title: string
  abstract: string
  license: License
  date_submitted: string
  date_accepted: string
  date_published: string
}

export type Preprint = UnsubmittedPreprint | ReviewPreprint | PublishedPreprint

export type UpdateType = 'correction' | 'metadata_correction' | 'version'

export type VersionQueue = {
  preprint: number
  update_type: UpdateType
  title: string
  abstract: string
  date_submitted: string
  date_decision: string | null
  published_doi: string | null
  approved: boolean
  file: number | null
}

export type VersionQueueParams = Partial<VersionQueue>

type Modify<T, R> = Omit<T, keyof R> & R

export type PreprintParams = Partial<
  Modify<
    Preprint,
    {
      license: number | null
      authors: Array<Author | { pk: number; email: string }>
    }
  >
> & { comments_editor?: string }

export type AuthorParams = Partial<
  Modify<
    Author,
    {
      pk?: number // Not included on create request
    }
  >
>

export type PreprintFile = {
  pk: number
  preprint: number
  mime_type: string
  original_filename: string
  public_download_url: string
  manager_download_url: string
}

export type PreprintFileParams = Modify<
  PreprintFile,
  {
    pk?: number // Not included on create request
    public_download_url?: string
    manager_download_url?: string
    file: ArrayBuffer
  }
>

export type Preprints = Preprint[]
