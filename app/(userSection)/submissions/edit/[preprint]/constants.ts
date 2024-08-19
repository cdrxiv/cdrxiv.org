export type UpdateType = 'correction' | 'metadata_correction' | 'version'

export const UPDATE_TYPE_LABELS = {
  correction: 'Text correction',
  metadata_correction: 'Metadata correction',
  version: 'New version',
}

export const UPDATE_TYPE_DESCRIPTIONS = {
  correction:
    'This is a small update. You must upload a new file, and additionally, you can update the metadata.',
  metadata_correction: 'You can only make changes to the metadata.',
  version:
    'A large update. You must upload a new file, and additionally, you can update the metadata.',
}
