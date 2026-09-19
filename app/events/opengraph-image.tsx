import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { site } from "@/content/site";

export const alt = "Come out. Bring people. That’s the whole ask." + ` — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Events",
    title: "Come out. Bring people.",
    accent: "That’s the whole ask.",
  });
}
