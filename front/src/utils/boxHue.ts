/** Stable hue (0-359) for a box, so the same box always gets the same color. */
export function boxHue(id: string | null): number {
  if (!id) return 220;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  // Mix the bits, so ids differing in one character (Shelf 1, Shelf 2) still get far apart hues.
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash ^= hash >>> 16;
  return Math.abs(hash) % 360;
}

/** A muted tint for a box's icon, so boxes are told apart at a glance. */
export const boxTagColor = (id: string | null) => ({
  ["--tag-bg" as string]: `oklch(0.32 0.045 ${boxHue(id)})`,
  ["--tag-fg" as string]: `oklch(0.82 0.08 ${boxHue(id)})`,
});
