/** Stable hue (0-359) for a box, so the same box always gets the same color. */
export function boxHue(id: string | null): number {
  if (!id) return 220;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 360;
}

/** Lid colors for a box, in the spirit of the blue lid in the logo. */
export const boxLidColors = (id: string | null) => ({
  ["--lid" as string]: `oklch(0.55 0.1 ${boxHue(id)})`,
  ["--lid-edge" as string]: `oklch(0.4 0.09 ${boxHue(id)})`,
});
