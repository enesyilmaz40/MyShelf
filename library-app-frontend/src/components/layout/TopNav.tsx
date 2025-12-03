import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, Bell, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useState } from 'react';
import { useLogoutMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [logoutMutation] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/discover', label: 'Discover', icon: Compass },
        { path: '/library', label: 'My Library', icon: Library },
    ];

    return (
        <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-4 mt-4 px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MS</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        MyShelf
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path === '/library' && ['/books', '/movies', '/shelves', '/categories'].includes(location.pathname));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={isActive ? 'nav-link-active' : 'nav-link'}
                            >
                                <Icon className="w-5 h-5 inline mr-2" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </span>
                            </div>
                            <span className="text-sm font-medium hidden md:block">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 glass-card py-2">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-white/10 transition-colors"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/friends"
                                    className="block px-4 py-2 hover:bg-white/10 transition-colors"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    Friends
                                </Link>
                                <hr className="my-2 border-white/10" />
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
