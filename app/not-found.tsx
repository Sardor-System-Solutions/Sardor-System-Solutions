import Link from "next/link";

// Root-level fallback for non-localized unmatched paths. The localized 404
// lives in app/[locale]/not-found.tsx and is used for in-app navigation.
export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "16px",
          background: "#ffffff",
          color: "#0b0b0c",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "48px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Страница не найдена
        </h1>
        <p style={{ color: "#6e6e6a", margin: 0 }}>
          Такой страницы нет или она была перенесена.
        </p>
        <Link href="/" style={{ color: "#116bff", textDecoration: "none" }}>
          На главную
        </Link>
      </body>
    </html>
  );
}
