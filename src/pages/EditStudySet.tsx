import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StudySet } from '../types';
import { ArrowLeft } from 'lucide-react';

const EditStudySet: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [studySet, setStudySet] = useState<StudySet | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudySet = async () => {
            if (!id) return;
            try {
                const response = await api.get<StudySet>(`/study-sets/${id}`);
                const data = response.data;
                setStudySet(data);
                setTitle(data.title);
                setDescription(data.description || '');
                setLevel(data.level);
                setIsPublic(data.isPublic);
            } catch (err) {
                setError('Failed to fetch study set data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudySet();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/study-sets/${id}`, {
                title,
                description,
                level,
                isPublic,
            });
            navigate(`/study-sets/${id}`);
        } catch (err) {
            setError('Failed to update study set.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-8">
             <button onClick={() => navigate(`/study-sets/${id}`)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Study Set
            </button>
            <h1 className="text-2xl font-bold mb-6">Edit Study Set</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                    <select id="level" value={level} onChange={(e) => setLevel(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 rounded" />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">Make Public</label>
                </div>
                <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
            </form>
        </div>
    );
};

export default EditStudySet; 