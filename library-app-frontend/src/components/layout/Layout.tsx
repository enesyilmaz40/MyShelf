import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';

export default function Layout() {
    return (
        <div className="min-h-screen">
            <TopNav />
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
                <Outlet />
            </main>
        </div>
    );
}
