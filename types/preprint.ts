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
  middle_name: string | null
  last_name: string
  salutation: string | null
  orcid: string | null
  institution: string | null
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

export type Preprint = {
  pk: number
  title: string
  abstract: string
  stage: string
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

type Modify<T, R> = Omit<T, keyof R> & R

export type PreprintParams = Partial<
  Modify<
    Preprint,
    {
      license: number
    }
  >
>

export type Preprints = Preprint[]
