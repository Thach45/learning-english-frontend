import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Category, StudySet } from '../types';
import { Plus, BookOpen, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const CategoryDetailPage: React.FC = () => {
    const { id: categoryId } = useParams<{ id: string }>();
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [category, setCategory] = useState<Category | null>(null);
    const [studySets, setStudySets] = useState<StudySet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for new study set form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            if (!categoryId) return;
            setLoading(true);
            try {
                // Fetch category info
                const catResponse = await api.get(`/categories/${categoryId}`);
                setCategory(catResponse.data);

                // Fetch study sets in this category
                const ssResponse = await api.get(`/study-sets?category=${categoryId}`);
                setStudySets(ssResponse.data);

            } catch (err: any) {
                setError(err.message || 'Failed to fetch category details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [categoryId]);

    const handleCreateStudySet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) return;
        
        try {
            const payload = { 
                title, 
                description, 
                categoryId, 
                level, 
                isPublic,
                vocabularies: [] // Send empty vocabularies array
            };
            const response = await api.post('/study-sets', payload);
            
            // Add the new study set to the list locally
            setStudySets(prev => [response.data, ...prev]);

            // Reset form
            setTitle('');
            setDescription('');
            setLevel('BEGINNER');
            setIsPublic(true);

            // Optional: navigate to the new study set's detail page
            // navigate(`/study-sets/${response.data.id}`);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create study set');
        }
    };
    
    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/categories" className="flex items-center text-blue-600 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Categories
            </Link>

            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">{category?.name}</h1>
                <p className="text-lg text-gray-600 mt-2">{category?.description}</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Study Sets List */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Study Sets</h2>
                    <div className="space-y-4">
                        {studySets.map(ss => (
                            <div key={ss.id} onClick={() => navigate(`/study-sets/${ss.id}`)} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{ss.title}</h3>
                                    <p className="text-sm text-gray-500">{ss.vocabularies?.length || 0} terms</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ss.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {ss.isPublic ? 'Public' : 'Private'}
                                </span>
                            </div>
                        ))}
                        {studySets.length === 0 && <p className="text-gray-500">No study sets in this category yet.</p>}
                    </div>
                </div>

                {/* Create Study Set Form */}
                <div>
                    <div className="p-6 bg-white rounded-lg shadow-sm sticky top-8">
                        <h2 className="text-2xl font-bold mb-4">New Study Set</h2>
                        <form onSubmit={handleCreateStudySet} className="space-y-4">
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border rounded" />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
                            <select value={level} onChange={e => setLevel(e.target.value as any)} className="w-full p-2 border rounded">
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                            <div className="flex items-center">
                                <input id="isPublic" type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 rounded" />
                                <label htmlFor="isPublic" className="ml-2 text-sm">Make Public</label>
                            </div>
                            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md">Create & Add Words</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailPage; 