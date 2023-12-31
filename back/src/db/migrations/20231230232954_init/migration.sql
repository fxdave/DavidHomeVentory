-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WarehouseEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variant" INTEGER NOT NULL,
    "parentId" TEXT,
    "searchNameCache" TEXT NOT NULL,
    "pathCache" TEXT NOT NULL,
    CONSTRAINT "WarehouseEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "WarehouseEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
