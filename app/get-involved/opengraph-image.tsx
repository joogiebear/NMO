import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { site } from "@/content/site";

export const alt = "You don’t have to know us to help us." + ` — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Get involved",
    title: "You don’t have to know us",
    accent: "to help us.",
  });
}
