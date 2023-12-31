import { apiResponse } from '@cuple/server'

export const unauthorizedError = <T,>(data: T) =>
  apiResponse('unauthorized', 403, {
    message: 'Unauthorized.',
    ...data
  })
