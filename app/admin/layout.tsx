import Link from "next/link";
import { Onest, JetBrains_Mono } from "next/font/google";
import { getSessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { GlobalSearch } from "@/components/crm/global-search";
import { Notifications } from "@/components/crm/notifications";
import { listNotifications } from "@/lib/crm/repo";
import "../globals.css";

/**
 * The admin panel sits outside `[locale]`, so it owns its own document — the
 * root layout is a pass-through and cannot render `<html>` for both branches
 * without nesting two documents.
 *
 * It uses the same type and tokens as the public site, so working on the
 * content looks like the thing being worked on.
 */

const onest = Onest({
    subsets: ["latin", "cyrillic"],
    variable: "--font-onest",
    display: "swap",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono-jb",
    display: "swap",
});

export const metadata = {
    title: "SDS — админка",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Null on the login page, which renders without the shell.
    const user = await getSessionUser();
    // Derived from the records, so the bell can't disagree with the data.
    const notifications = user ? await listNotifications() : [];

    return (
        <html lang="ru" className={`${onest.variable} ${mono.variable}`}>
            <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
                <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-6 px-6">
                        <div className="flex items-baseline gap-3">
                            <Link
                                href="/admin"
                                className="text-[1.0625rem] font-semibold leading-none tracking-[-0.045em]"
                            >
                                SDS
                            </Link>
                            <span className="label">Админка</span>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <GlobalSearch />
                                <Notifications items={notifications} />
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="link-wipe hidden text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground md:inline"
                                >
                                    Сайт
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </header>

                {user ? (
                    <div className="lg:flex">
                        <AdminNav role={user.role} userName={user.name} />
                        <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">
                            {children}
                        </main>
                    </div>
                ) : (
                    <main className="px-6 py-10">{children}</main>
                )}
            </body>
        </html>
    );
}
