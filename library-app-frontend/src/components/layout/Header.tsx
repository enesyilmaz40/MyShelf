import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Layers, Users } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { useLogoutMutation } from '../../store/api';
import type { RootState } from '../../store/store';

export default function Header() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

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

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 left-0 right-0 z-10">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="w-8 h-8 text-primary-600" />
                    <h1 className="text-xl font-bold">MyShelf</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/friends"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        Arkadaşlar
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Çıkış
                    </button>
                </div>
            </div>
        </header>
    );
}
