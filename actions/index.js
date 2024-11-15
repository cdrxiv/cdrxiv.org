import { throwActionErrors } from './client-utils'
import {
  registerAccount as registerAccountBase,
  updateAccount as updateAccountBase,
} from './account'
import {
  createVersionQueue as createVersionQueueBase,
  updatePreprint as updatePreprintBase,
  fetchPreprintFile as fetchPreprintFileBase,
  deletePreprintFile as deletePreprintFileBase,
  createAuthor as createAuthorBase,
  searchAuthor as searchAuthorBase,
  fetchPublishedPreprints as fetchPublishedPreprintsBase,
} from './preprint'
import {
  fetchDataDeposition as fetchDataDepositionBase,
  createDataDeposition as createDataDepositionBase,
  createDataDepositionVersion as createDataDepositionVersionBase,
  deleteZenodoEntity as deleteZenodoEntityBase,
  updateDataDeposition as updateDataDepositionBase,
} from './zenodo'
import { verify as verifyBase } from './hcaptcha'

export const registerAccount = throwActionErrors(registerAccountBase)
export const updateAccount = throwActionErrors(updateAccountBase)

export const createVersionQueue = throwActionErrors(createVersionQueueBase)
export const updatePreprint = throwActionErrors(updatePreprintBase)
export const fetchPreprintFile = throwActionErrors(fetchPreprintFileBase)
export const deletePreprintFile = throwActionErrors(deletePreprintFileBase)
export const createAuthor = throwActionErrors(createAuthorBase)
export const searchAuthor = throwActionErrors(searchAuthorBase)
export const fetchPublishedPreprints = throwActionErrors(
  fetchPublishedPreprintsBase,
)

export const fetchDataDeposition = throwActionErrors(fetchDataDepositionBase)
export const createDataDeposition = throwActionErrors(createDataDepositionBase)
export const createDataDepositionVersion = throwActionErrors(
  createDataDepositionVersionBase,
)
export const deleteZenodoEntity = throwActionErrors(deleteZenodoEntityBase)
export const updateDataDeposition = throwActionErrors(updateDataDepositionBase)

export const verifyHCaptcha = throwActionErrors(verifyBase)

export { PREPRINT_BASE } from './constants'
