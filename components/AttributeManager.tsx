import React, { useState, useCallback, useEffect, FC } from 'react';
import { Plus, Edit, Trash2, X, ChevronDown, ChevronUp, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

// Reusable component for displaying and managing a list of simple attributes
interface AttributeListProps {
  title: string;
  items: { id: string; name: string; parentId?: string; }[];
  onAdd: (name: string, parentId?: string) => void;
  onEdit: (id: string, newName: string, parentId?: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  parentOptions?: { id: string; name: string; }[];
}

const AttributeList: FC<AttributeListProps> = ({ title, items, onAdd, onEdit, onDelete, isLoading, parentOptions }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState<{ id: string; name: string; parentId?: string; } | null>(null);
    const [editName, setEditName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');

    const handleAdd = () => {
        if (newItemName.trim()) {
            onAdd(newItemName.trim(), selectedParentId || undefined);
            setNewItemName('');
            setSelectedParentId('');
        }
    };

    const handleEditStart = (item: { id: string; name: string; parentId?: string; }) => {
        setEditingItem(item);
        setEditName(item.name);
    };

    const handleEditSave = () => {
        if (editingItem && editName.trim()) {
            onEdit(editingItem.id, editName.trim(), editingItem.parentId);
            setEditingItem(null);
            setEditName('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </div>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                        {parentOptions && (
                            <select
                                className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                value={selectedParentId}
                                onChange={(e) => setSelectedParentId(e.target.value)}
                            >
                                <option value="">Select Parent Category</option>
                                {parentOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        )}
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            placeholder={`Add new ${title.toLowerCase().slice(0, -1)}`}
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleAdd(); }}
                        />
                        <button
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm flex items-center space-x-2"
                            onClick={handleAdd}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No items found.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center justify-between py-2">
                                    {editingItem?.id === item.id ? (
                                        <div className="flex-1 flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                                                onKeyPress={(e) => { if (e.key === 'Enter') handleEditSave(); }}
                                            />
                                            <button onClick={handleEditSave} className="text-green-600 hover:text-green-800 p-1 rounded">Save</button>
                                            <button onClick={() => setEditingItem(null)} className="text-red-600 hover:text-red-800 p-1 rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-gray-800 text-sm">{item.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleEditStart(item)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};


// ===== DEDICATED COMPONENT FOR SETTING STYLES =====
interface SettingStyle {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    images: string[];
    isActive: boolean;
}

interface SettingStylesManagerProps {
    items: SettingStyle[];
    onAdd: (data: Omit<SettingStyle, 'id' | 'slug'>) => void;
    onEdit: (id: string, data: Omit<SettingStyle, 'id' | 'slug'>) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
}

const SettingStylesManager: FC<SettingStylesManagerProps> = ({ items, onAdd, onEdit, onDelete, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStyle, setEditingStyle] = useState<SettingStyle | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', images: '', isActive: true });

    const handleOpenModal = (style: SettingStyle | null = null) => {
        setEditingStyle(style);
        if (style) {
            setFormData({
                title: style.title,
                description: style.description || '',
                images: style.images.join(', '),
                isActive: style.isActive,
            });
        } else {
            setFormData({ title: '', description: '', images: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStyle(null);
    };

    const handleSave = () => {
        const processedData = {
            title: formData.title,
            description: formData.description,
            images: formData.images.split(',').map(url => url.trim()).filter(url => url),
            isActive: formData.isActive,
        };

        if (editingStyle) {
            onEdit(editingStyle.id, processedData);
        } else {
            onAdd(processedData);
        }
        handleCloseModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Setting Styles</h3>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add New Style</span>
                </button>
            </div>
            {isLoading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {items.map(style => (
                        <div key={style.id} className="flex items-start justify-between py-3">
                            <div className="flex items-start space-x-4">
                                {style.images[0] ? (
                                    <img src={style.images[0]} alt={style.title} className="h-16 w-16 rounded-md object-cover" />
                                ) : (
                                    <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{style.title}</p>
                                    <p className="text-sm text-gray-500 max-w-md">{style.description || 'No description'}</p>
                                    {style.isActive ? (
                                        <span className="text-xs inline-flex items-center font-medium bg-green-100 text-green-700 rounded-full px-2 py-0.5 mt-1">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                                        </span>
                                    ) : (
                                        <span className="text-xs inline-flex items-center font-medium bg-red-100 text-red-700 rounded-full px-2 py-0.5 mt-1">
                                            <XCircle className="h-3 w-3 mr-1" /> Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button onClick={() => handleOpenModal(style)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => onDelete(style.id)} className="text-red-500 hover:text-red-700 p-1 rounded"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4">
                        <h4 className="text-xl font-bold">{editingStyle ? 'Edit' : 'Add'} Setting Style</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URLs</label>
                            <textarea value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} placeholder="Enter URLs, separated by commas"></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 text-amber-600 border-gray-300 rounded" />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// ===== MAIN ATTRIBUTE MANAGER COMPONENT =====
const AttributeManager: FC = () => {
    const [authToken, setAuthToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
    const [subcategories, setSubcategories] = useState<{ id: string; name: string; parentId: string; }[]>([]);
    const [metalQualities, setMetalQualities] = useState<{ id: string; name: string; }[]>([]);
    const [metalColors, setMetalColors] = useState<{ id: string; name: string; }[]>([]);
    const [metalTypes, setMetalTypes] = useState<{ id: string; name: string; }[]>([]);
    const [diamondShapes, setDiamondShapes] = useState<{ id: string; name: string; }[]>([]);
    const [diamondCuts, setDiamondCuts] = useState<{ id: string; name: string; }[]>([]);
    const [diamondClarities, setDiamondClarities] = useState<{ id: string; name: string; }[]>([]);
    const [diamondTones, setDiamondTones] = useState<{ id: string; name: string; }[]>([]);
    const [settingStyles, setSettingStyles] = useState<SettingStyle[]>([]);
    
    // Local state management (Genders, Occasions) - not connected to API
    const [genders, setGenders] = useState<{ id: string; name: string; }[]>([]);
    const [occasions, setOccasions] = useState<{ id: string; name: string; }[]>([]);
    useEffect(() => {
        const savedGenders = localStorage.getItem('genders'); if (savedGenders) setGenders(JSON.parse(savedGenders)); else setGenders([{ id: 'local-gender-1', name: 'Women' }, { id: 'local-gender-2', name: 'Men' }, { id: 'local-gender-3', name: 'Unisex' }]);
        const savedOccasions = localStorage.getItem('occasions'); if (savedOccasions) setOccasions(JSON.parse(savedOccasions)); else setOccasions([{ id: 'local-occasion-1', name: 'Engagement' }, { id: 'local-occasion-2', name: 'Wedding' }, { id: 'local-occasion-3', name: 'Anniversary' }]);
    }, []);
    
    const BASE_URL = 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory';
    
    useEffect(() => {
        const storedCredentials = localStorage.getItem('userCredentials');
        if (storedCredentials) setAuthToken(JSON.parse(storedCredentials).token);
    }, []);

    const fetchData = useCallback(async (endpoint: string, stateSetter: (data: any[]) => void) => {
        if (!authToken) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            const data = await response.json();
            let sourceArray = Array.isArray(data) ? data : (Object.values(data).find(Array.isArray) || []);

            const formattedData = sourceArray.map((item: any) => {
                if (endpoint.includes('settingStyles')) {
                    return {
                        id: item._id,
                        title: item.title,
                        slug: item.slug,
                        description: item.description,
                        images: item.images || [],
                        isActive: item.isActive,
                    };
                }
                let parentIdValue = null;
                if (typeof item.parentId === 'string') { parentIdValue = item.parentId; } 
                else if (typeof item.parentId === 'object' && item.parentId !== null) { parentIdValue = item.parentId._id || item.parentId.id || null; }
                
                return { id: item._id, name: item.title || item.name || item.value, parentId: parentIdValue };
            }).filter(item => item.id);

            stateSetter(formattedData);
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            stateSetter([]);
        } finally {
            setLoading(false);
        }
    }, [authToken]);
    
    const handleAdd = useCallback(async (endpoint: string, name: string, parentId?: string) => {
        let payload: any = { title: name.trim() };
        if (endpoint.includes('colors') || endpoint.includes('shapes') || endpoint.includes('cuts') || endpoint.includes('clarities') || endpoint.includes('types')) { payload = { name: name.trim() }; }
        if (endpoint.includes('purities')) { payload = { value: name.trim() }; }
        if (parentId) { payload.parentId = parentId; }
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('Failed to add attribute');
            await fetchData(endpoint, getSetter(endpoint));
        } catch (error) { console.error('Error adding attribute:', error); }
    }, [authToken, fetchData]);

    const handleEdit = useCallback(async (endpoint: string, id: string, newName: string, parentId?: string) => {
        let payload: any = { title: newName.trim() };
        if (endpoint.includes('colors') || endpoint.includes('shapes') || endpoint.includes('cuts') || endpoint.includes('clarities') || endpoint.includes('types')) { payload = { name: newName.trim() }; }
        if (endpoint.includes('purities')) { payload = { value: newName.trim() }; }
        if (parentId && endpoint.includes('subcategories')) { payload.parentId = parentId; }
        try {
            const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('Failed to update attribute');
            await fetchData(endpoint, getSetter(endpoint));
        } catch (error) { console.error('Error updating attribute:', error); }
    }, [authToken, fetchData]);

    const handleSettingStyleAdd = useCallback(async (data: Omit<SettingStyle, 'id' | 'slug'>) => {
        try {
            const response = await fetch(`${BASE_URL}/productAttributes/settingStyles`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(data) });
            if (!response.ok) throw new Error('Failed to add setting style');
            await fetchData('/productAttributes/settingStyles', setSettingStyles);
        } catch (error) { console.error('Error adding setting style:', error); }
    }, [authToken, fetchData]);

    const handleSettingStyleEdit = useCallback(async (id: string, data: Omit<SettingStyle, 'id' | 'slug'>) => {
        try {
            const response = await fetch(`${BASE_URL}/productAttributes/settingStyles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(data) });
            if (!response.ok) throw new Error('Failed to update setting style');
            await fetchData('/productAttributes/settingStyles', setSettingStyles);
        } catch (error) { console.error('Error updating setting style:', error); }
    }, [authToken, fetchData]);

    const handleDelete = useCallback(async (endpoint: string, id: string) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
            if (!response.ok) throw new Error('Failed to delete attribute');
            await fetchData(endpoint, getSetter(endpoint));
        } catch (error) { console.error('Error deleting attribute:', error); }
    }, [authToken, fetchData]);

    const getSetter = (endpoint: string): React.Dispatch<any> => ({
        '/productAttributes/categories': setCategories,
        '/productAttributes/subcategories': setSubcategories,
        '/metalAttributes/purities': setMetalQualities,
        '/metalAttributes/colors': setMetalColors,
        '/metalAttributes/types': setMetalTypes,
        '/diamondAttributes/shapes': setDiamondShapes,
        '/diamondAttributes/cuts': setDiamondCuts,
        '/diamondAttributes/clarities': setDiamondClarities,
        '/diamondAttributes/colors': setDiamondTones,
        '/productAttributes/settingStyles': setSettingStyles,
    }[endpoint] || (() => {}));
    
    useEffect(() => {
        if (authToken) {
            fetchData('/productAttributes/categories', setCategories);
            fetchData('/productAttributes/subcategories', setSubcategories);
            fetchData('/metalAttributes/purities', setMetalQualities);
            fetchData('/metalAttributes/colors', setMetalColors);
            fetchData('/metalAttributes/types', setMetalTypes);
            fetchData('/diamondAttributes/shapes', setDiamondShapes);
            fetchData('/diamondAttributes/cuts', setDiamondCuts);
            fetchData('/diamondAttributes/clarities', setDiamondClarities);
            fetchData('/diamondAttributes/colors', setDiamondTones);
            fetchData('/productAttributes/settingStyles', setSettingStyles);
        }
    }, [authToken, fetchData]);

    const tabs = [{ id: 'categories', label: 'Categories' }, { id: 'metal', label: 'Metal Attributes' }, { id: 'diamond', label: 'Diamond Attributes' }, { id: 'other', label: 'Other' }];

    const getSectionContent = () => {
        switch (activeTab) {
            case 'categories': return ( <div className="space-y-6"> <AttributeList title="Categories" items={categories} onAdd={(name) => handleAdd('/productAttributes/categories', name)} onEdit={(id, newName) => handleEdit('/productAttributes/categories', id, newName)} onDelete={(id) => handleDelete('/productAttributes/categories', id)} isLoading={loading} /> <AttributeList title="Subcategories" items={subcategories} onAdd={(name, parentId) => handleAdd('/productAttributes/subcategories', name, parentId)} onEdit={(id, newName, parentId) => handleEdit('/productAttributes/subcategories', id, newName, parentId)} onDelete={(id) => handleDelete('/productAttributes/subcategories', id)} isLoading={loading} parentOptions={categories.map(c => ({ id: c.id, name: c.name }))} /> </div> );
            case 'metal': return ( <div className="space-y-6"> <AttributeList title="Metal Types" items={metalTypes} onAdd={(name) => handleAdd('/metalAttributes/types', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/types', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/types', id)} isLoading={loading} /> <AttributeList title="Metal Qualities" items={metalQualities} onAdd={(name) => handleAdd('/metalAttributes/purities', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/purities', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/purities', id)} isLoading={loading} /> <AttributeList title="Metal Colors" items={metalColors} onAdd={(name) => handleAdd('/metalAttributes/colors', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/colors', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/colors', id)} isLoading={loading} /> </div> );
            case 'diamond': return ( <div className="space-y-6"> <AttributeList title="Diamond Tones" items={diamondTones} onAdd={(name) => handleAdd('/diamondAttributes/colors', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/colors', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/colors', id)} isLoading={loading} /> <AttributeList title="Stone Clarities" items={diamondClarities} onAdd={(name) => handleAdd('/diamondAttributes/clarities', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/clarities', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/clarities', id)} isLoading={loading} /> <AttributeList title="Diamond Shapes" items={diamondShapes} onAdd={(name) => handleAdd('/diamondAttributes/shapes', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/shapes', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/shapes', id)} isLoading={loading} /> <AttributeList title="Stone Cuts" items={diamondCuts} onAdd={(name) => handleAdd('/diamondAttributes/cuts', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/cuts', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/cuts', id)} isLoading={loading} /> </div> );
            case 'other':
                return (
                    <div className="space-y-6">
                        <SettingStylesManager 
                            items={settingStyles}
                            onAdd={handleSettingStyleAdd}
                            onEdit={handleSettingStyleEdit}
                            onDelete={(id) => handleDelete('/productAttributes/settingStyles', id)}
                            isLoading={loading}
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Product Attributes</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6 py-4">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">{getSectionContent()}</div>
            </div>
        </div>
    );
};

export default AttributeManager;
