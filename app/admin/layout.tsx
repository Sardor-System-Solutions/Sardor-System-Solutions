import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/admin" className="text-sm font-semibold tracking-tight">
                        SDS · Admin
                    </Link>
                    <nav className="flex items-center gap-4 text-sm text-zinc-400">
                        <Link href="/admin" className="hover:text-zinc-100">
                            Проекты
                        </Link>
                        <Link href="/admin/projects/new" className="hover:text-zinc-100">
                            + Новый проект
                        </Link>
                        <LogoutButton />
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
    );
}
