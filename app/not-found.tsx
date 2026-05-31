import Link from "next/link";

// Root-level fallback for non-localized unmatched paths. The localized 404
// lives in app/[locale]/not-found.tsx and is used for in-app navigation.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "#0a0f1c",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 600, margin: 0 }}>
          Page not found
        </h1>
        <p style={{ color: "#94a3b8", margin: 0 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Go home
        </Link>
      </body>
    </html>
  );
}
