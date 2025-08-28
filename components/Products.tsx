import React, { useState, useCallback, memo, FC, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Upload, X, Star, Award, Gem, Palette, Ruler, Weight, FileText, Shield, DollarSign, Settings, Eye, Edit, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | '3d_model';
  file?: File;
}

interface DiamondOption {
  id: string;
  quality: string;
  count: number;
  shape: string;
  weight: number;
  isMain?: boolean;
}

// Variant now contains most of the specifications
interface Variant {
  id: string;
  price: number;
  sku: string;
  stock: number;
  metalQuality: string;
  metalColor: string;
  diamondTone: string;
  diamondWeight: number; // Total Carat Weight
  shape: string;
  settingType: string;
  metalGrossWeight: number;
  totalDiamonds: number;
  bandWidth: number;
  stoneClarity: string;
  stoneCut: string;
  sideStones: string;
  media: MediaFile[];
  diamondOptions: DiamondOption[];
  // Retaining these from the old interface for consistency
  diamondQuality: string;
  totalWeight: number;
}


interface JewelryProduct {
  id: string;
  name: string;
  media: MediaFile[];
  images: string[];
  metalQuality: string;
  metalColor: string;
  diamondQuality: string;
  diamondTone: string;
  diamondOptions: DiamondOption[];
  sizes: string[];
  metalGrossWeight: number;
  diamondWeight: number;
  shape: string;
  category: string;
  subCategory: string;
  variants: Variant[];
  description: string;
  diamondCertification: string;
  goldCertification: string;
  sideStones: string;
  status: string;
  rating: number;
  customizable: boolean;
  createdAt: string;
  occasion: string;
  gender: string;
  collection: string;
  stoneClarity: string;
  stoneColor: string;
  stoneCut: string;
  settingType: string;
  bandWidth: number;
  totalDiamonds: number;
  warranty: string;
  returnPolicy: string;
  tags: string[];
}

const hardcodedCategories = {
  'All': [],
  'Rings': ['Engagement Rings', 'Wedding Bands', 'Fashion Rings', 'Eternity Rings', 'Promise Rings'],
  'Necklaces': ['Pendant Necklaces', 'Chain Necklaces', 'Chokers', 'Statement Necklaces', 'Tennis Necklaces'],
  'Earrings': ['Stud Earrings', 'Drop Earrings', 'Hoop Earrings', 'Chandelier Earrings', 'Huggie Earrings'],
  'Bracelets': ['Tennis Bracelets', 'Chain Bracelets', 'Bangle Bracelets', 'Charm Bracelets', 'Cuff Bracelets'],
  'Pendants': ['Diamond Pendants', 'Gemstone Pendants', 'Religious Pendants', 'Initial Pendants', 'Heart Pendants'],
  'Sets': ['Bridal Sets', 'Necklace Sets', 'Earring Sets', 'Complete Sets']
};

type SizeMasterList = {
  [key in keyof typeof hardcodedCategories]: string[];
};

const getInitialNewProductState = (): Partial<JewelryProduct> => ({
  name: '',
  images: [],
  media: [],
  diamondOptions: [],
  metalQuality: '',
  metalColor: '',
  diamondQuality: '',
  diamondTone: '',
  sizes: [],
  metalGrossWeight: 0,
  diamondWeight: 0,
  shape: '',
  category: '',
  subCategory: '',
  variants: [],
  description: '',
  diamondCertification: '',
  goldCertification: '',
  sideStones: '',
  customizable: false,
  occasion: '',
  gender: '',
  collection: '',
  stoneClarity: '',
  stoneColor: '',
  stoneCut: '',
  settingType: '',
  bandWidth: 0,
  totalDiamonds: 0,
  warranty: '',
  returnPolicy: '',
  tags: [],
  rating: 0
});

interface EnhancedDropdownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  optionType: string;
  placeholder: string;
  className?: string;
  options: string[];
  addCustomOption: (optionType: string, newValue: string) => boolean;
  onAddOption?: (newValue: string) => Promise<void>;
}

