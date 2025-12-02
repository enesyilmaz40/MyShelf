import { useState } from 'react';
import { useGetBooksQuery, useGetShelvesQuery } from '../store/api';
import { BookOpen, Layers, TrendingUp, Star } from 'lucide-react';

export default function Dashboard() {
    const { data: books = [] } = useGetBooksQuery({});
    const { data: shelves = [] } = useGetShelvesQuery({});
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');

    // Extract unique authors
    const authors = Array.from(new Set(books.map(b => b.author))).sort();

    // Filter books based on selection
    const filteredBooks = selectedAuthor
        ? books.filter(b => b.author === selectedAuthor)
        : books;

    const stats = [
        { label: 'Toplam Kitap', value: filteredBooks.length, icon: BookOpen, color: 'bg-blue-500' },
        { label: 'Toplam Raf', value: shelves.length, icon: Layers, color: 'bg-green-500' },
        { label: 'Okunuyor', value: filteredBooks.filter(b => b.readingProgress?.status === 2).length, icon: TrendingUp, color: 'bg-yellow-500' },
        { label: 'Tamamlanan', value: filteredBooks.filter(b => b.readingProgress?.status === 3).length, icon: Star, color: 'bg-purple-500' },
    ];

    const recentBooks = filteredBooks.slice(0, 5);

    // Calculate category stats
    const categoryStats = filteredBooks.reduce((acc, book) => {
        book.categories?.forEach(cat => {
            acc[cat] = (acc[cat] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5 categories

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Books */}
                <div className="card lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Son Eklenen Kitaplar</h2>
                        <div className="w-48">
                            <select
                                value={selectedAuthor}
                                onChange={(e) => setSelectedAuthor(e.target.value)}
                                className="input-field py-1 text-sm"
                            >
                                <option value="">Tüm Yazarlar</option>
                                {authors.map(author => (
                                    <option key={author} value={author}>{author}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {recentBooks.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Henüz kitap eklenmemiş.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentBooks.map((book) => (
                                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-medium">{book.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                                    </div>
                                    {book.shelfName && (
                                        <span className="text-sm px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                            {book.shelfName}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Stats */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Kategorilere Göre</h2>
                    {sortedCategories.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Veri yok.</p>
                    ) : (
                        <div className="space-y-4">
                            {sortedCategories.map(([category, count]) => (
                                <div key={category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{category}</span>
                                        <span className="text-gray-500">{count} kitap</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-primary-500 h-2 rounded-full"
                                            style={{ width: `${(count / filteredBooks.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
