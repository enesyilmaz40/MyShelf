import { useState } from 'react';
import { Film, Plus, Edit2, Trash2, Search } from 'lucide-react';
import {
    useGetMoviesQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useDeleteMovieMutation,
    useGetShelvesQuery,
    useGetCategoriesQuery,
} from '../store/api';
import type { Movie, CreateMovieRequest, MovieStatus, MovieFormat } from '../types';

export default function Movies() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    const { data: movies = [], isLoading } = useGetMoviesQuery({ search });
    const { data: shelves = [] } = useGetShelvesQuery({});
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createMovie] = useCreateMovieMutation();
    const [updateMovie] = useUpdateMovieMutation();
    const [deleteMovie] = useDeleteMovieMutation();

    const [formData, setFormData] = useState<Partial<CreateMovieRequest>>({
        title: '',
        director: '',
        year: new Date().getFullYear(),
        language: 'Turkish',
        status: 1,
        categoryIds: [],
    });

    const handleOpenModal = (movie?: Movie) => {
        if (movie) {
            setEditingMovie(movie);
            setFormData({
                title: movie.title,
                originalTitle: movie.originalTitle,
                director: movie.director,
                year: movie.year,
                duration: movie.duration,
                language: movie.language,
                posterUrl: movie.posterUrl,
                imdbId: movie.imdbId,
                ageRating: movie.ageRating,
                description: movie.description,
                personalRating: movie.personalRating,
                notes: movie.notes,
                status: movie.status,
                format: movie.format,
                platform: movie.platform,
                shelfId: movie.shelfId,
                categoryIds: categories
                    .filter(cat => movie.categories.includes(cat.name))
                    .map(cat => cat.id),
            });
        } else {
            setEditingMovie(null);
            setFormData({
                title: '',
                director: '',
                year: new Date().getFullYear(),
                language: 'Turkish',
                status: 1,
                categoryIds: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMovie) {
                await updateMovie({
                    id: editingMovie.id,
                    movie: formData as any,
                }).unwrap();
            } else {
                await createMovie(formData as CreateMovieRequest).unwrap();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save movie:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu filmi silmek istediğinizden emin misiniz?')) {
            await deleteMovie(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Film className="w-8 h-8" />
                    Filmler
                </h1>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                    <Plus className="w-5 h-5" />
                    Film Ekle
                </button>
            </div>

            <div className="card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Film veya yönetmen ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : movies.length === 0 ? (
                <div className="card text-center py-12">
                    <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Henüz film eklenmemiş.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="card hover:shadow-lg transition-shadow">
                            {movie.posterUrl && (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                                />
                            )}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">{movie.title}</h3>
                                {movie.originalTitle && (
                                    <p className="text-sm text-gray-600">{movie.originalTitle}</p>
                                )}
                                <p className="text-sm text-gray-600">Yönetmen: {movie.director}</p>
                                {movie.year && <p className="text-sm text-gray-500">{movie.year}</p>}
                                {movie.duration && (
                                    <p className="text-sm text-gray-500">{movie.duration} dk</p>
                                )}
                                {movie.personalRating && (
                                    <p className="text-sm text-yellow-600">⭐ {movie.personalRating}/10</p>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleOpenModal(movie)}
                                        className="flex-1 btn-secondary text-sm py-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(movie.id)}
                                        className="flex-1 btn-secondary text-sm py-2 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingMovie ? 'Film Düzenle' : 'Yeni Film Ekle'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-2">Film Adı *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Yönetmen *</label>
                                        <input
                                            type="text"
                                            value={formData.director}
                                            onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Yıl</label>
                                        <input
                                            type="number"
                                            value={formData.year || ''}
                                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Süre (dk)</label>
                                        <input
                                            type="number"
                                            value={formData.duration || ''}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Puan (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            step="0.1"
                                            value={formData.personalRating || ''}
                                            onChange={(e) => setFormData({ ...formData, personalRating: parseFloat(e.target.value) })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 btn-secondary"
                                    >
                                        İptal
                                    </button>
                                    <button type="submit" className="flex-1 btn-primary">
                                        {editingMovie ? 'Güncelle' : 'Ekle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
