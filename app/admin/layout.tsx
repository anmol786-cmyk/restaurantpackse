import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Users, BarChart3, Settings, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Admin Dashboard | Anmol Wholesale',
    description: 'Wholesale Management Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 hidden md:block">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/admin/wholesale" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <ShieldCheck className="h-6 w-6" />
                        <span>Admin</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    <Link href="/admin/wholesale" className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg font-medium transition-colors bg-slate-100 dark:bg-slate-900">
                        <Users className="h-5 w-5" />
                        Wholesale Approvals
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
                        <Package className="h-5 w-5" />
                        Orders (Coming Soon)
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
                        <BarChart3 className="h-5 w-5" />
                        Analytics (Coming Soon)
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
                        <Settings className="h-5 w-5" />
                        Settings (Coming Soon)
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
