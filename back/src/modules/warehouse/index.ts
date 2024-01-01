import { apiResponse, success } from '@cuple/server'
import { z } from 'zod'
import { SearchNameCache, PathCache, ROOT_ID, WarehouseEntryVariant, PathSegment } from './models'
import { type AuthedBuilder } from '../../index'
import { WarehouseEntry, type PrismaClient } from '@prisma/client'
import { WarehouseService } from './WarehouseService'

export function initWarehouseModule(db: PrismaClient, builder: AuthedBuilder) {
  const warehouseService = new WarehouseService(db);

  return {
    list: builder
      .querySchema(
        z.object({
          keyword: z.string().nullable(),
          parentId: z.string().nullable()
        })
      )
      .get(async ({ data }) => {
        const list = await warehouseService.find(data.query.keyword, data.query.parentId)
        return success({ list })
      }),
    delete: builder
      .querySchema(
        z.object({
          id: z.string()
        })
      )
      .delete(async ({ data }) => {
        await warehouseService.delete(data.query.id)
        return success({
          message: 'Entry is deleted successfully!'
        })
      }),
    create: builder
      .bodySchema(
        z.object({
          name: z.string().min(1),
          parentId: z.string().nullable(),
          id: z.string().nullable()
        })
      )
      .post(async ({ data }) => {
        const entry = await warehouseService.create(data.body);
        return success({ entry })
      }),
    update: builder
      .bodySchema(
        z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          parentId: z.string().nullable(),
          variant: z.nativeEnum(WarehouseEntryVariant)
        })
      )
      .put(async ({ data }) => {
        await warehouseService.update(data.body)
        return success({
          message: "The item is updated successfully!"
        })

      }),
    getOrCreate: builder
      .querySchema(
        z.object({
          id: z.string().min(1)
        })
      )
      .post(async ({ data }) => {
        const entry = await warehouseService.getOrCreate(data.query.id)
        return success({ entry })
      })
  }
}

export type WarehouseEntryWithPath = WarehouseEntry & {
  path: PathSegment[]
}