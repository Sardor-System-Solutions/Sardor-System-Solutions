import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

/** Share card built from the same light, editorial system as the site. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const headline = (t.raw("titleLines") as string[]).join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#0b0b0c",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e5e1",
            paddingBottom: "28px",
            fontSize: "24px",
          }}
        >
          <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
            SDS — Sardor &amp; Danila Systems
          </span>
          <span style={{ color: "#6e6e6a" }}>{tCommon("location")}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "76px",
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            maxWidth: "900px",
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "48px",
            borderTop: "1px solid #e5e5e1",
            paddingTop: "28px",
          }}
        >
          <span
            style={{
              color: "#6e6e6a",
              fontSize: "26px",
              lineHeight: 1.35,
              maxWidth: "760px",
            }}
          >
            {t("subtitle")}
          </span>
          <span style={{ color: "#116bff", fontSize: "26px" }}>
            {siteConfig.domain}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
