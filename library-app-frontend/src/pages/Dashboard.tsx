import { useState } from 'react';
import { useGetBooksQuery, useGetShelvesQuery, useGetMoviesQuery, useGetCategoriesQuery } from '../store/api';
import { BookOpen, Film, Layers, Star, TrendingUp, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const { data: books = [] } = useGetBooksQuery({});
    const { data: movies = [] } = useGetMoviesQuery({});
    const { data: shelves = [] } = useGetShelvesQuery({});
    const { data: categories = [] } = useGetCategoriesQuery();
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');

    // Extract unique authors
    const authors = Array.from(new Set(books.map(b => b.author))).sort();

    // Filter books based on selection
    const filteredBooks = selectedAuthor
        ? books.filter(b => b.author === selectedAuthor)
        : books;

    const stats = [
        {
            label: 'Toplam Kitap',
            value: books.length,
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Filmler',
            value: movies.length,
            icon: Film,
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            label: 'Raflar',
            value: shelves.length,
            icon: Layers,
            gradient: 'from-yellow-500 to-orange-500'
        },
        {
            label: 'Tamamlanan',
            value: filteredBooks.filter(b => b.readingProgress?.status === 3).length,
            icon: Star,
            gradient: 'from-purple-500 to-pink-500'
        },
    ];

    const recentBooks = books.slice(0, 5);

    // Calculate category stats
    const categoryStats = books.reduce((acc, book) => {
        book.categories?.forEach(cat => {
            acc[cat] = (acc[cat] || 0) + 1;
        });
        return acc;
                        </div >
                        <div className="stat-number">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div >
                ))
}
            </div >

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Books */}
        <div className="glass-card p-6 lg:col-span-2">
            <div className="section-header">
                <h2 className="section-title">
                    <Sparkles className="w-6 h-6 inline mr-2" />
                    Son Eklenen Kitaplar
                </h2>
                <div className="w-48">
                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="input-field py-2 text-sm"
                    >
                                />
                        ) : (
                        <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                            )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">{book.title}</h3>
                            <p className="text-sm text-gray-300">{book.author}</p>
                        </div>
                        {book.shelfName && (
                            <span className="badge">
                                {book.shelfName}
                            </span>
                        )}
                </div>
                    ))}
            </div>
            )}
        </div>

        {/* Category Stats */}
        <div className="glass-card p-6">
            <div className="section-header">
                <h2 className="section-title">
                    <TrendingUp className="w-6 h-6 inline mr-2" />
                    Kategorilere Göre
                </h2>
            </div>

            {sortedCategories.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Veri yok.</p>
            ) : (
                <div className="space-y-4">
                    {sortedCategories.map(([category, count]) => (
                        <div key={category}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-white">{category}</span>
                                <span className="text-gray-400">{count}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                    style={{ width: `${(count / books.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
        </div >
    );
}
