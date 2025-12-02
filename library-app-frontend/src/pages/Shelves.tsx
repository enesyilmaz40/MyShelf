import { useState } from 'react';
import { useGetShelvesQuery, useCreateShelfMutation, useUpdateShelfMutation, useDeleteShelfMutation } from '../store/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Shelves() {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: shelves = [], isLoading } = useGetShelvesQuery({ includeBooks: true });
    const [createShelf] = useCreateShelfMutation();
    const [updateShelf] = useUpdateShelfMutation();
    const [deleteShelf] = useDeleteShelfMutation();

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: undefined as number | undefined,
    });

    const resetForm = () => {
        setFormData({ name: '', location: '', capacity: undefined });
        setEditingId(null);
    };

    const handleEdit = (shelf: any) => {
        setFormData({
            name: shelf.name,
            location: shelf.location || '',
            capacity: shelf.capacity,
        });
        setEditingId(shelf.id);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateShelf({ id: editingId, shelf: formData }).unwrap();
            } else {
                await createShelf(formData).unwrap();
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save shelf:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Raflar</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Raf
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Yükleniyor...</div>
            ) : shelves.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">Henüz raf yok. Yeni raf ekleyin!</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Raf Adı</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Konum</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kapasite</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kitap Sayısı</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shelves.map((shelf) => (
                                <tr key={shelf.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 font-medium">{shelf.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{shelf.location || '-'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">
                                        {shelf.capacity ? `${shelf.capacity} kitap` : 'Sınırsız'}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            {shelf.bookCount} kitap
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(shelf)}
                                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteShelf(shelf.id)}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4">{editingId ? 'Rafı Düzenle' : 'Yeni Raf Ekle'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Raf Adı</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Konum</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="Örn: Salon, Çalışma Odası"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Kapasite</label>
                                <input
                                    type="number"
                                    value={formData.capacity || ''}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="input-field"
                                    placeholder="Opsiyonel"
                                />
                            </div>
                            <div className="flex gap-3">
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
