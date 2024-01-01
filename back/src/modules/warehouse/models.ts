export class PathCache {
  constructor(public path: PathSegment[]) { }

  static from(str: string) {
    return new PathCache(JSON.parse(str))
  }

  static fromEntry(entry: { pathCache: string }) {
    return PathCache.from(entry.pathCache)
  }

  static fromParent(entry: { id: string, name: string, pathCache: string }) {
    const cache = PathCache.from(entry.pathCache)
    cache.push({
      id: entry.id,
      name: entry.name
    })
    return cache
  }

  toString() {
    return JSON.stringify(this.path)
  }

  push(segment: PathSegment) {
    this.path.push(segment)
  }

  with(segment: PathSegment) {
    const newThis = new PathCache([...this.path]);
    newThis.push(segment)
    return newThis
  }

  replace(pattern: PathCache, replacement: PathCache) {
    const pathWithoutPattern = this.path.slice(pattern.path.length)
    const pathWithReplacement = [...replacement.path, ...pathWithoutPattern]
    return new PathCache(pathWithReplacement)
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
