import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { site } from "@/content/site";

export const alt = "There’s a person on the other end of this." + ` — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "There’s a person",
    accent: "on the other end of this.",
  });
}
