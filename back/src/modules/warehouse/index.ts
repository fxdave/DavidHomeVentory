import { apiResponse, success } from '@cuple/server'
import { z } from 'zod'
import { SearchNameCache, PathCache, ROOT_ID, WarehouseEntryVariant, PathSegment } from './models'
import { type AuthedBuilder } from '../../index'
import { WarehouseEntry, type PrismaClient } from '@prisma/client'

export function initWarehouseModule(db: PrismaClient, builder: AuthedBuilder) {
  return {
    list: builder
      .querySchema(
        z.object({
          keyword: z.string().nullable(),
          parentId: z.string().nullable()
        })
      )
      .get(async ({ data }) => {
        const keywordFilter = data.query.keyword !== null
          ? {
            searchNameCache: {
              contains: data.query.keyword
            }
          }
          : {}
        const parentFilter = data.query.parentId !== null
          ? {
            parentId: data.query.parentId
          }
          : {}

        const entries = await db.warehouseEntry.findMany({
          where: {
            ...parentFilter,
            ...keywordFilter,
            id: { not: 'ROOT' }
          }
        })

        const list = entries.map(entry => ({
          ...entry,
          path: PathCache.parse(entry.pathCache)
        }))

        return success({ list })
      }),
    delete: builder
      .querySchema(
        z.object({
          id: z.string()
        })
      )
      .delete(async ({ data }) => {
        const deleteResult = await db.warehouseEntry.delete({
          where: {
            id: data.query.id
          }
        })
        const queryResult = await db.warehouseEntry.findFirst({
          where: {
            parentId: deleteResult.parentId
          }
        })

        if (queryResult === null && deleteResult.parentId !== null) {
          await db.warehouseEntry.update({
            where: { id: deleteResult.parentId },
            data: {
              variant: WarehouseEntryVariant.Item
            }
          })
        }

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
        const parentId = data.body.parentId ?? ROOT_ID;
        let parent = await db.warehouseEntry.findFirst({
          where: { id: parentId }
        })

        if (parent == null) throw new Error("Parent wasn't found")

        const entry = await db.warehouseEntry.create({
          data: {
            id: data.body.id || undefined,
            name: data.body.name,
            parentId: data.body.parentId,
            variant: WarehouseEntryVariant.Item,
            pathCache: PathCache.extend(parent?.pathCache, { id: parent?.id, name: parent?.name }),
            searchNameCache: SearchNameCache.simplify(data.body.name)
          }
        })

        if (data.body.parentId != null) {
          await db.warehouseEntry.update({
            data: {
              variant: WarehouseEntryVariant.Container
            },
            where: {
              id: data.body.parentId
            }
          })
        }

        return success({
          entry
        })
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
        let newParent: WarehouseEntry | null = null
        let oldParent: WarehouseEntry | null = null
        if (data.body.parentId !== null) {
          newParent = await db.warehouseEntry.findFirst({
            where: {
              id: data.body.parentId
            }
          })
          oldParent = await db.warehouseEntry.findFirst({
            where: {
              id: data.body.parentId
            }
          })
        }

        await db.warehouseEntry.update({
          data: {
            id: data.body.id,
            name: data.body.name,
            searchNameCache: SearchNameCache.simplify(data.body.name),
            variant: data.body.variant,
            ...((newParent != null)
              ? {
                parentId: newParent.id,
                pathCache: PathCache.getChildrenPathCache(newParent)
              }
              : {})
          },
          where: {
            id: data.body.id
          }
        })

        if (oldParent !== null && newParent !== null) {
          const deepChildren = await getDeepChildren(db, data.body.id)
          for (const child of deepChildren) {
            await db.warehouseEntry.update({
              where: {
                id: child.id
              },
              data: {
                pathCache: PathCache.replace(child.pathCache, PathCache.getChildrenPathCache(oldParent), PathCache.getChildrenPathCache(newParent))
              }
            })
          }
        }

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
        let entry: WarehouseEntry | null = await db.warehouseEntry.findFirst({
          where: {
            id: data.query.id
          }
        })

        if (entry == null) {
          entry = {
            id: data.query.id,
            name: data.query.id,
            parentId: ROOT_ID,
            variant: WarehouseEntryVariant.Item,
            pathCache: PathCache.stringify([{ id: ROOT_ID, name: 'Root' }]),
            searchNameCache: SearchNameCache.simplify(data.query.id)
          };
          await db.warehouseEntry.create({ data: entry })
        }

        return success({
          entry: {
            ...entry,
            path: PathCache.parse(entry.pathCache)
          }
        })
      })
  }
}

export type WarehouseEntryWithPath = WarehouseEntry & {
  path: PathSegment[]
}

async function getDeepChildren(db: PrismaClient, id: string) {
  let deepChildren: WarehouseEntry[] = []
  let queue = await db.warehouseEntry.findMany({
    where: { parentId: id }
  })
  let child
  while (child = queue.pop()) {
    deepChildren.push(child)
    const newChildren = await db.warehouseEntry.findMany({
      where: { parentId: child.id }
    })
    queue = [...queue, ...newChildren]
  }
  return deepChildren
}
