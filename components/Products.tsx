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

interface PricingTier {
  id: string;
  metalName: string;
  metalSubCategory: string;
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
  sku: string;
  shape: string;
  category: string;
  subCategory: string;
  pricingTiers: PricingTier[];
  stock: number;
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
  sku: '',
  shape: '',
  category: '',
  subCategory: '',
  pricingTiers: [],
  stock: 0,
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
  imagePreviewUrls: string[];
  setImagePreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  onAddProduct: (isEditing: boolean) => void;
  getAvailableSizes: () => string[];
  handleSizeToggle: (size: string) => void;
  sizeMasterList: SizeMasterList;
  setSizeMasterList: React.Dispatch<React.SetStateAction<SizeMasterList>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  metalTypes: { [key: string]: string[] };
  metalQualities: string[];
  metalColors: string[];
  diamondQualities: string[];
  diamondTones: string[];
  shapes: string[];
  occasions: string[];
  genders: string[];
  settingTypes: string[];
  stoneCuts: string[];
  customOptions: { [key: string]: string[] };
  addCustomOption: (optionType: string, newValue: string) => boolean;
  getAllOptions: (optionType: string) => string[];
  apiCategories: { title: string, id: string }[];
  apiSubcategories: { title: string, id: string }[];
  onAddCategory: (newCategory: string) => Promise<void>;
  onAddSubcategory: (newSubcategory: string, parentId: string) => Promise<void>;
  onAddSettingStyle: (newSettingStyle: string) => Promise<void>;
  onAddMetalColor: (newMetalColor: string) => Promise<void>;
  onAddMetalQuality: (newMetalQuality: string) => Promise<void>;
  onAddDiamondColor: (newDiamondColor: string) => Promise<void>;
  diamondAttributes: {
    shapes: string[];
    cuts: string[];
    clarities: string[];
  };
  settingStyles: string[];
}

