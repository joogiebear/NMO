import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { site } from "@/content/site";

export const alt = "Cancer takes enough. It shouldn’t take the rent, too." + ` — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Chicago · In memory of Nina Mastro",
    title: "Cancer takes enough.",
    accent: "It shouldn’t take the rent, too.",
  });
}
