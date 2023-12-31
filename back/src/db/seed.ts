import { PrismaClient } from '@prisma/client'
import { PathCache, WarehouseEntryVariant } from '../modules/warehouse/models'

const prisma = new PrismaClient()

async function main() {
    const root = await prisma.warehouseEntry.upsert({
        where: { id: 'ROOT' },
        update: {},
        create: {
            id: 'ROOT',
            name: 'Root',
            pathCache: PathCache.stringify([]),
            searchNameCache: '',
            variant: WarehouseEntryVariant.Container,
            parentId: null
        },
    })
    console.log({ root })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
