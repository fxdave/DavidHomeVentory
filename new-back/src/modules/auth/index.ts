import { success, zodValidationError } from '@cuple/server'
import { z } from 'zod'
import { unauthorizedError } from '../../responses'
import { createToken, isTokenValid } from './token'
import { type Builder } from '../..'
import { type PrismaClient } from '@prisma/client'
import sha256 from 'sha256'

/**
 * Containes the auth middleware
 */
export function createAuthLink (builder: Builder) {
  return builder
    .headersSchema(
      z.object({
        Authorization: z.string()
      })
    )
    .middleware(async ({ data }) => {
      const sections = data.headers.Authorization.split(' ')
      if (isTokenValid(sections[1])) {
        return { next: true }
      }
      return {
        ...unauthorizedError({}),
        next: false
      }
    })
    .buildLink()
}

export function initAuthModule (
  db: PrismaClient,
  builder: Builder
) {
  return {
    authenticate: builder
      .bodySchema(
        z.object({
          password: z.string()
        })
      )
      .post(async ({ data }) => {
        const user = await db.user.findFirst({
          where: {
            id: 0
          }
        })

        if (hash(data.body.password) === user?.password) {
          const token = createToken()
          return success({ token })
        }

        return zodValidationError([
          {
            code: 'custom',
            message: 'Wrong password.',
            path: ['password']
          }
        ])
      }),
    setPassword: builder
      .bodySchema(
        z.object({
          password: z.string()
        })
      )
      .post(async ({ data }) => {
        const user = await db.user.findFirst({
          where: {
            id: 0
          }
        })

        if (user != null) {
          return unauthorizedError({
            message: 'Failed! Password has been already set.'
          })
        }

        await db.user.create({
          data: {
            id: 0,
            password: hash(data.body.password)
          }
        })

        return success({
          message: 'Password has been set successfully.'
        })
      })
  }
}

function hash (pass: string): string {
  return Buffer.from(sha256('bacon')).toString('base64')
}
