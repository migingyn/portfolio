import { existsSync } from "node:fs";
import { join } from "node:path";

export interface SectionVideo {
  /** URL of the clip, or undefined while the section has no footage yet. */
  src?: string;
  poster?: string;
}

/**
 * Looks in public/video for <id>.mp4 and a poster beside it (DESIGN.md section 5).
 * Sections without a clip get the placeholder instead.
 */
export function sectionVideo(id: string): SectionVideo {
  const dir = join(process.cwd(), "public", "video");
  const poster = [`${id}.jpg`, `${id}.webp`, `${id}.png`].find((file) => existsSync(join(dir, file)));
  return {
    src: existsSync(join(dir, `${id}.mp4`)) ? `/video/${id}.mp4` : undefined,
    poster: poster ? `/video/${poster}` : undefined,
  };
}
