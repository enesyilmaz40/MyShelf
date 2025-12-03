import { useParams, Link } from 'react-router-dom';
import { User, BookOpen, Film, Users, Calendar, Settings } from 'lucide-react';
import {
    useGetProfileQuery,
    useGetMyProfileQuery,
    useGetBooksQuery,
    useGetMoviesQuery,
    useGetFriendsQuery,
    useSendFriendRequestMutation,
    useRemoveFriendMutation,
} from '../store/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useState } from 'react';

export default function UserProfile() {
    const { userId } = useParams<{ userId: string }>();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const isOwnProfile = !userId || userId === currentUser?.id;

    const [activeTab, setActiveTab] = useState<'books' | 'movies'>('books');

    const { data: profile, isLoading } = isOwnProfile
        ? useGetMyProfileQuery()
        : useGetProfileQuery(userId!, { skip: !userId });

    const { data: books = [] } = useGetBooksQuery({});
    const { data: movies = [] } = useGetMoviesQuery({});
    const { data: friends = [] } = useGetFriendsQuery();

    const [sendRequest] = useSendFriendRequestMutation();
    const [removeFriend] = useRemoveFriendMutation();

    if (isLoading) {
        return <div className="text-center py-12">Yükleniyor...</div>;
    }

    if (!profile) {
        return (
            <div className="card text-center py-12">
                <p className="text-gray-500">Profil bulunamadı veya gizlidir.</p>
            </div>
        );
    }

    const isFriend = friends.some(f => f.userId === userId);

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="card">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={`${profile.firstName} ${profile.lastName}`}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-primary-600" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {profile.firstName} {profile.lastName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                            {profile.bio && (
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{profile.bio}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                Üyelik: {new Date(profile.memberSince).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>
                    <div>
                        {isOwnProfile ? (
                            <Link to="/profile/edit" className="btn-primary flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Profili Düzenle
                            </Link>
                        ) : isFriend ? (
                            <button
                                onClick={() => removeFriend(profile.id)}
                                className="btn-secondary text-red-600"
                            >
                                Arkadaşlıktan Çıkar
                            </button>
                        ) : (
                            <button
                                onClick={() => sendRequest(profile.id)}
                                className="btn-primary"
                            >
                                Arkadaş Ekle
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                            <span className="text-2xl font-bold">{profile.bookCount}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kitap</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Film className="w-5 h-5 text-primary-600" />
                            <span className="text-2xl font-bold">{profile.movieCount}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Film</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Users className="w-5 h-5 text-primary-600" />
                            <span className="text-2xl font-bold">{profile.friendCount}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Arkadaş</p>
                    </div>
                </div>
            </div>

            {/* Collection Tabs */}
            {(isOwnProfile || profile.isPublicProfile || isFriend) && (
                <>
                    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-4 py-2 font-medium ${activeTab === 'books'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            Kitaplar
                        </button>
                        <button
                            onClick={() => setActiveTab('movies')}
                            className={`px-4 py-2 font-medium ${activeTab === 'movies'
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            Filmler
                        </button>
                    </div>

                    {/* Books Tab */}
                    {activeTab === 'books' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {books.length === 0 ? (
                                <div className="col-span-full card text-center py-12">
                                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">Henüz kitap eklenmemiş.</p>
                                </div>
                            ) : (
                                books.map((book) => (
                                    <div key={book.id} className="card">
                                        {book.coverImageUrl && (
                                            <img
                                                src={book.coverImageUrl}
                                                alt={book.title}
                                                className="w-full h-48 object-cover rounded-t-lg mb-4"
                                            />
                                        )}
                                        <h3 className="font-bold">{book.title}</h3>
                                        <p className="text-sm text-gray-600">{book.author}</p>
                                        {book.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {book.categories.map((cat) => (
                                                    <span
                                                        key={cat}
                                                        className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded"
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Movies Tab */}
                    {activeTab === 'movies' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {movies.length === 0 ? (
                                <div className="col-span-full card text-center py-12">
                                    <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">Henüz film eklenmemiş.</p>
                                </div>
                            ) : (
                                movies.map((movie) => (
                                    <div key={movie.id} className="card">
                                        {movie.posterUrl && (
                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                                className="w-full h-48 object-cover rounded-t-lg mb-4"
                                            />
                                        )}
                                        <h3 className="font-bold">{movie.title}</h3>
                                        <p className="text-sm text-gray-600">{movie.director}</p>
                                        {movie.year && (
                                            <p className="text-sm text-gray-500">{movie.year}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
