import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Trophy, LogOut } from 'lucide-react';
import type { User } from '../threads/ThreadItem';

interface SidebarProps {
    authUser: User;
    signOut: () => void;
}

export default function Sidebar({ authUser, signOut }: SidebarProps) {
    const location = useLocation();

    const isActiveLink = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/', label: 'Threads', icon: MessageSquare },
        { path: '/leaderboards', label: 'Leaderboards', icon: Trophy },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
            {/* Header */}
            <div className="flex items-center justify-center h-14 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Forum Apps
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActiveLink(path)
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                    <img
                        src={authUser.avatar}
                        alt={authUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                                  flex items-center justify-center text-white font-semibold text-sm hidden">
                        {authUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                            {authUser.name}
                        </div>
                        {authUser.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {authUser.email}
                            </div>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={signOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}