const EnhancedDropdown: FC<EnhancedDropdownProps> = memo(({
  name,
  value,
  onChange,
  optionType,
  placeholder,
  className,
  options,
  addCustomOption,
  onAddOption
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');

  const handleAddNewOption = useCallback(async () => {
    if (newOptionValue.trim()) {
      if (onAddOption) {
        await onAddOption(newOptionValue.trim());
        const syntheticEvent = {
          target: { name, value: newOptionValue.trim() }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
        setNewOptionValue('');
        setShowAddNew(false);
      } else {
        const success = addCustomOption(optionType, newOptionValue);
        if (success) {
          const syntheticEvent = {
            target: { name, value: newOptionValue.trim() }
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(syntheticEvent);
          setNewOptionValue('');
          setShowAddNew(false);
        } else {
          alert('This option already exists!');
        }
      }
    }
  }, [newOptionValue, addCustomOption, optionType, name, onChange, onAddOption]);

  return (
    <div className="space-y-2">
      <select
        name={name}
        value={value}
        onChange={(e) => {
          if (e.target.value === '__ADD_NEW__') {
            setShowAddNew(true);
          } else {
            onChange(e);
          }
        }}
        className={className || "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
        <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New {optionType.replace(/([A-Z])/g, ' $1').toLowerCase()}</option>
      </select>

      {showAddNew && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="text"
            value={newOptionValue}
            onChange={(e) => setNewOptionValue(e.target.value)}
            placeholder={`Enter new ${optionType.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            className="flex-1 px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddNewOption();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddNewOption}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddNew(false);
              setNewOptionValue('');
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
});

EnhancedDropdown.displayName = 'EnhancedDropdown';

interface AddProductModalProps {
    show: boolean;
    onClose: () => void;
    editingProduct: JewelryProduct | null;
    newProduct: Partial<JewelryProduct>;
    setNewProduct: React.Dispatch<React.SetStateAction<Partial<JewelryProduct>>>;
    onAddProduct: (isEditing: boolean) => void;
    getAvailableSizes: () => string[];
    handleSizeToggle: (size: string) => void;
    sizeMasterList: SizeMasterList;
    setSizeMasterList: React.Dispatch<React.SetStateAction<SizeMasterList>>;
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    customOptions: { [key: string]: string[] };
    addCustomOption: (optionType: string, newValue: string) => boolean;
    getAllOptions: (optionType: string) => string[];
    apiCategories: { title: string; id: string }[];
    apiSubcategories: { title: string; id: string }[];
    onAddCategory: (newCategory: string) => Promise<void>;
    onAddSubcategory: (newSubcategory: string, parentId: string) => Promise<void>;
    onAddSettingStyle: (newSettingStyle: string) => Promise<void>;
    onAddMetalColor: (newMetalColor: string) => Promise<void>;
    onAddMetalQuality: (newMetalQuality: string) => Promise<void>;
    onAddDiamondColor: (newDiamondColor: string) => Promise<void>;
    onAddShape: (newShape: string) => Promise<void>;
    onAddClarity: (newClarity: string) => Promise<void>;
    onAddCut: (newCut: string) => Promise<void>;
    diamondAttributes: {
        shapes: string[];
        cuts: string[];
        clarities: string[];
    };
    settingStyles: string[];
    // Main media handlers
    handleMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeMedia: (mediaId: string) => void;
    // Variant specific handlers
    addVariant: () => void;
    removeVariant: (variantId: string) => void;
    handleVariantChange: (variantId: string, field: keyof Variant, value: any) => void;
    handleVariantMediaUpload: (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    removeVariantMedia: (variantId: string, mediaId: string) => void;
    addVariantDiamondOption: (variantId: string) => void;
    removeVariantDiamondOption: (variantId: string, optionId: string) => void;
    handleVariantDiamondOptionChange: (variantId: string, optionId: string, field: keyof DiamondOption, value: any) => void;
}

const AddProductModal: FC<AddProductModalProps> = memo(({
  show,
  onClose,
  editingProduct,
  newProduct,
  setNewProduct,
  onAddProduct,
  getAvailableSizes,
  handleSizeToggle,
  sizeMasterList,
  setSizeMasterList,
  activeTab,
  setActiveTab,
  customOptions,
  addCustomOption,
  getAllOptions,
  apiCategories,
  apiSubcategories,
  onAddCategory,
  onAddSubcategory,
  onAddSettingStyle,
  onAddMetalColor,
  onAddMetalQuality,
  onAddDiamondColor,
  onAddShape,
  onAddClarity,
  onAddCut,
  diamondAttributes,
  settingStyles,
  handleMediaUpload,
  removeMedia,
  addVariant,
  removeVariant,
  handleVariantChange,
  handleVariantMediaUpload,
  removeVariantMedia,
  addVariantDiamondOption,
  removeVariantDiamondOption,
  handleVariantDiamondOptionChange,
}) => {
  const [newSizeInput, setNewSizeInput] = useState('');
  const [showAddSizeInput, setShowAddSizeInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [showNewSettingStyleInput, setShowNewSettingStyleInput] = useState(false);
  const [newSettingStyleName, setNewSettingStyleName] = useState('');
  const [showNewDiamondColorInput, setShowNewDiamondColorInput] = useState(false);
  const [newDiamondColorName, setNewDiamondColorName] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setNewProduct(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      if (name === 'category') {
        setNewProduct(prev => ({ ...prev, [name]: value, subCategory: '' }));
        setShowNewSubcategoryInput(false);
      } else {
        setNewProduct(prev => ({ ...prev, [name]: value }));
      }
    }
  }, [setNewProduct]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewProduct(prev => ({ ...prev, tags }));
  }, [setNewProduct]);

  const handleAddSubcategory = useCallback(() => {
    if (newSubcategoryName.trim() && newProduct.category) {
      const parentCategory = apiCategories.find(c => c.title === newProduct.category);
      if (parentCategory) {
        onAddSubcategory(newSubcategoryName.trim(), parentCategory.id);
        setNewSubcategoryName('');
        setShowNewSubcategoryInput(false);
      } else {
        alert("Please select a valid parent category first.");
      }
    }
  }, [newSubcategoryName, newProduct.category, apiCategories, onAddSubcategory]);

  const handleAddNewSettingStyle = useCallback(() => {
    if (newSettingStyleName.trim()) {
      onAddSettingStyle(newSettingStyleName.trim());
      setNewSettingStyleName('');
      setShowNewSettingStyleInput(false);
    }
  }, [newSettingStyleName, onAddSettingStyle]);

  const handleAddNewDiamondColor = useCallback(() => {
    if (newDiamondColorName.trim()) {
      onAddDiamondColor(newDiamondColorName.trim());
      setNewDiamondColorName('');
      setShowNewDiamondColorInput(false);
    }
  }, [newDiamondColorName, onAddDiamondColor]);
    
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Edit Jewelry Product' : 'Add New Jewelry Product'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'basic', label: 'Basic Info', icon: FileText },
                { id: 'specifications', label: 'Specifications', icon: Gem },
                { id: 'customization', label: 'Customization', icon: Palette },
                { id: 'additional', label: 'Additional Info', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Eternal Solitaire Diamond Ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
                  <input
                    type="text"
                    name="collection"
                    value={newProduct.collection || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Eternal Collection"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <div className="space-y-2">
                    <select
                      name="category"
                      value={newProduct.category || ''}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        if (newCategory === '__ADD_NEW__') {
                          setShowNewCategoryInput(true);
                        } else {
                          handleInputChange(e);
                          setShowNewCategoryInput(false);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {apiCategories.map(category => (
                        <option key={category.id} value={category.title}>{category.title}</option>
                      ))}
                      <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Category</option>
                    </select>

                    {showNewCategoryInput && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter new category name"
                          className="flex-1 px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              onAddCategory(newCategoryName);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => onAddCategory(newCategoryName)}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewCategoryInput(false)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {newProduct.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
                    <div className="space-y-2">
                      <select
                        name="subCategory"
                        value={newProduct.subCategory || ''}
                        onChange={(e) => {
                          const newSubCategory = e.target.value;
                          if (newSubCategory === '__ADD_NEW__') {
                            setShowNewSubcategoryInput(true);
                          } else {
                            handleInputChange(e);
                            setShowNewSubcategoryInput(false);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select Sub Category</option>
                        {apiSubcategories.map(subCategory => (
                          <option key={subCategory.id} value={subCategory.title}>{subCategory.title}</option>
                        ))}
                        <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Subcategory</option>
                      </select>
                      
                      {showNewSubcategoryInput && (
                            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <input
                                    type="text"
                                    value={newSubcategoryName}
                                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                                    placeholder="Enter new subcategory name"
                                    className="flex-1 px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSubcategory();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubcategory}
                                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewSubcategoryInput(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <EnhancedDropdown
                    name="gender"
                    value={newProduct.gender || ''}
                    onChange={handleInputChange as any}
                    optionType="genders"
                    placeholder="Select Gender"
                    options={getAllOptions('genders')}
                    addCustomOption={addCustomOption}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <EnhancedDropdown
                    name="occasion"
                    value={newProduct.occasion || ''}
                    onChange={handleInputChange as any}
                    optionType="occasions"
                    placeholder="Select Occasion"
                    options={getAllOptions('occasions')}
                    addCustomOption={addCustomOption}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newProduct.tags?.join(', ') || ''}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="engagement, solitaire, diamond"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  name="description"
                  value={newProduct.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Detailed description of the jewelry piece..."
                />
              </div>
               <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Media *</label>
                    <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                        <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.gif,.glb,.gltf"
                        onChange={handleMediaUpload}
                        className="hidden"
                        id="media-upload-basic"
                        />
                        <label htmlFor="media-upload-basic" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload images, videos, GIFs or 3D models</p>
                        <p className="text-xs text-gray-500">PNG, JPG, MP4, MOV, GIF, GLB, GLTF up to 50MB each</p>
                        </label>
                    </div>
                    {(newProduct.media || []).length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                        {(newProduct.media || []).map((media) => (
                            <div key={media.id} className="relative">
                            {media.type === 'video' ? (
                                <div className="relative">
                                <video
                                    src={media.url}
                                    className="w-full h-24 object-cover rounded-lg border"
                                    controls={false}
                                    muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                    <Play className="h-8 w-8 text-white" />
                                </div>
                                </div>
                            ) : (
                                <div className="relative">
                                <img
                                    src={media.url}
                                    alt={`Preview ${media.type}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                                {media.type === 'gif' && (
                                    <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-1 rounded">
                                    GIF
                                    </div>
                                )}
                                {media.type === 'image' && (
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    <ImageIcon className="h-3 w-3" />
                                    </div>
                                )}
                                {media.type === '3d_model' && (
                                    <div className="absolute top-1 left-1 bg-teal-500 text-white text-xs px-1 rounded">
                                    3D
                                    </div>
                                )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeMedia(media.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                ×
                            </button>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
          )}
          {activeTab === 'specifications' && (
             <div className="space-y-6">
                 <div className="flex justify-end">
                     <button
                         type="button"
                         onClick={addVariant}
                         className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                     >
                         <Plus className="h-4 w-4" />
                         <span>Add Variant</span>
                     </button>
                 </div>

                 {(newProduct.variants || []).map((variant, index) => (
                     <div key={variant.id} className="border-2 border-gray-200 rounded-lg p-6 space-y-6 mb-6 relative bg-gray-50/50">
                         <div className="flex justify-between items-center border-b pb-4 mb-6">
                             <h3 className="text-lg font-semibold text-gray-800">Variant {index + 1}</h3>
                             <button
                                 type="button"
                                 onClick={() => removeVariant(variant.id)}
                                 className="text-red-500 hover:text-red-700 p-1"
                                 title="Remove Variant"
                             >
                                 <Trash2 className="h-5 w-5" />
                             </button>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                                <input
                                    type="text"
                                    value={variant.sku || ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="PROD-001-VAR1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={variant.price ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'price', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="150000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={variant.stock ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'stock', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="10"
                                />
                            </div>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Metal Quality</label>
                                 <EnhancedDropdown
                                     name="metalQuality"
                                     value={variant.metalQuality || ''}
                                     onChange={(e) => handleVariantChange(variant.id, 'metalQuality', e.target.value)}
                                     optionType="metalQualities"
                                     placeholder="Select Metal Quality"
                                     options={getAllOptions('metalQualities')}
                                     addCustomOption={addCustomOption}
                                     onAddOption={onAddMetalQuality}
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Metal Color</label>
                                 <EnhancedDropdown
                                     name="metalColor"
                                     value={variant.metalColor || ''}
                                     onChange={(e) => handleVariantChange(variant.id, 'metalColor', e.target.value)}
                                     optionType="metalColors"
                                     placeholder="Select Metal Color"
                                     options={getAllOptions('metalColors')}
                                     addCustomOption={addCustomOption}
                                     onAddOption={onAddMetalColor}
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Tone</label>
                                 <EnhancedDropdown
                                     name="diamondTone"
                                     value={variant.diamondTone || ''}
                                     onChange={(e) => handleVariantChange(variant.id, 'diamondTone', e.target.value)}
                                     optionType="diamondTones"
                                     placeholder="Select Diamond Tone"
                                     options={getAllOptions('diamondTones')}
                                     addCustomOption={addCustomOption}
                                     onAddOption={onAddDiamondColor}
                                 />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total Carat Weight</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={variant.diamondWeight ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'diamondWeight', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="1.5"
                                />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                                 <EnhancedDropdown
                                     name="shape"
                                     value={variant.shape || ''}
                                     onChange={(e) => handleVariantChange(variant.id, 'shape', e.target.value)}
                                     optionType="shapes"
                                     placeholder="Select Shape"
                                     options={diamondAttributes.shapes}
                                     addCustomOption={addCustomOption}
                                     onAddOption={onAddShape}
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Setting Type</label>
                                 <EnhancedDropdown
                                     name="settingType"
                                     value={variant.settingType || ''}
                                     onChange={(e) => handleVariantChange(variant.id, 'settingType', e.target.value)}
                                     optionType="settingTypes"
                                     placeholder="Select Setting Type"
                                     options={settingStyles}
                                     addCustomOption={addCustomOption}
                                     onAddOption={onAddSettingStyle}
                                 />
                             </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Metal Gross Weight (Grams)</label>
                                <input
                                    type="number" step="0.1"
                                    value={variant.metalGrossWeight ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'metalGrossWeight', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="3.2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total Diamonds</label>
                                <input
                                    type="number"
                                    value={variant.totalDiamonds ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'totalDiamonds', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Band Width (mm)</label>
                                <input
                                    type="number" step="0.1"
                                    value={variant.bandWidth ?? ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'bandWidth', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stone Clarity</label>
                                <EnhancedDropdown
                                    name="stoneClarity"
                                    value={variant.stoneClarity || ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'stoneClarity', e.target.value)}
                                    optionType="clarities"
                                    placeholder="Select Clarity"
                                    options={diamondAttributes.clarities}
                                    addCustomOption={addCustomOption}
                                    onAddOption={onAddClarity}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stone Cut</label>
                                <EnhancedDropdown
                                    name="stoneCut"
                                    value={variant.stoneCut || ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'stoneCut', e.target.value)}
                                    optionType="cuts"
                                    placeholder="Select Cut"
                                    options={diamondAttributes.cuts}
                                    addCustomOption={addCustomOption}
                                    onAddOption={onAddCut}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Side Stones</label>
                                <input
                                    type="text"
                                    value={variant.sideStones || ''}
                                    onChange={(e) => handleVariantChange(variant.id, 'sideStones', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="e.g., 24 Round Diamonds (0.48ct)"
                                />
                            </div>
                         </div>
                         
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Media</label>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*,.gif,.glb,.gltf"
                                    onChange={(e) => handleVariantMediaUpload(variant.id, e)}
                                    className="hidden"
                                    id={`media-upload-${variant.id}`}
                                />
                                <label htmlFor={`media-upload-${variant.id}`} className="cursor-pointer">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload media for this variant</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, MP4, MOV, GIF, GLB, GLTF</p>
                                </label>
                                </div>
                                {variant.media.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {variant.media.map((media) => (
                                    <div key={media.id} className="relative">
                                        {media.type === 'video' ? (
                                             <video src={media.url} className="w-full h-24 object-cover rounded-lg border" controls={false} muted />
                                        ) : (
                                            <img src={media.url} alt="Preview" className="w-full h-24 object-cover rounded-lg border"/>
                                        )}
                                        <button
                                        type="button"
                                        onClick={() => removeVariantMedia(variant.id, media.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                        ×
                                        </button>
                                    </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h4 className="text-md font-medium text-gray-800 mb-4 border-t pt-6">Diamond Options for Variant {index + 1}</h4>
                             <button
                                type="button"
                                onClick={() => addVariantDiamondOption(variant.id)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mb-4"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Diamond Option</span>
                            </button>
                            {variant.diamondOptions.map((diamond, dIndex) => (
                                <div key={diamond.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-medium text-gray-700">Diamond {dIndex + 1}</h5>
                                        <button type="button" onClick={() => removeVariantDiamondOption(variant.id, diamond.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                                            <EnhancedDropdown name="quality" value={diamond.quality} onChange={(e) => handleVariantDiamondOptionChange(variant.id, diamond.id, 'quality', e.target.value)} optionType="clarities" placeholder="Quality" options={diamondAttributes.clarities} addCustomOption={addCustomOption} onAddOption={onAddClarity}/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                                            <input type="number" min="1" value={diamond.count} onChange={(e) => handleVariantDiamondOptionChange(variant.id, diamond.id, 'count', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                                            <EnhancedDropdown name="shape" value={diamond.shape} onChange={(e) => handleVariantDiamondOptionChange(variant.id, diamond.id, 'shape', e.target.value)} optionType="shapes" placeholder="Shape" options={diamondAttributes.shapes} addCustomOption={addCustomOption} onAddOption={onAddShape}/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (ct)</label>
                                            <input type="number" step="0.01" min="0" value={diamond.weight} onChange={(e) => handleVariantDiamondOptionChange(variant.id, diamond.id, 'weight', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 ))}
                 {(newProduct.variants || []).length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <Gem className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No variants added yet.</p>
                        <p className="text-sm">Click "Add Variant" to create the first version of this product.</p>
                    </div>
                )}
             </div>
          )}

          {activeTab === 'customization' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="customizable"
                  name="customizable"
                  checked={newProduct.customizable || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="customizable" className="text-sm font-medium text-gray-700">Allow customization for this product</label>
              </div>
              {newProduct.customizable && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Customization Options</h4>
                  <p className="text-sm text-amber-700">When enabled, customers can request modifications to metal type, stone selection, sizing, engraving options, and other specifications. Custom orders will require approval and may have extended delivery times.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stone Color</label>
                  <input
                    type="text"
                    name="stoneColor"
                    value={newProduct.stoneColor || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., D, E, F"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onAddProduct(!!editingProduct)} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

AddProductModal.displayName = 'AddProductModal';


interface ApiDiamondConfig {
  diamond: {
    clarity: string;
    cut: string;
    color: string;
    shape: string;
    certification: {
      authority: string;
      number: string;
    };
  };
  quantity: number;
  _id: string;
}

// REPLACE your current ApiMetalConfig interface with this one

interface ApiMetalConfig {
  _id: string;
  colorId: { name: string };
  purityId: { value: string };
  // --- ADD THIS PROPERTY BACK (marked as optional) ---
  certification?: {
    authority: string;
    number: string;
  };
  // --- END OF CORRECTION ---
}

// REPLACE your old ApiVariant interface with this accurate one
interface ApiVariant {
  _id: string;
  SKU: string;
  media: {
    images: string[];
    model3dUrl?: string[];
    videoUrl?: string;
  };
  metalConfig: ApiMetalConfig;
  diamondConfigs: any[];
  priceBreakdown: any;
  isAvailable: boolean; // This property exists in the API response.
  stock: number; // This is the property the backend will add.
}

interface ApiProduct {
  _id: string;
  title: string;
  media: {
    coverImages: string[];
    model3dUrl?: string[];
    videoUrl?: string;
  };
  variants: ApiVariant[];
}

interface ProductApiResponse {
  products: ApiProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


const Products: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<JewelryProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<JewelryProduct | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const [customOptions, setCustomOptions] = useState<{ [key: string]: string[] }>({
    metalQualities: [],
    metalColors: [],
    diamondQualities: [],
    diamondTones: [],
    shapes: [],
    occasions: [],
    genders: [],
    settingTypes: [],
    stoneCuts: []
  });

  const [products, setProducts] = useState<JewelryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<{ title: string, id: string }[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<{ title: string, id: string }[]>([]);
  const [apiSettingStyles, setApiSettingStyles] = useState<string[]>([]);
  const [apiMetalColors, setApiMetalColors] = useState<string[]>([]);
  const [apiMetalQualities, setApiMetalQualities] = useState<string[]>([]);
  const [apiDiamondColors, setApiDiamondColors] = useState<string[]>([]);
  const [authToken, setAuthToken] = useState<string>('');
  const [newProduct, setNewProduct] = useState<Partial<JewelryProduct>>(getInitialNewProductState());


  const [diamondAttributes, setDiamondAttributes] = useState({
    shapes: [],
    cuts: [],
    clarities: [],
  });
  
  // All variant logic is now in the parent component
  const addVariant = useCallback(() => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      price: 0,
      sku: '',
      stock: 0,
      metalQuality: '',
      metalColor: '',
      diamondTone: '',
      diamondWeight: 0,
      shape: '',
      settingType: '',
      metalGrossWeight: 0,
      totalDiamonds: 0,
      bandWidth: 0,
      stoneClarity: '',
      stoneCut: '',
      sideStones: '',
      media: [],
      diamondOptions: [],
      diamondQuality: '',
      totalWeight: 0,
    };
    setNewProduct(prev => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
  }, [setNewProduct]);

  const removeVariant = useCallback((variantId: string) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).filter(v => v.id !== variantId)
    }));
  }, [setNewProduct]);

  const handleVariantChange = useCallback((variantId: string, field: keyof Variant, value: any) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }));
  }, [setNewProduct]);
  
  const getMediaType = (file: File): 'image' | 'video' | 'gif' | '3d_model' => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.name.toLowerCase().endsWith('.gif') || file.type === 'image/gif') return 'gif';
    if (file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf')) return '3d_model';
    return 'image';
  };

  const handleMediaUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMediaFiles: MediaFile[] = files.map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        type: getMediaType(file),
        file
    }));

    setNewProduct(prev => ({
        ...prev,
        media: [...(prev.media || []), ...newMediaFiles],
        images: [...(prev.images || []), ...newMediaFiles.filter(m => m.type === 'image').map(m => m.url)]
    }));
  }, [setNewProduct]);

  const removeMedia = useCallback((mediaId: string) => {
      setNewProduct(prev => {
          const updatedMedia = (prev.media || []).filter(m => m.id !== mediaId);
          const removedMedia = (prev.media || []).find(m => m.id === mediaId);

          if (removedMedia && removedMedia.url.startsWith('blob:')) {
              URL.revokeObjectURL(removedMedia.url);
          }
          
          return {
              ...prev,
              media: updatedMedia,
              images: updatedMedia.filter(m => m.type === 'image').map(m => m.url)
          };
      });
  }, [setNewProduct]);

  const handleVariantMediaUpload = useCallback((variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMediaFiles: MediaFile[] = files.map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      type: getMediaType(file),
      file
    }));

    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => 
        v.id === variantId ? { ...v, media: [...v.media, ...newMediaFiles] } : v
      )
    }));
  }, [setNewProduct]);

  const removeVariantMedia = useCallback((variantId: string, mediaId: string) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => {
        if (v.id === variantId) {
          const removedMedia = v.media.find(m => m.id === mediaId);
          if (removedMedia && removedMedia.url.startsWith('blob:')) {
            URL.revokeObjectURL(removedMedia.url);
          }
          return { ...v, media: v.media.filter(m => m.id !== mediaId) };
        }
        return v;
      })
    }));
  }, [setNewProduct]);

  const addVariantDiamondOption = useCallback((variantId: string) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => {
        if (v.id === variantId) {
          const newOption: DiamondOption = {
            id: crypto.randomUUID(),
            quality: 'VVS1',
            count: 1,
            shape: 'Round',
            weight: 0.5,
            isMain: v.diamondOptions.length === 0
          };
          return { ...v, diamondOptions: [...v.diamondOptions, newOption] };
        }
        return v;
      })
    }));
  }, [setNewProduct]);

  const removeVariantDiamondOption = useCallback((variantId: string, optionId: string) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => 
        v.id === variantId ? { ...v, diamondOptions: v.diamondOptions.filter(opt => opt.id !== optionId) } : v
      )
    }));
  }, [setNewProduct]);

  const handleVariantDiamondOptionChange = useCallback((variantId: string, optionId: string, field: keyof DiamondOption, value: any) => {
    setNewProduct(prev => ({
      ...prev,
      variants: (prev.variants || []).map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            diamondOptions: v.diamondOptions.map(opt => 
              opt.id === optionId ? { ...opt, [field]: value } : opt
            )
          };
        }
        return v;
      })
    }));
  }, [setNewProduct]);


  const fetchDiamondAttributes = useCallback(async () => {
    try {
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamonds/attributes');
      if (!response.ok) {
        throw new Error('Failed to fetch diamond attributes');
      }
      const data = await response.json();
      setDiamondAttributes({
        shapes: data.shapes.map((item: { name: string; }) => item.name),
        cuts: data.cuts.map((item: { name: string; }) => item.name),
        clarities: data.clarities.map((item: { name: string; }) => item.name),
      });
    } catch (error) {
      console.error("Error fetching diamond attributes:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const storedCredentials = localStorage.getItem('userCredentials');
      if (storedCredentials) {
        const { token } = JSON.parse(storedCredentials);
        setAuthToken(token);
      }
    } catch (e) {
      console.error('Failed to parse user credentials from localStorage');
    }
  }, []);

// REPLACE your fetchProducts function with this FINAL, FUTURE-PROOF version

const fetchProducts = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false);
      setError('Authentication token not found. Please log in.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/products', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ProductApiResponse = await response.json();

      const transformedProducts: JewelryProduct[] = data.products.map((apiProduct) => {
        const mainVariant = apiProduct.variants[0];

        const variants: Variant[] = apiProduct.variants.map((v: ApiVariant) => ({
            id: v._id,
            sku: v.SKU,
            // --- THIS IS THE CORRECTED LOGIC ---
            // It will read the stock number when the backend adds it.
            // If it's missing or null, it safely defaults to 0, preventing errors.
            stock: v.stock ?? 0,
            // --- END OF CORRECTION ---
            metalQuality: v.metalConfig.purityId.value,
            diamondQuality: v.diamondConfigs[0]?.diamond.clarity || '',
            price: v.priceBreakdown?.total || 0,
            totalWeight: 0,
            metalColor: v.metalConfig.colorId.name,
            diamondTone: v.diamondConfigs[0]?.diamond.color || '',
            diamondWeight: 0,
            shape: v.diamondConfigs[0]?.diamond.shape || '',
            settingType: '',
            metalGrossWeight: 0,
            totalDiamonds: v.diamondConfigs.reduce((sum, dc) => sum + dc.quantity, 0),
            bandWidth: 0,
            stoneClarity: v.diamondConfigs[0]?.diamond.clarity || '',
            stoneCut: v.diamondConfigs[0]?.diamond.cut || '',
            sideStones: '',
            media: [],
            diamondOptions: [],
        }));

        const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

        return {
          id: apiProduct._id,
          name: apiProduct.title,
          status: totalStock > 0 ? 'Active' : 'Out of Stock',
          variants: variants,
          media: [],
          images: apiProduct.media.coverImages,
          metalQuality: mainVariant?.metalConfig?.purityId?.value || '',
          metalColor: mainVariant?.metalConfig?.colorId?.name || '',
          diamondQuality: mainVariant?.diamondConfigs?.[0]?.diamond?.clarity || '',
          diamondTone: mainVariant?.diamondConfigs?.[0]?.diamond?.color || '',
          diamondOptions: [],
          sizes: [],
          metalGrossWeight: 0,
          diamondWeight: 0,
          shape: mainVariant?.diamondConfigs?.[0]?.diamond?.shape || '',
          category: 'Rings',
          subCategory: 'Engagement Rings',
          description: '',
          diamondCertification: mainVariant?.diamondConfigs?.[0]?.diamond?.certification?.authority || '',
          goldCertification: mainVariant?.metalConfig?.certification?.authority || '',
          sideStones: '',
          rating: 0,
          customizable: false,
          createdAt: new Date().toISOString().split('T')[0],
          occasion: '',
          gender: '',
          collection: '',
          stoneClarity: mainVariant?.diamondConfigs?.[0]?.diamond?.clarity || '',
          stoneColor: mainVariant?.diamondConfigs?.[0]?.diamond?.color || '',
          stoneCut: mainVariant?.diamondConfigs?.[0]?.diamond?.cut || '',
          settingType: '',
          bandWidth: 0,
          totalDiamonds: mainVariant?.diamondConfigs?.reduce((sum, config) => sum + config.quantity, 0) || 0,
          warranty: '',
          returnPolicy: '',
          tags: [],
        };
      });
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please check the API URL and your network connection.');
    } finally {
      setIsLoading(false);
    }
}, [authToken]);

  const fetchCategories = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/categories', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const fetchedCategories = Array.isArray(data) ? data.map((c: { title: string, _id: string }) => ({ title: c.title, id: c._id })) : [];
      setApiCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [authToken]);

  const fetchSubcategories = useCallback(async (categoryTitle: string) => {
    if (!authToken || !categoryTitle || categoryTitle === 'All') {
      setApiSubcategories([]);
      return;
    }
    try {
      // Fetch all subcategories and filter on the client-side
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/subcategories', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch subcategories:', response.status, response.statusText);
        setApiSubcategories([]);
        throw new Error('Failed to fetch subcategories');
      }

      const data = await response.json();
      const filteredSubcategories = Array.isArray(data)
        ? data
          .filter((sub: any) => sub.parentId && sub.parentId.title === categoryTitle)
          .map((sub: { title: string, _id: string }) => ({ title: sub.title, id: sub._id }))
        : [];
      
      setApiSubcategories(filteredSubcategories);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setApiSubcategories([]);
    }
  }, [authToken]);

  const fetchSettingStyles = useCallback(async () => {
      if (!authToken) return;
      try {
          const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/settingStyles', {
              headers: {
                  'Authorization': `Bearer ${authToken}`,
              },
          });
          if (!response.ok) {
              throw new Error('Failed to fetch setting styles');
          }
          const data = await response.json();
          const fetchedStyles = Array.isArray(data) ? data.map((style: { title: string }) => style.title) : [];
          setApiSettingStyles(fetchedStyles);
      } catch (error) {
          console.error("Error fetching setting styles:", error);
      }
  }, [authToken]);

  const fetchMetalColors = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/metalAttributes/colors', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metal colors');
      }
      const data = await response.json();
      const fetchedColors = Array.isArray(data.metalColors) ? data.metalColors.map((color: { name: string }) => color.name) : [];
      setApiMetalColors(fetchedColors);
    } catch (error) {
      console.error("Error fetching metal colors:", error);
    }
  }, [authToken]);

  const fetchMetalQualities = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/metalAttributes/purities', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metal purities');
      }
      const data = await response.json();
      const fetchedQualities = Array.isArray(data.metalPurities) ? data.metalPurities.map((purity: { value: string }) => purity.value) : [];
      setApiMetalQualities(fetchedQualities);
    } catch (error) {
      console.error("Error fetching metal purities:", error);
    }
  }, [authToken]);

  const fetchDiamondColors = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamondAttributes/colors', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch diamond colors');
      }
      const data = await response.json();
      const fetchedColors = Array.isArray(data.diamondColors) ? data.diamondColors.map((color: { name: string }) => color.name) : [];
      setApiDiamondColors(fetchedColors);
    } catch (error) {
      console.error("Error fetching diamond colors:", error);
    }
  }, [authToken]);


  const handleAddMetalColor = useCallback(async (newMetalColorName: string) => {
    if (!authToken || !newMetalColorName.trim()) {
      alert("Metal color name cannot be empty.");
      return;
    }

    try {
      const payload = {
        name: newMetalColorName.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/metalAttributes/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add metal color: ${errorData.message}`);
      }

      alert('Metal color added successfully!');
      fetchMetalColors();
      setNewProduct(prev => ({ ...prev, metalColor: newMetalColorName.trim() }));
    } catch (error) {
      console.error('Error adding new metal color:', error);
      alert('Failed to add new metal color. Please try again.');
    }
  }, [authToken, fetchMetalColors, setNewProduct]);

  const handleAddMetalQuality = useCallback(async (newMetalQualityValue: string) => {
    if (!authToken || !newMetalQualityValue.trim()) {
      alert("Metal quality value cannot be empty.");
      return;
    }
    
    try {
      const payload = {
        value: newMetalQualityValue.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/metalAttributes/purities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add metal purity: ${errorData.message}`);
      }

      alert('Metal purity added successfully!');
      fetchMetalQualities(); // Refresh the list
      setNewProduct(prev => ({ ...prev, metalQuality: newMetalQualityValue.trim() }));
    } catch (error) {
      console.error('Error adding new metal purity:', error);
      alert('Failed to add new metal purity. Please try again.');
    }
  }, [authToken, fetchMetalQualities, setNewProduct]);

  const handleAddDiamondColor = useCallback(async (newDiamondColorName: string) => {
    if (!authToken || !newDiamondColorName.trim()) {
      alert("Diamond color name cannot be empty.");
      return;
    }
    
    try {
      const payload = {
        name: newDiamondColorName.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamondAttributes/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add diamond color: ${errorData.message}`);
      }

      alert('Diamond color added successfully!');
      fetchDiamondColors(); // Refresh the list
      setNewProduct(prev => ({ ...prev, diamondTone: newDiamondColorName.trim() }));
    } catch (error) {
      console.error('Error adding new diamond color:', error);
      alert('Failed to add new diamond color. Please try again.');
    }
  }, [authToken, fetchDiamondColors, setNewProduct]);

  const handleAddShape = useCallback(async (newShapeName: string) => {
    if (!authToken || !newShapeName.trim()) {
      alert("Shape name cannot be empty.");
      return;
    }
    
    try {
      const payload = {
        name: newShapeName.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamondAttributes/shapes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add shape: ${errorData.message}`);
      }

      alert('Shape added successfully!');
      fetchDiamondAttributes(); // Refresh the list of all diamond attributes
      setNewProduct(prev => ({ ...prev, shape: newShapeName.trim() }));
    } catch (error) {
      console.error('Error adding new shape:', error);
      alert('Failed to add new shape. Please try again.');
    }
  }, [authToken, fetchDiamondAttributes, setNewProduct]);

  const handleAddClarity = useCallback(async (newClarityName: string) => {
    if (!authToken || !newClarityName.trim()) {
      alert("Clarity name cannot be empty.");
      return;
    }
    
    try {
      const payload = {
        name: newClarityName.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamondAttributes/clarities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add clarity: ${errorData.message}`);
      }

      alert('Clarity added successfully!');
      fetchDiamondAttributes(); // Refresh the list
      setNewProduct(prev => ({ ...prev, stoneClarity: newClarityName.trim() }));
    } catch (error) {
      console.error('Error adding new clarity:', error);
      alert('Failed to add new clarity. Please try again.');
    }
  }, [authToken, fetchDiamondAttributes, setNewProduct]);

  const handleAddCut = useCallback(async (newCutName: string) => {
    if (!authToken || !newCutName.trim()) {
      alert("Cut name cannot be empty.");
      return;
    }
    
    try {
      const payload = {
        name: newCutName.trim(),
        isActive: true,
      };

      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/diamondAttributes/cuts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add cut: ${errorData.message}`);
      }

      alert('Cut added successfully!');
      fetchDiamondAttributes(); // Refresh the list
      setNewProduct(prev => ({ ...prev, stoneCut: newCutName.trim() }));
    } catch (error) {
      console.error('Error adding new cut:', error);
      alert('Failed to add new cut. Please try again.');
    }
  }, [authToken, fetchDiamondAttributes, setNewProduct]);

  useEffect(() => {
    if (authToken) {
      fetchProducts();
      fetchCategories();
      fetchDiamondAttributes();
      fetchSettingStyles();
      fetchMetalColors();
      fetchMetalQualities();
      fetchDiamondColors();
    }
  }, [authToken, fetchProducts, fetchCategories, fetchDiamondAttributes, fetchSettingStyles, fetchMetalColors, fetchMetalQualities, fetchDiamondColors]);
  
  useEffect(() => {
    fetchSubcategories(newProduct.category || '');
  }, [newProduct.category, fetchSubcategories]);


  const initialSizeMasterList: SizeMasterList = {
    'All': [],
    'Rings': ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    'Necklaces': ['14 inches', '16 inches', '18 inches', '20 inches', '22 inches', '24 inches', '26 inches', '28 inches', '30 inches'],
    'Earrings': ['Small', 'Medium', 'Large'],
    'Bracelets': ['6.5 inches', '7 inches', '7.5 inches', '8 inches', '8.5 inches', '9 inches'],
    'Pendants': ['Small (10-15mm)', 'Medium (16-25mm)', 'Large (26-35mm)', 'Extra Large (36mm+)'],
    'Sets': ['Standard', 'Adjustable']
  };

  const [sizeMasterList, setSizeMasterList] = useState<SizeMasterList>(initialSizeMasterList);

  const diamondQualities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const diamondTones = apiDiamondColors.length > 0 ? apiDiamondColors : ['D (Colorless)', 'E (Colorless)', 'F (Colorless)', 'G (Near Colorless)', 'H (Near Colorless)', 'I (Near Colorless)', 'J (Near Colorless)'];
  const shapes = ['Round Brilliant', 'Princess', 'Emerald Cut', 'Asscher', 'Oval', 'Marquise', 'Pear', 'Heart', 'Cushion', 'Radiant'];
  const occasions = ['Engagement', 'Wedding', 'Anniversary', 'Birthday', 'Valentine', 'Graduation', 'Everyday'];
  const genders = ['male', 'female', 'unisex'];
  const settingTypes = ['Prong Setting', 'Bezel Setting', 'Pave Setting', 'Channel Setting', 'Halo Setting', 'Tension Setting'];
  const stoneCuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

  const addCustomOption = useCallback((optionType: string, newValue: string) => {
    if (newValue.trim() && !getAllOptions(optionType).includes(newValue.trim())) {
      const newOption = newValue.trim();
      setCustomOptions(prev => ({
        ...prev,
        [optionType]: [...prev[optionType], newOption]
      }));
      console.log(`New ${optionType} option added:`, newOption);
      return true;
    }
    return false;
  }, [customOptions]);

  const getAllOptions = useCallback((optionType: string) => {
    const baseOptions: { [key: string]: string[] } = {
      metalQualities: apiMetalQualities,
      metalColors: apiMetalColors,
      diamondQualities,
      diamondTones,
      shapes,
      occasions,
      genders,
      settingTypes,
      stoneCuts
    };
    return [...(baseOptions[optionType] || []), ...(customOptions[optionType] || [])];
  }, [apiMetalQualities, apiMetalColors, diamondQualities, diamondTones, shapes, occasions, genders, settingTypes, stoneCuts, customOptions]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.variants[0] && product.variants[0].sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.shape.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || product.subCategory === selectedSubCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete product: ${response.status} ${response.statusText} - ${errorText}`);
        }

        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product.');
      }
    }
  };

// PASTE THIS ENTIRE NEW FUNCTION INTO YOUR `Products` COMPONENT

const handleUpdateProduct = async () => {
    // Ensure we have the original product state to compare against
    if (!editingProduct || !newProduct) {
        alert("Error: Cannot update product without original data.");
        return;
    }

    const updatePromises: Promise<Response>[] = [];

    // --- PART 1: Handle Product-Level Details ---
    const productDetailsPayload: { [key: string]: any } = {};

    if (editingProduct.name !== newProduct.name) {
        productDetailsPayload.title = newProduct.name;
    }
    if (editingProduct.description !== newProduct.description) {
        productDetailsPayload.description = newProduct.description;
    }
    // Add other product-level fields to compare here (e.g., category, collection, etc.)
    // if (editingProduct.category !== newProduct.category) { ... }

    // If product-level details changed, create a PATCH request for the main product
    if (Object.keys(productDetailsPayload).length > 0) {
        console.log("Product-level changes detected:", productDetailsPayload);
        const productUpdateUrl = `http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products/${editingProduct.id}`;
        
        const productUpdatePromise = fetch(productUpdateUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(productDetailsPayload),
        });
        updatePromises.push(productUpdatePromise);
    }


    // --- PART 2: Handle Variant-Level Details ---
    newProduct.variants?.forEach(editedVariant => {
        const originalVariant = editingProduct.variants?.find(v => v.id === editedVariant.id);

        if (originalVariant) { // This variant existed before, check for changes
            const variantPayload: { [key: string]: any } = {};

            // Compare each field and add to payload if it changed
            if (originalVariant.sku !== editedVariant.sku) {
                variantPayload.SKU = editedVariant.sku;
            }
            if (originalVariant.price !== editedVariant.price) {
                variantPayload.price = editedVariant.price;
            }
            // AFTER THE FIX:
if (originalVariant.stock !== editedVariant.stock) {
    variantPayload.stock = editedVariant.stock; // Send the number directly
}
            // Add other variant-specific fields here to compare...

            // If any field changed, create a PATCH request for this specific variant
            if (Object.keys(variantPayload).length > 0) {
                console.log(`Changes detected for variant SKU ${originalVariant.sku}. Payload:`, variantPayload);
                const variantUpdateUrl = `http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products/variants/${editedVariant.id}`;
                
                const variantUpdatePromise = fetch(variantUpdateUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(variantPayload),
                });
                updatePromises.push(variantUpdatePromise);
            }
        }
        // NOTE: This logic only handles UPDATING existing variants.
        // A full implementation would also need to handle creating new variants (POST)
        // and deleting removed variants (DELETE).
    });

    // --- PART 3: Execute all API Calls ---
    if (updatePromises.length === 0) {
        alert("No changes detected.");
        setShowAddModal(false);
        return;
    }

    try {
        const responses = await Promise.all(updatePromises);
        const failedResponses = responses.filter(res => !res.ok);

        if (failedResponses.length > 0) {
            const errorData = await failedResponses[0].json();
            throw new Error(`Failed to update. First error: ${errorData.message || 'Unknown error'}`);
        }

        alert('Product updated successfully!');
        fetchProducts(); // Refresh data
        setShowAddModal(false);
        setEditingProduct(null);
        setNewProduct(getInitialNewProductState());

    } catch (error) {
        console.error("Error during product update:", error);
        alert(`Failed to update product. See console for details.`);
    }
};

// DELETE your old `handleAddProduct` and REPLACE it with this one.

const handleAddProduct = async (isEditing: boolean) => {
    // --- If we are editing, delegate to the new update function and stop ---
    if (isEditing) {
        await handleUpdateProduct();
        return;
    }
    
    // --- The rest of this function is for CREATING a NEW product only ---

    // --- Validations for new product ---
    if (!newProduct.name || !newProduct.category || !newProduct.subCategory || !newProduct.variants || newProduct.variants.length === 0) {
        alert('Please fill in Product Name, Category, Subcategory, and at least one Variant.');
        return;
    }
    const areVariantsValid = newProduct.variants.every(v => v.sku && v.price > 0 && v.stock >= 0);
    if (!areVariantsValid) {
        alert('Please ensure all variants have a SKU, Price, and Stock.');
        return;
    }
    
    // --- Helper Lookups for IDs ---
    const categoryId = apiCategories.find(c => c.title === newProduct.category)?.id;
    const subCategoryId = apiSubcategories.find(sc => sc.title === newProduct.subCategory)?.id;
    const collectionId = "6893804364b9d32b9955b719"; // Placeholder ID
    const settingStyleId = "6893804364b9d32b9955b71c"; // Placeholder ID

    if (!categoryId || !subCategoryId) {
        alert('Could not find a valid ID for the selected Category or Subcategory.');
        return;
    }

    // --- Media Processing ---
    const imageMedia = (newProduct.media || []).filter(m => m.type === 'image');
    const videoMedia = (newProduct.media || []).find(m => m.type === 'video');
    const model3dMedia = (newProduct.media || []).find(m => m.type === '3d_model');

    // --- Payload Construction for NEW product ---
    // (This is your original payload logic, which is correct for a POST request)
    const payload = {
        title: newProduct.name,
        description: newProduct.description,
        size: newProduct.sizes || [],
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        collectionId: collectionId,
        settingStyleId: settingStyleId,
        productType: "standard",
        sizeChart: "https://example.com/size-chart.jpg",
        qualityAssurance: newProduct.warranty || "Lifetime warranty on gold and diamonds",
        careInstructions: "Avoid contact with chemicals",
        dimensions: { length: 2.5, width: 2.5, height: 1.2, unit: "cm" },
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isCustomizable: newProduct.customizable || false,
        isGiftable: true,
        gender: newProduct.gender,
        seo: {
            metaTitle: `${newProduct.name} - ${newProduct.metalQuality || 'Gold'}`.trim(),
            metaDescription: `Buy this elegant ${newProduct.name}. ${newProduct.description}`.trim(),
            metaKeywords: [newProduct.category, newProduct.subCategory, "diamond", "jewelry", ...(newProduct.tags || [])],
            tags: newProduct.tags || [],
        },
        media: {
            coverImages: imageMedia.map(m => m.url),
            videoUrl: videoMedia ? videoMedia.url : undefined,
            model3dUrl: model3dMedia ? [model3dMedia.url] : [],
        },
        engravingOptions: { allowed: true, maxChars: 15, font: "Serif", location: "inside band", language: "English", additionalCost: 20 },
        warranty: { period: "Lifetime", details: newProduct.warranty || "Covers manufacturing defects" },
        returnPolicy: { period: "30 days", isReturnable: true, details: newProduct.returnPolicy || "Returns accepted with original packaging" },
        variants: (newProduct.variants || []).map((variant, index) => ({
            metalConfig: "6893804264b9d32b9955b6fa",
            diamondConfigs: (variant.diamondOptions || []).map(opt => ({
                diamond: "6893804264b9d32b9955b710",
                quantity: opt.count,
            })),
            totalWeight: variant.totalWeight || variant.metalGrossWeight || 0,
            price: variant.price,
            SKU: variant.sku,
            stock: {
                status: variant.stock > 0 ? "in-stock" : "out-of-stock",
                quantity: variant.stock,
            },
            isActive: true,
            isDefault: index === 0,
            isAvailable: variant.stock > 0,
            media: {
                images: variant.media.filter(m => m.type === 'image').map(m => m.url),
                videoUrl: variant.media.find(m => m.type === 'video')?.url,
                model3dUrl: variant.media.find(m => m.type === '3d_model') ? [variant.media.find(m => m.type === '3d_model')!.url] : [],
            }
        })),
    };
    
    console.log("Submitting POST Payload:", JSON.stringify(payload, null, 2));

    const url = `http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.message}`);
        }

        alert(`Product added successfully!`);
        fetchProducts();
        setShowAddModal(false);
        setNewProduct(getInitialNewProductState());
    } catch (error) {
        console.error(`Error adding product:`, error);
        alert(`Failed to add product. See console for details.`);
    }
};


  const handleViewProduct = (product: JewelryProduct) => {
    setViewingProduct(product);
    setSelectedMediaIndex(0);
  };

  const handleEditProduct = (product: JewelryProduct) => {
    setEditingProduct(product);
    const productToEdit = {
      ...product,
      variants: product.variants.map(v => ({ ...v, id: v.id || crypto.randomUUID() })),
      diamondOptions: product.diamondOptions?.map(option => ({
        ...option,
        id: option.id || crypto.randomUUID()
      })) || [],
      media: product.media || []
    };
    setNewProduct(productToEdit);
    setShowAddModal(true);
  };

  const handleSizeToggle = useCallback((size: string) => {
    const currentSizes = newProduct.sizes || [];
    if (currentSizes.includes(size)) {
      setNewProduct(prev => ({ ...prev, sizes: currentSizes.filter(s => s !== size) }));
    } else {
      setNewProduct(prev => ({ ...prev, sizes: [...currentSizes, size] }));
    }
  }, [newProduct.sizes, setNewProduct]);

  const getAvailableSizes = useCallback(() => {
    if (!newProduct.category) return [];
    const category = newProduct.category as keyof SizeMasterList;
    return (sizeMasterList as any)[category] || [];
  }, [newProduct.category, sizeMasterList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCategory = async (newCategoryName: string) => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      const payload = {
        title: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase().replace(/ /g, '-'),
      };
      
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add category: ${errorData.message}`);
      }

      alert('Category added successfully!');
      fetchCategories();
      setNewProduct(prev => ({ ...prev, category: newCategoryName.trim() }));
      
    } catch (error) {
      console.error('Error adding new category:', error);
      alert('Failed to add new category. Please try again.');
    }
  };

  const handleAddSubcategory = useCallback(async (newSubcategoryTitle: string, parentId: string) => {
    if (!newSubcategoryTitle.trim()) {
        alert("Subcategory name cannot be empty.");
        return;
    }

    try {
        const payload = {
            title: newSubcategoryTitle.trim(),
            parentId: parentId,
            images: [],
        };

        const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/subcategories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to add subcategory: ${errorData.message}`);
        }

        alert('Subcategory added successfully!');
        fetchSubcategories(newProduct.category || '');
        setNewProduct(prev => ({ ...prev, subCategory: newSubcategoryTitle.trim() }));
    } catch (error) {
        console.error('Error adding new subcategory:', error);
        alert('Failed to add new subcategory. Please try again.');
    }
  }, [authToken, fetchSubcategories, newProduct.category, setNewProduct]);

  const handleAddSettingStyle = useCallback(async (newSettingStyleTitle: string) => {
    if (!newSettingStyleTitle.trim()) {
        alert("Setting style name cannot be empty.");
        return;
    }
    
    try {
        const payload = {
            title: newSettingStyleTitle.trim(),
            slug: newSettingStyleTitle.trim().toLowerCase().replace(/ /g, '-'),
            description: '',
            images: [],
            isActive: true,
        };
        const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/productAttributes/settingStyles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to add setting style: ${errorData.message}`);
        }

        alert('Setting style added successfully!');
        fetchSettingStyles(); // Refresh the list
    } catch (error) {
        console.error('Error adding new setting style:', error);
        alert('Failed to add new setting style. Please try again.');
    }
  }, [authToken, fetchSettingStyles]);

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jewelry Products</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2"></div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingProduct(null);
              setNewProduct(getInitialNewProductState());
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Jewelry Product</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category & Collection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight & Dimensions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock & Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        {product.media && product.media.length > 0 ? (
                          <>
                            {product.media[0].type === 'video' ? (
                              <div className="relative">
                                <video
                                  src={product.media[0].url}
                                  className="h-16 w-16 object-cover rounded-md"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
                                  <Play className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <img
                                className="h-16 w-16 object-cover rounded-md"
                                src={product.media[0].url}
                                alt={product.name}
                              />
                            )}
                            {product.media.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs px-1 py-0.5 rounded-full">
                                +{product.media.length - 1}
                              </div>
                            )}
                            {product.media[0].type === 'gif' && (
                              <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-1 rounded">
                                GIF
                              </div>
                            )}
                            {product.media[0].type === '3d_model' && (
                              <div className="absolute top-1 left-1 bg-teal-500 text-white text-xs px-1 rounded">
                                3D
                              </div>
                            )}
                          </>
                        ) : (
                          <img className="h-16 w-16 object-cover rounded-md" src={product.images[0]} alt={product.name} />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.variants[0]?.sku}</div>
                        {product.customizable && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                            <Palette className="h-3 w-3 mr-1" />
                            Customizable
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{product.category}</div>
                      <div className="text-gray-500">{product.subCategory}</div>
                      <div className="text-gray-500 text-xs">{product.collection}</div>
                      <div className="text-gray-500 text-xs">{product.occasion} • {product.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{product.metalQuality} {product.metalColor}</div>
                      <div className="text-gray-500">{product.shape}</div>
                      <div className="text-gray-500">{product.diamondQuality} - {product.diamondTone}</div>
                      <div className="text-gray-500 text-xs">{product.settingType}</div>
                      {product.diamondOptions && product.diamondOptions.length > 0 && (
                        <div className="text-xs text-purple-600 mt-1">
                          {product.diamondOptions.length} diamond option{product.diamondOptions.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Metal: {product.metalGrossWeight}g</div>
                      <div>Diamond: {product.diamondWeight}ct</div>
                      <div className="text-gray-500 text-xs">Band: {product.bandWidth}mm</div>
                      <div className="text-gray-500 text-xs">Stones: {product.totalDiamonds}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Shield className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs">{product.diamondCertification}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Award className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs">{product.goldCertification}</span>
                      </div>
                      <div className="text-xs text-gray-500">{product.warranty} warranty</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">Stock: {product.variants.reduce((sum, v) => sum + v.stock, 0)}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-amber-600 hover:text-amber-900 p-1 hover:bg-amber-50 rounded"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
          setNewProduct(getInitialNewProductState());
        }}
        onAddProduct={handleAddProduct}
        editingProduct={editingProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        getAvailableSizes={getAvailableSizes}
        handleSizeToggle={handleSizeToggle}
        sizeMasterList={sizeMasterList}
        setSizeMasterList={setSizeMasterList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customOptions={customOptions}
        addCustomOption={addCustomOption}
        getAllOptions={getAllOptions}
        apiCategories={apiCategories}
        apiSubcategories={apiSubcategories}
        onAddCategory={handleAddCategory}
        onAddSubcategory={handleAddSubcategory}
        onAddSettingStyle={handleAddSettingStyle}
        onAddMetalColor={handleAddMetalColor}
        onAddMetalQuality={handleAddMetalQuality}
        onAddDiamondColor={handleAddDiamondColor}
        onAddShape={handleAddShape}
        onAddClarity={handleAddClarity}
        onAddCut={handleAddCut}
        diamondAttributes={diamondAttributes}
        settingStyles={apiSettingStyles}
        handleMediaUpload={handleMediaUpload}
        removeMedia={removeMedia}
        addVariant={addVariant}
        removeVariant={removeVariant}
        handleVariantChange={handleVariantChange}
        handleVariantMediaUpload={handleVariantMediaUpload}
        removeVariantMedia={removeVariantMedia}
        addVariantDiamondOption={addVariantDiamondOption}
        removeVariantDiamondOption={removeVariantDiamondOption}
        handleVariantDiamondOptionChange={handleVariantDiamondOptionChange}
      />

      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                <button onClick={() => setViewingProduct(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {viewingProduct.media && viewingProduct.media.length > 0 ? (
                    <div className="space-y-4">
                      <div className="relative">
                        {viewingProduct.media[selectedMediaIndex]?.type === 'video' ? (
                          <video
                            src={viewingProduct.media[selectedMediaIndex].url}
                            className="w-full h-64 object-cover rounded-lg"
                            controls
                            key={viewingProduct.media[selectedMediaIndex].id}
                          />
                        ) : (
                          <img
                            src={viewingProduct.media[selectedMediaIndex]?.url || viewingProduct.media[0].url}
                            alt={viewingProduct.name}
                            className="w-full h-64 object-cover rounded-lg cursor-zoom-in"
                            onClick={() => {
                              console.log('Image clicked for fullscreen view');
                            }}
                          />
                        )}

                        {viewingProduct.media[selectedMediaIndex]?.type === 'gif' && (
                          <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                            GIF
                          </div>
                        )}
                        {viewingProduct.media[selectedMediaIndex]?.type === '3d_model' && (
                          <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                            3D Model
                          </div>
                        )}

                        {viewingProduct.media.length > 1 && (
                          <>
                            <button
                              onClick={() => setSelectedMediaIndex(prev =>
                                prev === 0 ? viewingProduct.media!.length - 1 : prev - 1
                              )}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setSelectedMediaIndex(prev =>
                                prev === viewingProduct.media!.length - 1 ? 0 : prev + 1
                              )}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {viewingProduct.media.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {selectedMediaIndex + 1} / {viewingProduct.media.length}
                          </div>
                        )}
                      </div>

                      {viewingProduct.media.length > 1 && (
                        <div className="grid grid-cols-6 gap-2">
                          {viewingProduct.media.map((media, index) => (
                            <div
                              key={media.id}
                              className={`relative cursor-pointer border-2 rounded ${
                                index === selectedMediaIndex
                                  ? 'border-amber-500 ring-2 ring-amber-200'
                                  : 'border-gray-200 hover:border-amber-300'
                              }`}
                              onClick={() => setSelectedMediaIndex(index)}
                            >
                              {media.type === 'video' ? (
                                <div className="relative">
                                  <video
                                    src={media.url}
                                    className="w-full h-16 object-cover rounded"
                                    muted
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                    <Play className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={media.url}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-16 object-cover rounded"
                                />
                              )}
                              {media.type === 'gif' && (
                                <div className="absolute top-0 left-0 bg-purple-500 text-white text-xs px-1 rounded">
                                  GIF
                                </div>
                              )}
                              {media.type === '3d_model' && (
                                <div className="absolute top-0 left-0 bg-teal-500 text-white text-xs px-1 rounded">
                                  3D
                                </div>
                              )}
                              {index === selectedMediaIndex && (
                                <div className="absolute inset-0 border-2 border-amber-500 rounded bg-amber-500 bg-opacity-20"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={viewingProduct.images[0]}
                      alt={viewingProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h3>
                    <p className="text-gray-600">SKU: {viewingProduct.variants[0]?.sku}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-amber-600">
                      ₹{viewingProduct.variants[0]?.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-600">{viewingProduct.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Metal:</span>
                      <p className="text-gray-600">{viewingProduct.metalQuality} {viewingProduct.metalColor}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <p className="text-gray-600">{viewingProduct.variants.reduce((sum, v) => sum + v.stock, 0)} units</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Weight:</span>
                      <p className="text-gray-600">{viewingProduct.metalGrossWeight}g</p>
                    </div>
                  </div>

                  {viewingProduct.diamondOptions && viewingProduct.diamondOptions.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Diamond Options:</span>
                      <div className="mt-2 space-y-2">
                        {viewingProduct.diamondOptions.map((diamond, index) => (
                          <div key={diamond.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-purple-800">
                                Option {index + 1}
                                {diamond.isMain && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    Main
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {diamond.count} × {diamond.shape} {diamond.quality} diamond{diamond.count > 1 ? 's' : ''}, {diamond.weight}ct total
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-gray-700">Certifications:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {viewingProduct.diamondCertification}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {viewingProduct.goldCertification}
                      </span>
                      <div className="text-xs text-gray-500">{viewingProduct.warranty} warranty</div>
                    </div>
                  </div>
                  {viewingProduct.customizable && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Customizable</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Products;