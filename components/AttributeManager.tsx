import React, { useState, useCallback, useEffect, FC } from 'react';
import { Plus, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

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
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
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
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                        }}
                      />
                      <button onClick={handleEditSave} className="text-green-600 hover:text-green-800 p-1 rounded">Save</button>
                      <button onClick={() => setEditingItem(null)} className="text-red-600 hover:text-red-800 p-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800 text-sm">{item.name}</span>
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
  const [metalTypes, setMetalTypes] = useState<{ id: string; name: string; }[]>([]); // New state for metal types
  const [diamondShapes, setDiamondShapes] = useState<{ id: string; name: string; }[]>([]);
  const [diamondCuts, setDiamondCuts] = useState<{ id: string; name: string; }[]>([]);
  const [diamondClarities, setDiamondClarities] = useState<{ id: string; name: string; }[]>([]);
  const [diamondTones, setDiamondTones] = useState<{ id: string; name: string; }[]>([]);
  const [settingStyles, setSettingStyles] = useState<{ id: string; name: string; }[]>([]);
  const [genders, setGenders] = useState<{ id: string; name: string; }[]>([]);
  const [occasions, setOccasions] = useState<{ id: string; name: string; }[]>([]);

  useEffect(() => {
    const savedGenders = localStorage.getItem('genders');
    if (savedGenders) setGenders(JSON.parse(savedGenders));
    else setGenders([{ id: 'local-gender-1', name: 'Women' }, { id: 'local-gender-2', name: 'Men' }, { id: 'local-gender-3', name: 'Unisex' }]);
    const savedOccasions = localStorage.getItem('occasions');
    if (savedOccasions) setOccasions(JSON.parse(savedOccasions));
    else setOccasions([{ id: 'local-occasion-1', name: 'Engagement' }, { id: 'local-occasion-2', name: 'Wedding' }, { id: 'local-occasion-3', name: 'Anniversary' }]);
  }, []);

  useEffect(() => { localStorage.setItem('genders', JSON.stringify(genders)); }, [genders]);
  useEffect(() => { localStorage.setItem('occasions', JSON.stringify(occasions)); }, [occasions]);
  const handleLocalAdd = (setter: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>, name: string) => setter(prev => [...prev, { id: crypto.randomUUID(), name }]);
  const handleLocalEdit = (setter: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>, id: string, newName: string) => setter(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  const handleLocalDelete = (setter: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>, id: string) => { if (window.confirm('Are you sure?')) setter(prev => prev.filter(item => item.id !== id)); };

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

      const formattedData = sourceArray
        .map((item: any) => {
          let parentIdValue = null;
          if (typeof item.parentId === 'string') {
            parentIdValue = item.parentId;
          } else if (typeof item.parentId === 'object' && item.parentId !== null) {
            parentIdValue = item.parentId._id || item.parentId.id || null;
          }
          return {
            id: item._id,
            name: item.title || item.name || item.value,
            parentId: parentIdValue
          };
        })
        .filter(item => item.id);

      stateSetter(formattedData);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      stateSetter([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);
  
  const handleAdd = useCallback(async (endpoint: string, name: string, parentId?: string) => {
    if (!name.trim()) return;
    let payload: any = { title: name.trim() };
    if (endpoint.includes('colors') || endpoint.includes('shapes') || endpoint.includes('cuts') || endpoint.includes('clarities') || endpoint.includes('types')) {
      payload = { name: name.trim() };
    }
    if (endpoint.includes('purities')) payload = { value: name.trim() };
    if (parentId) payload.parentId = parentId;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to add attribute');
      await fetchData(endpoint, getSetter(endpoint));
    } catch (error) { console.error('Error adding attribute:', error); }
  }, [authToken, fetchData]);

  const handleEdit = useCallback(async (endpoint: string, id: string, newName: string, parentId?: string) => {
    if (!newName.trim()) return;
    let payload: any = { title: newName.trim() };
    if (endpoint.includes('colors') || endpoint.includes('shapes') || endpoint.includes('cuts') || endpoint.includes('clarities') || endpoint.includes('types')) {
      payload = { name: newName.trim() };
    }
    if (endpoint.includes('purities')) payload = { value: newName.trim() };
    
    if (parentId && endpoint.includes('subcategories')) {
      payload.parentId = parentId;
    }
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Failed to update attribute');
      await fetchData(endpoint, getSetter(endpoint));
    } catch (error) { console.error('Error updating attribute:', error); }
  }, [authToken, fetchData]);

  const handleDelete = useCallback(async (endpoint: string, id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`${BASE_URL}${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
      if (!response.ok) throw new Error('Failed to delete attribute');
      await fetchData(endpoint, getSetter(endpoint));
    } catch (error) { console.error('Error deleting attribute:', error); }
  }, [authToken, fetchData]);

  const getSetter = (endpoint: string): React.Dispatch<any> => {
    const settersMap: { [key: string]: React.Dispatch<any> } = {
      '/productAttributes/categories': setCategories,
      '/productAttributes/subcategories': setSubcategories,
      '/metalAttributes/purities': setMetalQualities,
      '/metalAttributes/colors': setMetalColors,
      '/metalAttributes/types': setMetalTypes, // Added setter for metal types
      '/diamondAttributes/shapes': setDiamondShapes,
      '/diamondAttributes/cuts': setDiamondCuts,
      '/diamondAttributes/clarities': setDiamondClarities,
      '/diamondAttributes/colors': setDiamondTones,
      '/productAttributes/settingStyles': setSettingStyles,
    };
    return settersMap[endpoint] || (() => {});
  };
  
  useEffect(() => {
    if (authToken) {
      fetchData('/productAttributes/categories', setCategories);
      fetchData('/productAttributes/subcategories', setSubcategories);
      fetchData('/metalAttributes/purities', setMetalQualities);
      fetchData('/metalAttributes/colors', setMetalColors);
      fetchData('/metalAttributes/types', setMetalTypes); // Fetch metal types
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
      case 'categories':
        return (
          <div className="space-y-6">
            <AttributeList title="Categories" items={categories} onAdd={(name) => handleAdd('/productAttributes/categories', name)} onEdit={(id, newName) => handleEdit('/productAttributes/categories', id, newName)} onDelete={(id) => handleDelete('/productAttributes/categories', id)} isLoading={loading} />
            <AttributeList title="Subcategories" items={subcategories} onAdd={(name, parentId) => handleAdd('/productAttributes/subcategories', name, parentId)} onEdit={(id, newName, parentId) => handleEdit('/productAttributes/subcategories', id, newName, parentId)} onDelete={(id) => handleDelete('/productAttributes/subcategories', id)} isLoading={loading} parentOptions={categories.map(c => ({ id: c.id, name: c.name }))} />
          </div>
        );
      case 'metal':
        return (
          <div className="space-y-6">
             <AttributeList title="Metal Types" items={metalTypes} onAdd={(name) => handleAdd('/metalAttributes/types', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/types', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/types', id)} isLoading={loading} />
            <AttributeList title="Metal Qualities" items={metalQualities} onAdd={(name) => handleAdd('/metalAttributes/purities', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/purities', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/purities', id)} isLoading={loading} />
            <AttributeList title="Metal Colors" items={metalColors} onAdd={(name) => handleAdd('/metalAttributes/colors', name)} onEdit={(id, newName) => handleEdit('/metalAttributes/colors', id, newName)} onDelete={(id) => handleDelete('/metalAttributes/colors', id)} isLoading={loading} />
          </div>
        );
      case 'diamond':
        return (
          <div className="space-y-6">
            <AttributeList title="Diamond Tones" items={diamondTones} onAdd={(name) => handleAdd('/diamondAttributes/colors', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/colors', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/colors', id)} isLoading={loading} />
            <AttributeList title="Stone Clarities" items={diamondClarities} onAdd={(name) => handleAdd('/diamondAttributes/clarities', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/clarities', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/clarities', id)} isLoading={loading} />
            <AttributeList title="Diamond Shapes" items={diamondShapes} onAdd={(name) => handleAdd('/diamondAttributes/shapes', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/shapes', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/shapes', id)} isLoading={loading} />
            <AttributeList title="Stone Cuts" items={diamondCuts} onAdd={(name) => handleAdd('/diamondAttributes/cuts', name)} onEdit={(id, newName) => handleEdit('/diamondAttributes/cuts', id, newName)} onDelete={(id) => handleDelete('/diamondAttributes/cuts', id)} isLoading={loading} />
          </div>
        );
      case 'other':
        return (
          <div className="space-y-6">
            <AttributeList title="Setting Styles" items={settingStyles} onAdd={(name) => handleAdd('/productAttributes/settingStyles', name)} onEdit={(id, newName) => handleEdit('/productAttributes/settingStyles', id, newName)} onDelete={(id) => handleDelete('/productAttributes/settingStyles', id)} isLoading={loading} />
            {/* <AttributeList title="Genders" items={genders} onAdd={(name) => handleLocalAdd(setGenders, name)} onEdit={(id, newName) => handleLocalEdit(setGenders, id, newName)} onDelete={(id) => handleLocalDelete(setGenders, id)} isLoading={false} />
            <AttributeList title="Occasions" items={occasions} onAdd={(name) => handleLocalAdd(setOccasions, name)} onEdit={(id, newName) => handleLocalEdit(setOccasions, id, newName)} onDelete={(id) => handleLocalDelete(setOccasions, id)} isLoading={false} /> */}
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