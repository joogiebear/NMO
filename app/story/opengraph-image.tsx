import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { site } from "@/content/site";

export const alt = "It started with one friend, and a promise." + ` — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Our story",
    title: "It started with one friend,",
    accent: "and a promise.",
  });
}
