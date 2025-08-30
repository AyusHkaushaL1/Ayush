import React, { useState, useCallback, useEffect, FC } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Reusable component for displaying and managing a list of attributes
interface AttributeListProps {
  title: string;
  items: { id: string; name: string; parentId?: string; }[];
  onAdd: (name: string, parentId?: string) => void;
  onEdit: (id: string, newName: string, parentId?: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  parentOptions?: { id: string; name: string; }[];
}

const AttributeList: FC<AttributeListProps> = ({
  title,
  items,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  parentOptions
}) => {
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

  // Helper to find parent name from ID for display
  const getParentName = (parentId?: string) => {
    if (!parentId || !parentOptions) return '';
    const parent = parentOptions.find(p => p.id === parentId);
    return parent ? `(${parent.name})` : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
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
                <option value="">Select Parent...</option>
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
            />
            <button
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm flex items-center space-x-2 disabled:bg-gray-400"
              onClick={handleAdd}
              disabled={isLoading || !newItemName.trim() || (!!parentOptions && !selectedParentId)}
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
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                        }}
                      />
                      <button onClick={handleEditSave} className="text-green-600 hover:text-green-800 p-1 rounded font-semibold">Save</button>
                      <button onClick={() => setEditingItem(null)} className="text-red-600 hover:text-red-800 p-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800 text-sm">
                        {item.name}
                        {parentOptions && <span className="text-gray-500 ml-2">{getParentName(item.parentId)}</span>}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditStart(item)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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


const AttributeManager: FC = () => {
    const [authToken, setAuthToken] = useState<string>('');
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
    const [subcategories, setSubcategories] = useState<{ id: string; name: string; parentId: string; }[]>([]);
    const [metalQualities, setMetalQualities] = useState<{ id: string; name: string; }[]>([]);
    const [metalColors, setMetalColors] = useState<{ id: string; name: string; }[]>([]);
    const [diamondShapes, setDiamondShapes] = useState<{ id: string; name: string; }[]>([]);
    const [diamondCuts, setDiamondCuts] = useState<{ id: string; name: string; }[]>([]);
    const [diamondClarities, setDiamondClarities] = useState<{ id: string; name: string; }[]>([]);
    const [diamondTones, setDiamondTones] = useState<{ id: string; name: string; }[]>([]);
    const [settingStyles, setSettingStyles] = useState<{ id: string; name: string; }[]>([]);
    
    const BASE_URL = 'http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory';

    // This config object is the single source of truth, preventing mismatches.
    const attributeConfig = {
        categories: { endpoint: '/productAttributes/categories', setter: setCategories },
        subcategories: { endpoint: '/productAttributes/subcategories', setter: setSubcategories },
        metalQualities: { endpoint: '/metalAttributes/purities', setter: setMetalQualities },
        metalColors: { endpoint: '/metalAttributes/colors', setter: setMetalColors },
        diamondShapes: { endpoint: '/diamondAttributes/shapes', setter: setDiamondShapes },
        diamondCuts: { endpoint: '/diamondAttributes/cuts', setter: setDiamondCuts },
        diamondClarities: { endpoint: '/diamondAttributes/clarities', setter: setDiamondClarities },
        diamondTones: { endpoint: '/diamondAttributes/colors', setter: setDiamondTones },
        settingStyles: { endpoint: '/productAttributes/settingStyles', setter: setSettingStyles },
    };

    const fetchData = useCallback(async (configKey: keyof typeof attributeConfig) => {
        if (!authToken) return;
        
        const { endpoint, setter } = attributeConfig[configKey];
        
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            const data = await response.json();
            const sourceArray = Array.isArray(data) ? data : (data.data && Array.isArray(data.data)) ? data.data : [];

            const formattedData = sourceArray
                .map((item: any) => ({
                    id: item._id || item.id,
                    name: item.title || item.name || item.value,
                    parentId: typeof item.parentId === 'object' ? item.parentId?._id : item.parentId
                }))
                .filter(item => item.id && item.name);

            setter(formattedData);
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            setter([]);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    const handleAdd = useCallback(async (configKey: keyof typeof attributeConfig, name: string, parentId?: string) => {
        if (!name.trim()) return;

        const { endpoint } = attributeConfig[configKey];
        
        // Consistent payload logic
        let payload: any = { title: name.trim() };
        if (['metalColors', 'diamondShapes', 'diamondCuts', 'diamondClarities', 'diamondTones'].includes(configKey)) {
            payload = { name: name.trim() };
        }
        if (['metalQualities', 'settingStyles'].includes(configKey)) {
            payload = { value: name.trim() };
        }

        // CRITICAL FIX: Ensure parentId is added to the payload for subcategories
        if (configKey === 'subcategories' && parentId) {
            payload.parentId = parentId;
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorBody = await response.json();
                console.error('API Error on Add:', errorBody);
                throw new Error(`Failed to add attribute. Status: ${response.status}`);
            }
            await fetchData(configKey);
        } catch (error) { console.error('Error adding attribute:', error); }
    }, [authToken, fetchData]);

    const handleEdit = useCallback(async (configKey: keyof typeof attributeConfig, id: string, newName: string, parentId?: string) => {
        if (!newName.trim()) return;

        const { endpoint } = attributeConfig[configKey];

        let payload: any = { title: newName.trim() };
        if (['metalColors', 'diamondShapes', 'diamondCuts', 'diamondClarities', 'diamondTones'].includes(configKey)) {
            payload = { name: newName.trim() };
        }
        if (['metalQualities', 'settingStyles'].includes(configKey)) {
            payload = { value: newName.trim() };
        }
        
        if (configKey === 'subcategories' && parentId) {
            payload.parentId = parentId;
        }
        
        try {
            const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('Failed to update attribute');
            await fetchData(configKey);
        } catch (error) { console.error('Error updating attribute:', error); }
    }, [authToken, fetchData]);

    const handleDelete = useCallback(async (configKey: keyof typeof attributeConfig, id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        const { endpoint } = attributeConfig[configKey];

        try {
            const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
            if (!response.ok) throw new Error('Failed to delete attribute');
            await fetchData(configKey);
        } catch (error) { console.error('Error deleting attribute:', error); }
    }, [authToken, fetchData]);

    useEffect(() => {
        const storedCredentials = localStorage.getItem('userCredentials');
        if (storedCredentials) setAuthToken(JSON.parse(storedCredentials).token);
    }, []);
    
    useEffect(() => {
        if (authToken) {
            (Object.keys(attributeConfig) as Array<keyof typeof attributeConfig>).forEach(key => {
                fetchData(key);
            });
        }
    }, [authToken]); // Removed fetchData from dependency array as it's stable

    const tabs = [{ id: 'categories', label: 'Categories' }, { id: 'metal', label: 'Metal Attributes' }, { id: 'diamond', label: 'Diamond Attributes' }, { id: 'other', label: 'Other' }];

    const getSectionContent = () => {
        switch (activeTab) {
            case 'categories':
                return (
                    <div className="space-y-6">
                        <AttributeList title="Categories" items={categories} onAdd={(name) => handleAdd('categories', name)} onEdit={(id, newName) => handleEdit('categories', id, newName)} onDelete={(id) => handleDelete('categories', id)} isLoading={loading} />
                        <AttributeList title="Subcategories" items={subcategories} onAdd={(name, parentId) => handleAdd('subcategories', name, parentId)} onEdit={(id, newName, parentId) => handleEdit('subcategories', id, newName, parentId)} onDelete={(id) => handleDelete('subcategories', id)} isLoading={loading} parentOptions={categories.map(c => ({ id: c.id, name: c.name }))} />
                    </div>
                );
            case 'metal':
                return (
                    <div className="space-y-6">
                        <AttributeList title="Metal Qualities" items={metalQualities} onAdd={(name) => handleAdd('metalQualities', name)} onEdit={(id, newName) => handleEdit('metalQualities', id, newName)} onDelete={(id) => handleDelete('metalQualities', id)} isLoading={loading} />
                        <AttributeList title="Metal Colors" items={metalColors} onAdd={(name) => handleAdd('metalColors', name)} onEdit={(id, newName) => handleEdit('metalColors', id, newName)} onDelete={(id) => handleDelete('metalColors', id)} isLoading={loading} />
                    </div>
                );
            case 'diamond':
                 return (
                    <div className="space-y-6">
                        <AttributeList title="Diamond Tones" items={diamondTones} onAdd={(name) => handleAdd('diamondTones', name)} onEdit={(id, newName) => handleEdit('diamondTones', id, newName)} onDelete={(id) => handleDelete('diamondTones', id)} isLoading={loading} />
                        <AttributeList title="Stone Clarities" items={diamondClarities} onAdd={(name) => handleAdd('diamondClarities', name)} onEdit={(id, newName) => handleEdit('diamondClarities', id, newName)} onDelete={(id) => handleDelete('diamondClarities', id)} isLoading={loading} />
                        <AttributeList title="Diamond Shapes" items={diamondShapes} onAdd={(name) => handleAdd('diamondShapes', name)} onEdit={(id, newName) => handleEdit('diamondShapes', id, newName)} onDelete={(id) => handleDelete('diamondShapes', id)} isLoading={loading} />
                        <AttributeList title="Stone Cuts" items={diamondCuts} onAdd={(name) => handleAdd('diamondCuts', name)} onEdit={(id, newName) => handleEdit('diamondCuts', id, newName)} onDelete={(id) => handleDelete('diamondCuts', id)} isLoading={loading} />
                    </div>
                );
            case 'other':
                return (
                    <div className="space-y-6">
                        <AttributeList title="Setting Styles" items={settingStyles} onAdd={(name) => handleAdd('settingStyles', name)} onEdit={(id, newName) => handleEdit('settingStyles', id, newName)} onDelete={(id) => handleDelete('settingStyles', id)} isLoading={loading} />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Manage Product Attributes</h1>
         </div>
         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
           <div className="border-b border-gray-200">
             <nav className="flex space-x-8 px-6 -mb-px">
                {tabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
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