const AddProductModal: FC<AddProductModalProps> = memo(({
  show,
  onClose,
  editingProduct,
  newProduct,
  setNewProduct,
  imagePreviewUrls,
  setImagePreviewUrls,
  selectedImages,
  setSelectedImages,
  onAddProduct,
  getAvailableSizes,
  handleSizeToggle,
  sizeMasterList,
  setSizeMasterList,
  activeTab,
  setActiveTab,
  metalTypes,
  metalQualities,
  metalColors,
  diamondQualities,
  diamondTones,
  shapes,
  occasions,
  genders,
  settingTypes,
  stoneCuts,
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
  diamondAttributes,
  settingStyles
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

  const handleRatingChange = useCallback((rating: number) => {
    setNewProduct(prev => ({ ...prev, rating }));
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
      images: [...(prev.images || []), ...newMediaFiles.map(m => m.url)]
    }));

    const allFiles = [...selectedImages, ...files];
    const allUrls = [...imagePreviewUrls, ...newMediaFiles.map(m => m.url)];
    setSelectedImages(allFiles);
    setImagePreviewUrls(allUrls);
  }, [selectedImages, imagePreviewUrls, setSelectedImages, setImagePreviewUrls, setNewProduct]);

  const removeMedia = useCallback((mediaId: string) => {
    setNewProduct(prev => {
      const updatedMedia = (prev.media || []).filter(m => m.id !== mediaId);
      const removedMedia = (prev.media || []).find(m => m.id === mediaId);

      if (removedMedia) {
        if (removedMedia.url.startsWith('blob:')) {
          URL.revokeObjectURL(removedMedia.url);
        }
        const newUrls = imagePreviewUrls.filter(url => url !== removedMedia.url);
        const newFiles = selectedImages.filter((_, i) => imagePreviewUrls[i] !== removedMedia.url);
        setImagePreviewUrls(newUrls);
        setSelectedImages(newFiles);
      }

      return {
        ...prev,
        media: updatedMedia,
        images: updatedMedia.filter(m => m.type === 'image').map(m => m.url)
      };
    });
  }, [selectedImages, imagePreviewUrls, setSelectedImages, setImagePreviewUrls, setNewProduct]);

  const handlePricingTierChange = useCallback((id: string, field: keyof PricingTier, value: string | number) => {
    const updatedTiers = (newProduct.pricingTiers || []).map(tier => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    setNewProduct(prev => ({ ...prev, pricingTiers: updatedTiers }));
  }, [newProduct.pricingTiers, setNewProduct]);

  const addPricingTier = useCallback(() => {
    const newTier: PricingTier = {
      id: crypto.randomUUID(),
      metalName: 'Gold',
      metalSubCategory: '14K'
    };
    setNewProduct(prev => ({ ...prev, pricingTiers: [...(prev.pricingTiers || []), newTier] }));
  }, [setNewProduct]);

  const removePricingTier = useCallback((id: string) => {
    const updatedTiers = (newProduct.pricingTiers || []).filter(tier => tier.id !== id);
    setNewProduct(prev => ({ ...prev, pricingTiers: updatedTiers }));
  }, [newProduct.pricingTiers, setNewProduct]);

  const addDiamondOption = useCallback(() => {
    const newDiamondOption: DiamondOption = {
      id: crypto.randomUUID(),
      quality: 'VVS1',
      count: 1,
      shape: 'Round Brilliant',
      weight: 0.5,
      isMain: (newProduct.diamondOptions || []).length === 0
    };
    setNewProduct(prev => ({ ...prev, diamondOptions: [...(prev.diamondOptions || []), newDiamondOption] }));
  }, [newProduct.diamondOptions, setNewProduct]);

  const removeDiamondOption = useCallback((id: string) => {
    const updatedOptions = (newProduct.diamondOptions || []).filter(option => option.id !== id);
    setNewProduct(prev => ({ ...prev, diamondOptions: updatedOptions }));
  }, [newProduct.diamondOptions, setNewProduct]);

  const handleDiamondOptionChange = useCallback((id: string, field: keyof DiamondOption, value: string | number | boolean) => {
    const updatedOptions = (newProduct.diamondOptions || []).map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setNewProduct(prev => ({ ...prev, diamondOptions: updatedOptions }));
  }, [newProduct.diamondOptions, setNewProduct]);

  const handleAddNewSize = useCallback(() => {
    if (newSizeInput.trim() && newProduct.category) {
      const category = newProduct.category as keyof SizeMasterList;
      if ((sizeMasterList as any)[category] && !(sizeMasterList as any)[category].includes(newSizeInput.trim())) {
        setSizeMasterList(prev => ({ ...prev, [category]: [...(prev as any)[category], newSizeInput.trim()] }));
      }
      setNewSizeInput('');
      setShowAddSizeInput(false);
    }
  }, [newSizeInput, newProduct.category, sizeMasterList, setSizeMasterList]);

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

  const renderStars = useCallback((rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          </button>
        ))}
        {interactive && (
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 ? `${rating}/5` : 'No rating'}
          </span>
        )}
      </div>
    );
  }, [handleRatingChange]);

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
                { id: 'pricing', label: 'Pricing & Tiers', icon: DollarSign },
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    value={newProduct.sku || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., ESR-18K-001"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock === 0 ? '' : newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="10"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Media *</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.gif,.glb,.gltf"
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="cursor-pointer">
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
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gem className="inline h-4 w-4 mr-1" /> Metal Quality
                  </label>
                  <EnhancedDropdown
                    name="metalQuality"
                    value={newProduct.metalQuality || ''}
                    onChange={handleInputChange as any}
                    optionType="metalQualities"
                    placeholder="Select Metal Quality"
                    options={getAllOptions('metalQualities')}
                    addCustomOption={addCustomOption}
                    onAddOption={onAddMetalQuality}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" /> Metal Color
                  </label>
                  <EnhancedDropdown
                    name="metalColor"
                    value={newProduct.metalColor || ''}
                    onChange={handleInputChange as any}
                    optionType="metalColors"
                    placeholder="Select Metal Color"
                    options={getAllOptions('metalColors')}
                    addCustomOption={addCustomOption}
                    onAddOption={onAddMetalColor}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Quality</label>
                  <EnhancedDropdown
                    name="diamondQuality"
                    value={newProduct.diamondQuality || ''}
                    onChange={handleInputChange as any}
                    optionType="diamondQualities"
                    placeholder="Select Diamond Quality"
                    options={getAllOptions('diamondQualities')}
                    addCustomOption={addCustomOption}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Tone</label>
                  <select
                    name="diamondTone"
                    value={newProduct.diamondTone || ''}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowNewDiamondColorInput(true);
                      } else {
                        handleInputChange(e);
                        setShowNewDiamondColorInput(false);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Diamond Tone</option>
                    {diamondTones.map(tone => (<option key={tone} value={tone}>{tone}</option>))}
                    <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Diamond Tone</option>
                  </select>
                  {showNewDiamondColorInput && (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                      <input
                        type="text"
                        value={newDiamondColorName}
                        onChange={(e) => setNewDiamondColorName(e.target.value)}
                        placeholder="Enter new diamond color (e.g., 'D', 'H')"
                        className="flex-1 px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNewDiamondColor();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewDiamondColor}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewDiamondColorInput(false)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                  <EnhancedDropdown
                    name="shape"
                    value={newProduct.shape || ''}
                    onChange={handleInputChange as any}
                    optionType="shapes"
                    placeholder="Select Shape"
                    options={diamondAttributes.shapes}
                    addCustomOption={addCustomOption}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setting Type</label>
                  <select
                    name="settingType"
                    value={newProduct.settingType || ''}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowNewSettingStyleInput(true);
                      } else {
                        handleInputChange(e);
                        setShowNewSettingStyleInput(false);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Setting Type</option>
                    {settingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                    <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Setting Style</option>
                  </select>
                  {showNewSettingStyleInput && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                          <input
                              type="text"
                              value={newSettingStyleName}
                              onChange={(e) => setNewSettingStyleName(e.target.value)}
                              placeholder="Enter new setting style"
                              className="flex-1 px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                      handleAddNewSettingStyle();
                                  }
                              }}
                          />
                          <button
                              type="button"
                              onClick={handleAddNewSettingStyle}
                              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                              Add
                          </button>
                          <button
                              type="button"
                              onClick={() => setShowNewSettingStyleInput(false)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                          >
                              <X className="h-4 w-4" />
                          </button>
                      </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="inline h-4 w-4 mr-1" /> Metal Gross Weight (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="metalGrossWeight"
                    value={newProduct.metalGrossWeight === 0 ? '' : newProduct.metalGrossWeight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="3.2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Weight (Carat)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="diamondWeight"
                    value={newProduct.diamondWeight === 0 ? '' : newProduct.diamondWeight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="1.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Diamonds</label>
                  <input
                    type="number"
                    name="totalDiamonds"
                    value={newProduct.totalDiamonds === 0 ? '' : newProduct.totalDiamonds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Band Width (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="bandWidth"
                    value={newProduct.bandWidth === 0 ? '' : newProduct.bandWidth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stone Clarity</label>
                  <select
                    name="stoneClarity"
                    value={newProduct.stoneClarity || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Clarity</option>
                    {diamondAttributes.clarities.map(clarity => (<option key={clarity} value={clarity}>{clarity}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stone Cut</label>
                  <select
                    name="stoneCut"
                    value={newProduct.stoneCut || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Cut</option>
                    {diamondAttributes.cuts.map(cut => (<option key={cut} value={cut}>{cut}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side Stones</label>
                  <input
                    type="text"
                    name="sideStones"
                    value={newProduct.sideStones || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., 24 Round Diamonds (0.48ct)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline h-4 w-4 mr-1" /> Available Sizes {newProduct.category && `(${newProduct.category})`}
                </label>
                {newProduct.category ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-6 gap-2">
                      {getAvailableSizes().map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                            (newProduct.sizes || []).includes(size)
                              ? 'bg-amber-100 border-amber-500 text-amber-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      {!showAddSizeInput ? (
                        <button
                          type="button"
                          onClick={() => setShowAddSizeInput(true)}
                          className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add New Size for {newProduct.category}</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newSizeInput}
                            onChange={(e) => setNewSizeInput(e.target.value)}
                            placeholder={`e.g., ${newProduct.category === 'Necklaces' ? '32 inches' : newProduct.category === 'Rings' ? '12.5' : '16mm'}`}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleAddNewSize}
                            className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 text-sm"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowAddSizeInput(false); setNewSizeInput(''); }}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Ruler className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Select a category first to see available sizes</p>
                  </div>
                )}
              </div>

              {/* Diamond Options Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Gem className="inline h-5 w-5 mr-2" />
                    Diamond Options
                  </h3>
                  <button
                    type="button"
                    onClick={addDiamondOption}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Diamond Option</span>
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Multiple Diamond Configurations</h4>
                  <p className="text-sm text-purple-700">Add multiple diamond options with different qualities, counts, shapes, and weights. The first option will be marked as the main diamond.</p>
                </div>

                {(newProduct.diamondOptions || []).map((diamond, index) => (
                  <div key={diamond.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900 flex items-center">
                        Diamond Option {index + 1}
                        {diamond.isMain && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Main Diamond
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {!diamond.isMain && (
                          <button
                            type="button"
                            onClick={() => handleDiamondOptionChange(diamond.id, 'isMain', true)}
                            className="text-purple-600 hover:text-purple-800 text-sm"
                          >
                            Set as Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDiamondOption(diamond.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove Diamond Option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                        <select
                          value={diamond.quality}
                          onChange={(e) => {
                            if (e.target.value === '__ADD_NEW__') {
                              const newQuality = prompt('Enter new diamond quality (e.g., "FL+", "VVS0"):');
                              if (newQuality) {
                                if (addCustomOption('diamondQualities', newQuality)) {
                                  handleDiamondOptionChange(diamond.id, 'quality', newQuality);
                                } else {
                                  alert('This quality already exists or is invalid!');
                                }
                              }
                            } else {
                              handleDiamondOptionChange(diamond.id, 'quality', e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {getAllOptions('diamondQualities').map(quality => (
                            <option key={quality} value={quality}>{quality}</option>
                          ))}
                          <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Quality</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                        <input
                          type="number"
                          min="1"
                          value={diamond.count}
                          onChange={(e) => handleDiamondOptionChange(diamond.id, 'count', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                        <select
                          value={diamond.shape}
                          onChange={(e) => {
                            if (e.target.value === '__ADD_NEW__') {
                              const newShape = prompt('Enter new diamond shape (e.g., "Trillion", "Baguette"):');
                              if (newShape) {
                                if (addCustomOption('shapes', newShape)) {
                                  handleDiamondOptionChange(diamond.id, 'shape', newShape);
                                } else {
                                  alert('This shape already exists or is invalid!');
                                }
                              }
                            } else {
                              handleDiamondOptionChange(diamond.id, 'shape', e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {getAllOptions('shapes').map(shape => (
                            <option key={shape} value={shape}>{shape}</option>
                          ))}
                          <option value="__ADD_NEW__" className="text-blue-600 font-medium">+ Add New Shape</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (ct)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={diamond.weight}
                          onChange={(e) => handleDiamondOptionChange(diamond.id, 'weight', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.50"
                        />
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Summary:</strong> {diamond.count} × {diamond.shape} {diamond.quality} diamond{diamond.count > 1 ? 's' : ''}, {diamond.weight}ct total
                      </p>
                    </div>
                  </div>
                ))}

                {(!newProduct.diamondOptions || newProduct.diamondOptions.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Gem className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No diamond options added yet. Click &quot;Add Diamond Option&quot; to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Pricing Tiers by Metal Quality</h3>
                <button
                  type="button"
                  onClick={addPricingTier}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Pricing Tier</span>
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Metal Selection Information</h4>
                <p className="text-sm text-amber-700">Set different metal types and qualities. When customers select a metal type on the frontend, they can choose from these available options.</p>
              </div>
              {(newProduct.pricingTiers || []).map((tier) => (
                <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Metal Pricing Tier</h4>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => { }} className="text-amber-600 hover:text-amber-800 p-1" title="Edit Tier">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removePricingTier(tier.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete Tier">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metal Name</label>
                      <select
                        value={tier.metalName}
                        onChange={(e) => {
                          const newMetalName = e.target.value;
                          const firstSubCategory = metalTypes[newMetalName as keyof typeof metalTypes]?.[0] || '';
                          const updatedTiers = (newProduct.pricingTiers || []).map(t =>
                            t.id === tier.id ? { ...t, metalName: newMetalName, metalSubCategory: firstSubCategory } : t
                          );
                          setNewProduct(prev => ({ ...prev, pricingTiers: updatedTiers }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {Object.keys(metalTypes).map(metal => (<option key={metal} value={metal}>{metal}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                      <select
                        value={tier.metalSubCategory}
                        onChange={(e) => handlePricingTierChange(tier.id, 'metalSubCategory', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {(metalTypes[tier.metalName as keyof typeof metalTypes] || []).map(subCat => (<option key={subCat} value={subCat}>{subCat}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {(!newProduct.pricingTiers || newProduct.pricingTiers.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pricing tiers added yet. Click &quot;Add Pricing Tier&quot; to get started.</p>
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

interface ApiMetalConfig {
  type: string;
  purity: string;
  color: string;
  certification: {
    authority: string;
    number: string;
  };
  stock: number;
}

interface ApiVariant {
  _id: string;
  SKU: string;
  media: {
    images: string[];
    model3dUrl?: string[];
    videoUrl?: string;
  };
  metalConfig: ApiMetalConfig;
  diamondConfigs: ApiDiamondConfig[];
  priceBreakdown: any;
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

  const fetchDiamondAttributes = async () => {
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
  };

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

  const fetchProducts = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false);
      setError('Authentication token not found. Please log in.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/products', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ProductApiResponse = await response.json();

      const transformedProducts: JewelryProduct[] = data.products.map((apiProduct) => {
        const mainVariant = apiProduct.variants[0];

        let diamondOptions: DiamondOption[] = [];
        if (mainVariant && mainVariant.diamondConfigs) {
          diamondOptions = mainVariant.diamondConfigs.map((config, i) => ({
            id: config._id || crypto.randomUUID(),
            quality: config.diamond.clarity,
            count: config.quantity,
            shape: config.diamond.shape,
            weight: 0.5,
            isMain: i === 0,
          }));
        }

        let mediaFiles: MediaFile[] = [];
        if (apiProduct.media.coverImages) {
          mediaFiles = apiProduct.media.coverImages.map((url, i) => ({
            id: `media-image-${apiProduct._id}-${i}`,
            url,
            type: 'image',
          }));
        }
        if (apiProduct.media.videoUrl) {
          mediaFiles.push({
            id: `media-video-${apiProduct._id}`,
            url: apiProduct.media.videoUrl,
            type: 'video',
          });
        }
        if (apiProduct.media.model3dUrl && apiProduct.media.model3dUrl.length > 0) {
          mediaFiles.push({
            id: `media-3dmodel-${apiProduct._id}`,
            url: apiProduct.media.model3dUrl[0],
            type: '3d_model',
          });
        }

        const stock = mainVariant?.metalConfig?.stock || 0;
        const status = stock > 0 ? 'Active' : 'Out of Stock';

        return {
          id: apiProduct._id,
          name: apiProduct.title,
          media: mediaFiles,
          images: apiProduct.media.coverImages,
          metalQuality: mainVariant?.metalConfig?.purity || '',
          metalColor: mainVariant?.metalConfig?.color || '',
          diamondQuality: mainVariant?.diamondConfigs?.[0]?.diamond?.clarity || '',
          diamondTone: mainVariant?.diamondConfigs?.[0]?.diamond?.color || '',
          diamondOptions: diamondOptions,
          sizes: [],
          metalGrossWeight: 0,
          diamondWeight: 0,
          sku: mainVariant?.SKU || '',
          shape: mainVariant?.diamondConfigs?.[0]?.diamond?.shape || '',
          category: 'Rings',
          subCategory: 'Engagement Rings',
          pricingTiers: apiProduct.variants.map(v => ({
            id: v._id,
            metalName: v.metalConfig.type,
            metalSubCategory: v.metalConfig.purity,
          })),
          stock: stock,
          description: '',
          diamondCertification: mainVariant?.diamondConfigs?.[0]?.diamond?.certification?.authority || '',
          goldCertification: mainVariant?.metalConfig?.certification?.authority || '',
          sideStones: '',
          status: status,
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
  }, [authToken, fetchProducts, fetchCategories, fetchSettingStyles, fetchMetalColors, fetchMetalQualities, fetchDiamondColors]);
  
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
  const genders = ['Women', 'Men', 'Unisex'];
  const settingTypes = ['Prong Setting', 'Bezel Setting', 'Pave Setting', 'Channel Setting', 'Halo Setting', 'Tension Setting'];
  const stoneCuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const metalTypes = {
    'Gold': ['9K', '14K', '18K', '22K', '24K'],
    'Silver': ['925 Sterling', '999 Fine', '958 Britannia', '900 Coin', '935/960 Argentium'],
    'Platinum': ['950 Platinum', '999 Platinum', '900 Platinum'],
    'Diamond Solitaire': ['Natural', 'Lab Grown', '0.25 ct', '0.50 ct', '1.00 ct', '1.50 ct', '2.00 ct'],
    'Diamond Cluster': ['Natural Cluster', 'Lab Grown Cluster', '0.25 ct', '0.50 ct', '1.00 ct', '1.50 ct', '2.00 ct'],
    'Rose Gold': ['14K Rose', '18K Rose', '22K Rose', '24K Rose'],
  };

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
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleAddProduct = async (isEditing: boolean) => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.pricingTiers || newProduct.pricingTiers.length === 0) {
      alert('Please fill in all required fields: Product Name, SKU, Category, and at least one Pricing Tier.');
      return;
    }
    const isValidPricing = newProduct.pricingTiers.every(tier => tier.metalName && tier.metalSubCategory);
    if (!isValidPricing) {
      alert('Please ensure all pricing tiers have metal name and sub-category selected.');
      return;
    }

    const imageMedia = (newProduct.media || []).filter(m => m.type === 'image');
    const videoMedia = (newProduct.media || []).find(m => m.type === 'video');
    const model3dMedia = (newProduct.media || []).find(m => m.type === '3d_model');

    const payload = {
      title: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/ /g, '-'),
      description: newProduct.description,
      productType: 'standard',
      media: {
        coverImages: imageMedia.map(m => m.url),
        videoUrl: videoMedia ? videoMedia.url : undefined,
        model3dUrl: model3dMedia ? [model3dMedia.url] : [],
      },
      variants: newProduct.pricingTiers.map(tier => ({
        SKU: newProduct.sku,
        isAvailable: (newProduct.stock ?? 0) > 0,
        metalConfig: {
          type: tier.metalName,
          purity: tier.metalSubCategory,
          color: newProduct.metalColor,
          stock: newProduct.stock ?? 0,
          certification: {
            authority: newProduct.goldCertification,
            number: '',
          },
        },
        diamondConfigs: (newProduct.diamondOptions || []).map(option => ({
          diamond: {
            shape: option.shape,
            cut: newProduct.stoneCut,
            clarity: newProduct.stoneClarity,
            color: newProduct.stoneColor,
            certification: {
              authority: newProduct.diamondCertification,
              number: '',
            },
          },
          quantity: option.count,
        })),
        priceBreakdown: {},
      })),
      category: { name: newProduct.category },
      subCategory: { name: newProduct.subCategory },
      collection: newProduct.collection,
      occasion: newProduct.occasion,
      gender: newProduct.gender,
      tags: newProduct.tags,
      warranty: newProduct.warranty,
      returnPolicy: newProduct.returnPolicy,
      isCustomizable: newProduct.customizable,
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products/${editingProduct?.id}`
      : `http://kcs408ksw0og080sskw4okoo.31.97.206.59.sslip.io/api/inventory/products`;

    try {
      const response = await fetch(url, {
        method,
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

      alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
      fetchProducts();
      setShowAddModal(false);
      setEditingProduct(null);
      setNewProduct(getInitialNewProductState());
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setActiveTab('basic');

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} product. See console for details.`);
    }
  };

  const handleViewProduct = (product: JewelryProduct) => {
    setViewingProduct(product);
    setSelectedMediaIndex(0);
  };

  const handleEditProduct = (product: JewelryProduct) => {
    setEditingProduct(product);
    const productWithTierIds = {
      ...product,
      pricingTiers: product.pricingTiers.map(tier => ({
        ...tier,
        id: tier.id || crypto.randomUUID()
      })),
      diamondOptions: product.diamondOptions?.map(option => ({
        ...option,
        id: option.id || crypto.randomUUID()
      })) || [],
      media: product.media || []
    };
    setNewProduct(productWithTierIds);
    if (product.media && product.media.length > 0) {
      setImagePreviewUrls(product.media.map(m => m.url));
    } else {
      setImagePreviewUrls(product.images);
    }
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
              setSelectedImages([]);
              setImagePreviewUrls([]);
              setActiveTab('basic');
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Jewelry Product</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Gem className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customizable</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.customizable).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length) : 0).toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{apiCategories.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(products.length * 50000 / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing Tiers</th>
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
                        <div className="text-sm text-gray-500">{product.sku}</div>
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
                      {product.pricingTiers.map((tier) => (
                        <div key={tier.id} className="mb-1">
                          <span className="font-medium">{tier.metalName} {tier.metalSubCategory}</span>
                        </div>
                      ))}
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
                      <div className="font-medium">Stock: {product.stock}</div>
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
          setSelectedImages([]);
          setImagePreviewUrls([]);
          setActiveTab('basic');
        }}
        onAddProduct={handleAddProduct}
        editingProduct={editingProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        imagePreviewUrls={imagePreviewUrls}
        setImagePreviewUrls={setImagePreviewUrls}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        getAvailableSizes={getAvailableSizes}
        handleSizeToggle={handleSizeToggle}
        sizeMasterList={sizeMasterList}
        setSizeMasterList={setSizeMasterList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metalTypes={metalTypes}
        metalQualities={apiMetalQualities}
        metalColors={apiMetalColors}
        diamondQualities={diamondQualities}
        diamondTones={diamondTones}
        shapes={shapes}
        occasions={occasions}
        genders={genders}
        settingTypes={settingTypes}
        stoneCuts={stoneCuts}
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
        diamondAttributes={diamondAttributes}
        settingStyles={apiSettingStyles}
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
                    <p className="text-gray-600">SKU: {viewingProduct.sku}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-amber-600">
                      {viewingProduct.pricingTiers[0] ? `${viewingProduct.pricingTiers[0].metalName} ${viewingProduct.pricingTiers[0].metalSubCategory}` : 'N/A'}
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
                      <p className="text-gray-600">{viewingProduct.stock} units</p>
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
