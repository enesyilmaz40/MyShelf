import { useState } from 'react';
import { Users, UserPlus, Check, X, Search } from 'lucide-react';
import {
    useGetFriendsQuery,
    useGetPendingRequestsQuery,
    useSearchUsersQuery,
    useSendFriendRequestMutation,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useRemoveFriendMutation,
} from '../store/api';
import { Link } from 'react-router-dom';

export default function Friends() {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data: friends = [], isLoading: loadingFriends } = useGetFriendsQuery();
    const { data: requests = [], isLoading: loadingRequests } = useGetPendingRequestsQuery();
    const { data: searchResults = [] } = useSearchUsersQuery(searchQuery, {
        skip: searchQuery.length < 2,
    });

    const [sendRequest] = useSendFriendRequestMutation();
    const [acceptRequest] = useAcceptFriendRequestMutation();
    const [rejectRequest] = useRejectFriendRequestMutation();
    const [removeFriend] = useRemoveFriendMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setActiveTab('search');
    };

    const handleSendRequest = async (userId: string) => {
        try {
            await sendRequest(userId).unwrap();
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Users className="w-8 h-8" />
                    Arkadaşlar
                </h1>
            </div>

            {/* Search Bar */}
            <div className="card">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="input-field pl-10"
                    />
                </form>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-4 py-2 font-medium ${activeTab === 'friends'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                >
                    Arkadaşlar ({friends.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 font-medium ${activeTab === 'requests'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                >
                    İstekler ({requests.length})
                </button>
                {searchQuery && (
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-4 py-2 font-medium ${activeTab === 'search'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        Arama Sonuçları
                    </button>
                )}
            </div>

            {/* Friends List */}
            {activeTab === 'friends' && (
                <div className="space-y-4">
                    {loadingFriends ? (
                        <div className="text-center py-8">Yükleniyor...</div>
                    ) : friends.length === 0 ? (
                        <div className="card text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Henüz arkadaşınız yok.</p>
                        </div>
                    ) : (
                        friends.map((friend) => (
                            <div key={friend.userId} className="card flex items-center justify-between">
                                <Link to={`/profile/${friend.userId}`} className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{friend.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{friend.email}</p>
                                        {friend.bio && (
                                            <p className="text-sm text-gray-500 mt-1">{friend.bio}</p>
                                        )}
                                    </div>
                                </Link>
                                <button
                                    onClick={() => removeFriend(friend.userId)}
                                    className="btn-secondary text-red-600"
                                >
                                    Kaldır
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pending Requests */}
            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {loadingRequests ? (
                        <div className="text-center py-8">Yükleniyor...</div>
                    ) : requests.length === 0 ? (
                        <div className="card text-center py-12">
                            <UserPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Bekleyen arkadaşlık isteği yok.</p>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div key={request.id} className="card flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{request.requesterName}</h3>
                                        <p className="text-sm text-gray-500">
                                            Arkadaşlık isteği gönderdi
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(request.id)}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Kabul Et
                                    </button>
                                    <button
                                        onClick={() => rejectRequest(request.id)}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Reddet
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Search Results */}
            {activeTab === 'search' && (
                <div className="space-y-4">
                    {searchResults.length === 0 ? (
                        <div className="card text-center py-12">
                            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Sonuç bulunamadı.</p>
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <div key={user.id} className="card flex items-center justify-between">
                                <Link to={`/profile/${user.id}`} className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                        {user.bio && (
                                            <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
                                        )}
                                    </div>
                                </Link>
                                {user.isFriend ? (
                                    <span className="text-green-600 font-medium">Arkadaş</span>
                                ) : user.hasPendingRequest ? (
                                    <span className="text-yellow-600 font-medium">İstek Gönderildi</span>
                                ) : (
                                    <button
                                        onClick={() => handleSendRequest(user.id)}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" /> Ekle
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
