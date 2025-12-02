import { useState, useEffect } from 'react';
import { useGetBooksQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation, useGetCategoriesQuery, useGetShelvesQuery } from '../store/api';
import { Plus, Trash2, Search, Edit2, MoreVertical } from 'lucide-react';
import { BookStatus } from '../types';

export default function Books() {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: books = [], isLoading } = useGetBooksQuery({ search });
    const { data: categories = [] } = useGetCategoriesQuery();
    const { data: shelves = [] } = useGetShelvesQuery({});

    const [createBook] = useCreateBookMutation();
    const [updateBook] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        language: 'Turkish',
        status: BookStatus.Owned,
        categoryIds: [] as string[],
        shelfId: '',
        summary: '',
        thoughts: '',
    });

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            language: 'Turkish',
            status: BookStatus.Owned,
            categoryIds: [],
            shelfId: '',
            summary: '',
            thoughts: '',
        });
        setEditingId(null);
    };

    const handleEdit = (book: any) => {
        // Extract summary and thoughts from description if possible
        let summary = '';
        let thoughts = '';

        if (book.description) {
            const parts = book.description.split('Düşünceler:');
            if (parts.length > 0) summary = parts[0].replace('Özet:', '').trim();
            if (parts.length > 1) thoughts = parts[1].trim();
            if (parts.length === 1 && !book.description.includes('Özet:')) summary = book.description;
        }

        setFormData({
            title: book.title,
            author: book.author,
            language: book.language,
            status: book.status,
            categoryIds: book.categories?.map((c: any) => categories.find(cat => cat.name === c)?.id).filter(Boolean) || [],
            shelfId: book.shelfId || '',
            summary,
            thoughts,
        });
        setEditingId(book.id);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const description = `Özet:\n${formData.summary}\n\nDüşünceler:\n${formData.thoughts}`;

            const bookData = {
                title: formData.title,
                author: formData.author,
                language: formData.language,
                status: formData.status,
                categoryIds: formData.categoryIds,
                shelfId: formData.shelfId || null,
                description: description.trim(),
            };

            if (editingId) {
                await updateBook({ id: editingId, book: bookData }).unwrap();
            } else {
                await createBook(bookData).unwrap();
            }

            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save book:', error);
        }
    };

    const toggleCategory = (categoryId: string) => {
        setFormData(prev => {
            const exists = prev.categoryIds.includes(categoryId);
            if (exists) {
                return { ...prev, categoryIds: prev.categoryIds.filter(id => id !== categoryId) };
            } else {
                return { ...prev, categoryIds: [...prev.categoryIds, categoryId] };
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Kitaplar</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kitap
                </button>
            </div>

            <div className="card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Kitap veya yazar ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : books.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">Henüz kitap yok. Yeni kitap ekleyin!</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kitap Adı</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Yazar</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Raf</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kategoriler</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 font-medium">{book.title}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{book.author}</td>
                                    <td className="p-4">
                                        {book.shelfName ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {book.shelfName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {book.categories?.map((cat: string) => (
                                                <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteBook(book.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
                    <div className="card max-w-2xl w-full mx-4 my-auto">
                        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Kitap Adı</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Yazar</label>
                                    <input
                                        type="text"
                                        list="authors-list"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="input-field"
                                        required
                                        placeholder="Yazar adı yazın veya seçin"
                                    />
                                    <datalist id="authors-list">
                                        {Array.from(new Set(books.map(b => b.author))).sort().map(author => (
                                            <option key={author} value={author} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Raf</label>
                                    <select
                                        value={formData.shelfId}
                                        onChange={(e) => setFormData({ ...formData, shelfId: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Raf Seçin</option>
                                        {shelves.map((shelf) => (
                                            <option key={shelf.id} value={shelf.id}>
                                                {shelf.name} {shelf.location ? `(${shelf.location})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Durum</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                        className="input-field"
                                    >
                                        <option value={BookStatus.Owned}>Kütüphanemde</option>
                                        <option value={BookStatus.Wishlist}>İstek Listesi</option>
                                        <option value={BookStatus.Lost}>Kayıp</option>
                                        <option value={BookStatus.Lent}>Ödünç Verildi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Kategoriler</label>
                                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-gray-500">Kategori bulunamadı. Önce kategori ekleyin.</p>
                                    ) : (
                                        categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`text-sm px-3 py-1 rounded-full border transition-colors ${formData.categoryIds.includes(cat.id)
                                                    ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                                    : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-primary-300'
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Özet</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="input-field min-h-[80px]"
                                    placeholder="Kitap hakkında kısa bir özet..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Düşüncelerim</label>
                                <textarea
                                    value={formData.thoughts}
                                    onChange={(e) => setFormData({ ...formData, thoughts: e.target.value })}
                                    className="input-field min-h-[80px]"
                                    placeholder="Bu kitap hakkındaki düşünceleriniz..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">
                                    {editingId ? 'Güncelle' : 'Ekle'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="btn-secondary flex-1"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
