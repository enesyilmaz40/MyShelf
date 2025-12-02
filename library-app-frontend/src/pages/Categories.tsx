import { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../store/api';
import { Plus, Trash2, Wand2 } from 'lucide-react';

export default function Categories() {
    const [showModal, setShowModal] = useState(false);
    const { data: categories = [], isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [newCategory, setNewCategory] = useState({
        name: '',
        color: '#3b82f6',
    });

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding category:', newCategory);
        try {
            const result = await createCategory(newCategory).unwrap();
            console.log('Category added successfully:', result);
            setShowModal(false);
            setNewCategory({ name: '', color: '#3b82f6' });
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const addDefaultCategories = async () => {
        const defaults = [
            { name: 'Roman', color: '#3b82f6' },
            { name: 'Bilim Kurgu', color: '#8b5cf6' },
            { name: 'Tarih', color: '#f59e0b' },
            { name: 'Kişisel Gelişim', color: '#10b981' },
            { name: 'Felsefe', color: '#64748b' },
            { name: 'Psikoloji', color: '#ec4899' },
            { name: 'Edebiyat', color: '#ef4444' },
            { name: 'Bilim', color: '#06b6d4' },
        ];

        for (const cat of defaults) {
            // Check if already exists to avoid duplicates
            if (!categories.some(c => c.name === cat.name)) {
                try {
                    await createCategory(cat).unwrap();
                } catch (error) {
                    console.error(`Failed to add default category ${cat.name}:`, error);
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Kategoriler</h1>
                <div className="flex gap-3">
                    <button
                        onClick={addDefaultCategories}
                        className="btn-secondary flex items-center gap-2"
                        title="Varsayılan kategorileri ekle"
                    >
                        <Wand2 className="w-5 h-5" />
                        Otomatik Ekle
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Kategori
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : categories.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500 mb-4">Henüz kategori yok.</p>
                    <button onClick={addDefaultCategories} className="btn-primary">
                        Varsayılan Kategorileri Ekle
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 w-16">Renk</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kategori Adı</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4">
                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                                            style={{ backgroundColor: category.color || '#3b82f6' }}
                                        />
                                    </td>
                                    <td className="p-4 font-medium">{category.name}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4">Yeni Kategori Ekle</h2>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Kategori Adı</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Renk</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewCategory({ ...newCategory, color })}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newCategory.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary flex-1">Ekle</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
