import { throwActionErrors } from './client-utils'
import { registerAccount as registerAccountBase } from './account'

export const registerAccount = throwActionErrors(registerAccountBase)
