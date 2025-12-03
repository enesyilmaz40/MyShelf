import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Movies from './pages/Movies';
import Shelves from './pages/Shelves';
import Categories from './pages/Categories';
import Layout from './components/layout/Layout';

function App() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

            <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<Books />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/shelves" element={<Shelves />} />
                <Route path="/categories" element={<Categories />} />
            </Route>

            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
