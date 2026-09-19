import { ImageResponse } from "next/og";
import { impact, site } from "@/content/site";

/**
 * Social share cards, drawn in the site's own look rather than shipped as
 * image files — so they never drift from the design and every page gets one.
 * Each route's opengraph-image.tsx is a three-line call into renderOg().
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Pulls just the glyphs we need from Google Fonts. If the request fails (no
 * outbound network at build time) the card falls back to the built-in face
 * instead of failing the build.
 */
async function loadFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function renderOg({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  /** First line(s), set in heavy upright Fraunces. */
  title: string;
  /** Optional closing line, set in orchid italic. */
  accent?: string;
}) {
  const words = `${eyebrow}${title}${accent ?? ""}${site.name}${impact.headline.value}${impact.headline.label}N`;
  // Labels are set uppercase, so the subset needs those glyphs too.
  const glyphs = words + words.toUpperCase();
  // The display cut (opsz 144) thins "$" and "+" to hairlines that vanish at
  // footer size, so the figures get the sturdier text cut of the same face.
  const [heavy, italic, text] = await Promise.all([
    loadFont("Fraunces:opsz,wght@144,900", glyphs),
    loadFont("Fraunces:ital,opsz,wght@1,144,400", glyphs),
    loadFont("Fraunces:opsz,wght@24,800", glyphs),
  ]);
  const fonts = [
    heavy && { name: "Fraunces", data: heavy, weight: 900 as const, style: "normal" as const },
    italic && { name: "Fraunces", data: italic, weight: 400 as const, style: "italic" as const },
    text && { name: "Fraunces Text", data: text, weight: 800 as const, style: "normal" as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  const plus = impact.headline.value.endsWith("+");
  const figure = plus ? impact.headline.value.slice(0, -1) : impact.headline.value;

  const titleSize = title.length + (accent?.length ?? 0) > 60 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0D0812",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(242,176,78,0.30), transparent 45%), radial-gradient(circle at 92% 8%, rgba(140,80,220,0.55), transparent 52%), radial-gradient(circle at 70% 110%, rgba(207,166,255,0.18), transparent 50%)",
          color: "#FBF5FF",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 2, backgroundColor: "#F2B04E" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#F2B04E",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: titleSize,
            lineHeight: 0.98,
            letterSpacing: -3,
          }}
        >
          <div style={{ fontWeight: 900 }}>{title}</div>
          {accent ? (
            <div style={{ fontStyle: "italic", fontWeight: 400, color: "#CFA6FF", marginTop: 8 }}>
              {accent}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(251,245,255,0.18)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "linear-gradient(135deg, #CFA6FF, #6F35A8)",
                fontSize: 32,
                fontStyle: "italic",
              }}
            >
              N
            </div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>{site.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div style={{ fontSize: 54, fontFamily: "Fraunces Text", fontWeight: 800, color: "#FFC768" }}>
              {figure}
            </div>
            {/* Satori misplaces the stem of Fraunces' "+", so the plus is drawn. */}
            {plus ? (
              <div style={{ display: "flex", position: "relative", width: 26, height: 26, marginLeft: -6, marginRight: 4, alignSelf: "center" }}>
                <div style={{ position: "absolute", left: 0, top: 10, width: 26, height: 6, backgroundColor: "#FFC768" }} />
                <div style={{ position: "absolute", left: 10, top: 0, width: 6, height: 26, backgroundColor: "#FFC768" }} />
              </div>
            ) : null}
            <div
              style={{
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(251,245,255,0.7)",
              }}
            >
              {impact.headline.label}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
