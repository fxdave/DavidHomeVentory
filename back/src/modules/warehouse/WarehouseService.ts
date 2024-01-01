import { PrismaClient, WarehouseEntry } from "@prisma/client"
import { PathCache, ROOT_ID, SearchNameCache, WarehouseEntryVariant } from "./models"

export class WarehouseService {
    constructor(private __db: PrismaClient) { }

    async find(keyword: string | null, parentId: string | null) {
        const keywordFilter = keyword !== null
            ? {
                searchNameCache: {
                    contains: keyword
                }
            }
            : {}
        const parentFilter = parentId !== null
            ? {
                parentId: parentId
            }
            : {}

        const entries = await this.__db.warehouseEntry.findMany({
            where: {
                ...parentFilter,
                ...keywordFilter,
                id: { not: 'ROOT' }
            }
        })

        const list = entries.map(entry => ({
            ...entry,
            path: PathCache.from(entry.pathCache).path
        }))

        return list
    }

    async delete(id: string) {
        if (id === ROOT_ID) throw new Error("You cannot delete the ROOT item.")

        const deleteResult = await this.__db.warehouseEntry.delete({
            where: { id }
        })

        if (!deleteResult.parentId)
            throw new Error("The item didn't have a parent while deleting")

        await this.__resetVariant(deleteResult.parentId)
        return deleteResult
    }

    async create(data: { id: string | null, parentId: string | null, name: string }) {
        const parentId = data.parentId ?? ROOT_ID;
        let parent = await this.__db.warehouseEntry.findFirst({
            where: { id: parentId }
        })

        if (parent == null) throw new Error("Parent wasn't found")

        const entry = await this.__db.warehouseEntry.create({
            data: {
                id: data.id || undefined,
                name: data.name,
                parentId: data.parentId,
                variant: WarehouseEntryVariant.Item,
                pathCache: PathCache
                    .from(parent.pathCache)
                    .with({ id: parent.id, name: parent.name })
                    .toString(),
                searchNameCache: SearchNameCache.simplify(data.name)
            }
        })

        if (data.parentId)
            await this.__resetVariant(data.parentId)

        return entry
    }

    async update(data: {
        id: string,
        parentId: null | string,
        name: string,
        variant: WarehouseEntryVariant
    }) {
        const oldParent: WarehouseEntry | null = await this.__getParentByItemId(data.id)
        const newParent: WarehouseEntry | null = await this.__getItemOrNull(data.parentId)

        await this.__db.warehouseEntry.update({
            data: {
                id: data.id,
                name: data.name,
                searchNameCache: SearchNameCache.simplify(data.name),
                variant: data.variant,
                ...((newParent != null)
                    ? {
                        parentId: newParent.id,
                        pathCache: PathCache.fromParent(newParent).toString()
                    }
                    : {})
            },
            where: {
                id: data.id
            }
        })

        if (oldParent !== null && newParent !== null) {
            await this.__updateChildrenPathCache(
                data.id,
                PathCache.fromParent(oldParent),
                PathCache.fromParent(newParent)
            )
        }
    }

    async getOrCreate(id: string) {
        let entry: WarehouseEntry | null = await this.__db.warehouseEntry.findFirst({
            where: {
                id: id
            }
        })

        if (entry == null) {
            entry = {
                id: id,
                name: id,
                parentId: ROOT_ID,
                variant: WarehouseEntryVariant.Item,
                pathCache: new PathCache([{ id: ROOT_ID, name: 'Root' }]).toString(),
                searchNameCache: SearchNameCache.simplify(id)
            };
            await this.__db.warehouseEntry.create({ data: entry })
        }

        return {
            ...entry,
            path: PathCache.from(entry.pathCache)
        }
    }

    private async __updateChildrenPathCache(id: string, oldPathCache: PathCache, newPathCache: PathCache) {
        const deepChildren = await this.__getDeepChildren(id)
        for (const child of deepChildren) {
            await this.__db.warehouseEntry.update({
                where: {
                    id: child.id
                },
                data: {
                    pathCache: PathCache
                        .from(child.pathCache)
                        .replace(oldPathCache, newPathCache)
                        .toString()
                }
            })
        }
    }

    private async __getDeepChildren(id: string) {
        let deepChildren: WarehouseEntry[] = []
        let queue = await this.__db.warehouseEntry.findMany({
            where: { parentId: id }
        })
        let child
        while (child = queue.pop()) {
            deepChildren.push(child)
            const newChildren = await this.__db.warehouseEntry.findMany({
                where: { parentId: child.id }
            })
            queue = [...queue, ...newChildren]
        }
        return deepChildren
    }

    /** If the Container doesn't have any children it converts it to an Item */
    private async __resetVariant(id: string) {
        const children = await this.__getChildren(id)

        if (children === null)
            await this.__setVariant(id, WarehouseEntryVariant.Item)
        else
            await this.__setVariant(id, WarehouseEntryVariant.Container)
    }

    private async __getChildren(id: string) {
        return await this.__db.warehouseEntry.findFirst({
            where: {
                parentId: id
            }
        })
    }

    private async __setVariant(id: string, variant: WarehouseEntryVariant) {
        await this.__db.warehouseEntry.update({
            where: { id },
            data: { variant }
        })
    }

    private async __getParentByItemId(id: string) {
        const item = await this.__db.warehouseEntry.findFirstOrThrow({
            where: { id }
        })
        const parent = await this.__getItemOrNull(item.parentId)
        return parent
    }

    private async __getItemOrNull(id: string | null) {
        if (id === null) return null
        return await this.__db.warehouseEntry.findFirstOrThrow({
            where: { id }
        })
    }
}