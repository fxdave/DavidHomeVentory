import { WarehouseEntry } from "@prisma/client"

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PathCache {
  static extend(pathCache: string, entry: PathSegment): string {
    const parsed = PathCache.parse(pathCache)
    parsed.push(entry)
    return PathCache.stringify(parsed)
  }

  static parse(pathCache: string): PathSegment[] {
    return JSON.parse(pathCache)
  }

  static stringify(parents: PathSegment[]) {
    return JSON.stringify(parents)
  }

  static getChildrenPathCache(entry: WarehouseEntry) {
    return PathCache.extend(entry.pathCache, {
      id: entry.id,
      name: entry.name
    })
  }

  static replace(oldPath: string, pattern: string, replacement: string): string {
    const path = PathCache.parse(oldPath)
    const oldSegments = PathCache.parse(pattern)
    const newSegments = PathCache.parse(replacement)
    const withoutPattern = path.slice(oldSegments.length)
    const withReplacement = [...newSegments, ...withoutPattern]
    return PathCache.stringify(withReplacement)
  }
}

export type PathSegment = { id: string, name: string }

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SearchNameCache {
  static simplify(name: string): string {
    return name.toLowerCase()
  }
}

export const ROOT_ID = 'ROOT'

export enum WarehouseEntryVariant {
  Item = 0,
  Container = 1,
}
