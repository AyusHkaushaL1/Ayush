import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, Trash2, Upload, X, Star, Award, Gem, Palette, Ruler, Weight, FileText, Shield, DollarSign, Settings, Eye, Edit } from 'lucide-react';

interface PricingTier {
  id: string;
  metalName: string;
  metalSubCategory: string;
  pricePerGram: number;
  weight: number;
  makingCharges: number;
  gstRate: number;
}

interface JewelryProduct {
  id: number;
  name: string;
  images: string[];
  metalQuality: string;
  metalColor: string;
  diamondQuality: string;
  diamondTone: string;
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

const categories = {
  'All': [],
  'Rings': ['Engagement Rings', 'Wedding Bands', 'Fashion Rings', 'Eternity Rings', 'Promise Rings'],
  'Necklaces': ['Pendant Necklaces', 'Chain Necklaces', 'Chokers', 'Statement Necklaces', 'Tennis Necklaces'],
  'Earrings': ['Stud Earrings', 'Drop Earrings', 'Hoop Earrings', 'Chandelier Earrings', 'Huggie Earrings'],
  'Bracelets': ['Tennis Bracelets', 'Chain Bracelets', 'Bangle Bracelets', 'Charm Bracelets', 'Cuff Bracelets'],
  'Pendants': ['Diamond Pendants', 'Gemstone Pendants', 'Religious Pendants', 'Initial Pendants', 'Heart Pendants'],
  'Sets': ['Bridal Sets', 'Necklace Sets', 'Earring Sets', 'Complete Sets']
};

// Define a new, more specific type for the size master list
type SizeMasterList = {
  [key in keyof typeof categories]: string[];
};

// Correctly define the initial state as a simple, non-memoized function
const getInitialNewProductState = (): Partial<JewelryProduct> => ({
  name: '',
  images: [],
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

// Define AddProductModal outside of the Products component to prevent re-rendering issues
const AddProductModal = React.memo(({
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
  categories,
  metalQualities,
  metalColors,
  diamondQualities,
  diamondTones,
  shapes,
  certifications,
  occasions,
  genders,
  settingTypes,
  stoneCuts,
  calculateTotalPrice
}: {
    show: boolean;
    onClose: () => void;
    editingProduct: JewelryProduct | null;
    newProduct: Partial<JewelryProduct>;
    setNewProduct: React.Dispatch<React.SetStateAction<Partial<JewelryProduct>>>;
    imagePreviewUrls: string[];
    setImagePreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
    selectedImages: File[];
    setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
    onAddProduct: () => void;
    getAvailableSizes: () => string[];
    handleSizeToggle: (size: string) => void;
    sizeMasterList: SizeMasterList; // Use the new type here
    setSizeMasterList: React.Dispatch<React.SetStateAction<SizeMasterList>>; // And here
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    metalTypes: { [key: string]: string[] };
    categories: { [key: string]: string[] };
    metalQualities: string[];
    metalColors: string[];
    diamondQualities: string[];
    diamondTones: string[];
    shapes: string[];
    certifications: string[];
    occasions: string[];
    genders: string[];
    settingTypes: string[];
    stoneCuts: string[];
    calculateTotalPrice: (tier: PricingTier) => number;
  }) => {

  const [newSizeInput, setNewSizeInput] = useState('');
  const [showAddSizeInput, setShowAddSizeInput] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setNewProduct(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  }, [setNewProduct]);

  const handleRatingChange = useCallback((rating: number) => {
    setNewProduct(prev => ({ ...prev, rating }));
  }, [setNewProduct]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
    setNewProduct(prev => ({ ...prev, images: [...(prev.images || []), ...files.map(file => URL.createObjectURL(file))] }));
  }, [setSelectedImages, setImagePreviewUrls, setNewProduct]);

  const removeImage = useCallback((index: number) => {
    const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
    const newFiles = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setImagePreviewUrls(newUrls);
    setNewProduct(prev => ({ ...prev, images: newUrls }));
  }, [selectedImages, imagePreviewUrls, setSelectedImages, setImagePreviewUrls, setNewProduct]);

  const handlePricingTierChange = useCallback((id: string, field: keyof PricingTier, value: string | number) => {
    const updatedTiers = (newProduct.pricingTiers || []).map(tier => {
      if (tier.id === id) {
        const updatedTier = { ...tier, [field]: typeof value === 'string' && !['metalName', 'metalSubCategory'].includes(field) ? Number(value) : value };
        return updatedTier;
      }
      return tier;
    });
    setNewProduct(prev => ({ ...prev, pricingTiers: updatedTiers }));
  }, [newProduct.pricingTiers, setNewProduct]);

  const addPricingTier = useCallback(() => {
    const newTier: PricingTier = {
      id: crypto.randomUUID(),
      metalName: 'Gold',
      metalSubCategory: '14K',
      pricePerGram: 0,
      weight: 0,
      makingCharges: 0,
      gstRate: 3
    };
    setNewProduct(prev => ({ ...prev, pricingTiers: [...(prev.pricingTiers || []), newTier] }));
  }, [setNewProduct]);

  const removePricingTier = useCallback((id: string) => {
    const updatedTiers = (newProduct.pricingTiers || []).filter(tier => tier.id !== id);
    setNewProduct(prev => ({ ...prev, pricingTiers: updatedTiers }));
  }, [newProduct.pricingTiers, setNewProduct]);

  const handleAddNewSize = useCallback(() => {
    if (newSizeInput.trim() && newProduct.category) {
      const category = newProduct.category as keyof SizeMasterList;
      if (sizeMasterList[category] && !sizeMasterList[category].includes(newSizeInput.trim())) {
        setSizeMasterList(prev => ({ ...prev, [category]: [...prev[category], newSizeInput.trim()] }));
      }
      setNewSizeInput('');
      setShowAddSizeInput(false);
    }
  }, [newSizeInput, newProduct.category, sizeMasterList, setSizeMasterList]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewProduct(prev => ({ ...prev, tags }));
  }, [setNewProduct]);

  const getSubCategories = () => {
    return (newProduct.category === 'All' || !newProduct.category) ? [] : categories[newProduct.category as keyof typeof categories] || [];
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
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
  };
  
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
                { id: 'certifications', label: 'Certifications', icon: Award },
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
                  <select
                    name="category"
                    value={newProduct.category || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {newProduct.category && getSubCategories().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
                    <select
                      name="subCategory"
                      value={newProduct.subCategory || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {getSubCategories().map(subCategory => (
                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={newProduct.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    {genders.map(gender => (<option key={gender} value={gender}>{gender}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <select
                    name="occasion"
                    value={newProduct.occasion || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Occasion</option>
                    {occasions.map(occasion => (<option key={occasion} value={occasion}>{occasion}</option>))}
                  </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Rating</label>
                {renderStars(newProduct.rating || 0, true)}
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
                  <select
                    name="metalQuality"
                    value={newProduct.metalQuality || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Metal Quality</option>
                    {metalQualities.map(quality => (<option key={quality} value={quality}>{quality}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" /> Metal Color
                  </label>
                  <select
                    name="metalColor"
                    value={newProduct.metalColor || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Metal Color</option>
                    {metalColors.map(color => (<option key={color} value={color}>{color}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Quality</label>
                  <select
                    name="diamondQuality"
                    value={newProduct.diamondQuality || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Diamond Quality</option>
                    {diamondQualities.map(quality => (<option key={quality} value={quality}>{quality}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diamond Tone</label>
                  <select
                    name="diamondTone"
                    value={newProduct.diamondTone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Diamond Tone</option>
                    {diamondTones.map(tone => (<option key={tone} value={tone}>{tone}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                  <select
                    name="shape"
                    value={newProduct.shape || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Shape</option>
                    {shapes.map(shape => (<option key={shape} value={shape}>{shape}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setting Type</label>
                  <select
                    name="settingType"
                    value={newProduct.settingType || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Setting Type</option>
                    {settingTypes.map(setting => (<option key={setting} value={setting}>{setting}</option>))}
                  </select>
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
                    {diamondQualities.map(quality => (<option key={quality} value={quality}>{quality}</option>))}
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
                    {stoneCuts.map(cut => (<option key={cut} value={cut}>{cut}</option>))}
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
                <h4 className="text-sm font-medium text-amber-800 mb-2">Dynamic Pricing Information</h4>
                <p className="text-sm text-amber-700">Set different prices for different metal qualities. When customers select a metal type on the frontend, the price will automatically update based on these tiers. Include base price, making charges, and GST rate.</p>
              </div>
              {(newProduct.pricingTiers || []).map((tier) => (
                <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Metal Pricing Tier</h4>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => {}} className="text-amber-600 hover:text-amber-800 p-1" title="Edit Tier">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removePricingTier(tier.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete Tier">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Gram (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tier.pricePerGram === 0 ? '' : tier.pricePerGram}
                        onChange={(e) => handlePricingTierChange(tier.id, 'pricePerGram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (Grams)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tier.weight === 0 ? '' : tier.weight}
                        onChange={(e) => handlePricingTierChange(tier.id, 'weight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="3.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Making Charges (₹)</label>
                      <input
                        type="number"
                        value={tier.makingCharges === 0 ? '' : tier.makingCharges}
                        onChange={(e) => handlePricingTierChange(tier.id, 'makingCharges', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="2000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tier.gstRate === 0 ? '' : tier.gstRate}
                        onChange={(e) => handlePricingTierChange(tier.id, 'gstRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="3"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <strong>Base Price:</strong> ₹{(tier.pricePerGram * tier.weight).toLocaleString('en-IN')}
                          <span className="text-xs text-gray-500 ml-2">(₹{tier.pricePerGram}/g × {tier.weight}g)</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <strong>Total Price:</strong> ₹{calculateTotalPrice(tier).toLocaleString('en-IN')}
                          <span className="text-xs text-gray-500 ml-2">(Base + Making + GST)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!newProduct.pricingTiers || newProduct.pricingTiers.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pricing tiers added yet. Click "Add Pricing Tier" to get started.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline h-4 w-4 mr-1" /> Diamond Certification
                  </label>
                  <select
                    name="diamondCertification"
                    value={newProduct.diamondCertification || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Certification</option>
                    {certifications.map(cert => (<option key={cert} value={cert}>{cert}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline h-4 w-4 mr-1" /> Gold Certification
                  </label>
                  <select
                    name="goldCertification"
                    value={newProduct.goldCertification || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Certification</option>
                    <option value="BIS Hallmarked">BIS Hallmarked</option>
                    <option value="NABL Certified">NABL Certified</option>
                    <option value="International Hallmark">International Hallmark</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Period</label>
                  <select
                    name="warranty"
                    value={newProduct.warranty || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Warranty</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                  <select
                    name="returnPolicy"
                    value={newProduct.returnPolicy || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Return Policy</option>
                    <option value="7 Days">7 Days</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="No Returns">No Returns</option>
                  </select>
                </div>
              </div>
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
          <button onClick={onAddProduct} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const Products: React.FC = () => {
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
  const [products, setProducts] = useState<JewelryProduct[]>([
    {
      id: 1,
      name: 'Eternal Solitaire Diamond Ring',
      images: ['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'],
      metalQuality: '18K',
      metalColor: 'White Gold',
      diamondQuality: 'VVS1',
      diamondTone: 'D (Colorless)',
      sizes: ['5', '6', '7', '8', '9'],
      metalGrossWeight: 3.2,
      diamondWeight: 1.5,
      sku: 'ESR-18K-001',
      shape: 'Round Brilliant',
      category: 'Rings',
      subCategory: 'Engagement Rings',
      pricingTiers: [
        { id: 'tier-1-1', metalName: 'Gold', metalSubCategory: '14K', pricePerGram: 4500, weight: 3.2, makingCharges: 15000, gstRate: 3 },
        { id: 'tier-1-2', metalName: 'Gold', metalSubCategory: '18K', pricePerGram: 5500, weight: 3.2, makingCharges: 18000, gstRate: 3 },
        { id: 'tier-1-3', metalName: 'Gold', metalSubCategory: '22K', pricePerGram: 6500, weight: 3.2, makingCharges: 22000, gstRate: 3 }
      ],
      stock: 8,
      description: 'A timeless solitaire engagement ring featuring a brilliant round diamond set in premium white gold.',
      diamondCertification: 'GIA Certified',
      goldCertification: 'BIS Hallmarked',
      sideStones: 'None',
      status: 'Active',
      rating: 4.9,
      customizable: true,
      createdAt: '2024-01-15',
      occasion: 'Engagement',
      gender: 'Women',
      collection: 'Eternal Collection',
      stoneClarity: 'VVS1',
      stoneColor: 'D',
      stoneCut: 'Excellent',
      settingType: 'Prong Setting',
      bandWidth: 2.5,
      totalDiamonds: 1,
      warranty: '1 Year',
      returnPolicy: '30 Days',
      tags: ['engagement', 'solitaire', 'diamond', 'classic']
    }
  ]);

  const initialSizeMasterList: SizeMasterList = {
    'All': [],
    'Rings': ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    'Necklaces': ['14 inches', '16 inches', '18 inches', '20 inches', '22 inches', '24 inches', '26 inches', '28 inches', '30 inches'],
    'Earrings': ['Small', 'Medium', 'Large'],
    'Bracelets': ['6.5 inches', '7 inches', '7.5 inches', '8 inches', '8.5 inches', '9 inches'],
    'Pendants': ['Small (10-15mm)', 'Medium (16-25mm)', 'Large (26-35mm)', 'Extra Large (36mm+)'],
    'Sets': ['Standard', 'Adjustable']
  };

  const [newProduct, setNewProduct] = useState<Partial<JewelryProduct>>(getInitialNewProductState());
  const [sizeMasterList, setSizeMasterList] = useState<SizeMasterList>(initialSizeMasterList);

  const metalQualities = ['14K', '18K', '22K', '24K', 'Platinum', 'Silver'];
  const metalColors = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'];
  const diamondQualities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const diamondTones = ['D (Colorless)', 'E (Colorless)', 'F (Colorless)', 'G (Near Colorless)', 'H (Near Colorless)', 'I (Near Colorless)', 'J (Near Colorless)'];
  const shapes = ['Round Brilliant', 'Princess', 'Emerald Cut', 'Asscher', 'Oval', 'Marquise', 'Pear', 'Heart', 'Cushion', 'Radiant'];
  const certifications = ['GIA Certified', 'IGI Certified', 'SSEF Certified', 'Gübelin Certified', 'AGS Certified'];
  const occasions = ['Engagement', 'Wedding', 'Anniversary', 'Birthday', 'Valentine', 'Graduation', 'Everyday'];
  const genders = ['Women', 'Men', 'Unisex'];
  const settingTypes = ['Prong Setting', 'Bezel Setting', 'Pave Setting', 'Channel Setting', 'Halo Setting', 'Tension Setting'];
  const stoneCuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const metalTypes = {
    'Gold': ['9K','14K', '18K', '22K', '24K'],
    'Silver': ['925 Sterling', '999 Fine', '958 Britannia','900 Coin', '935/960 Argentium'],
    'Platinum': ['950 Platinum', '999 Platinum', '900 Platinum'],
    'Diamond Solitaire': ['Natural', 'Lab Grown', '0.25 ct', '0.50 ct', '1.00 ct', '1.50 ct', '2.00 ct'],
    'Diamond Cluster': ['Natural Cluster', 'Lab Grown Cluster', '0.25 ct', '0.50 ct', '1.00 ct', '1.50 ct', '2.00 ct'],
    'Rose Gold': ['14K Rose', '18K Rose', '22K Rose', '24K Rose'],
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.shape.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || product.subCategory === selectedSubCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.pricingTiers || newProduct.pricingTiers.length === 0) {
      alert('Please fill in all required fields: Product Name, SKU, Category, and at least one Pricing Tier.');
      return;
    }
    const isValidPricing = newProduct.pricingTiers.every(tier =>
      tier.pricePerGram !== undefined && tier.pricePerGram !== null && !isNaN(Number(tier.pricePerGram)) &&
      tier.weight !== undefined && tier.weight !== null && !isNaN(Number(tier.weight)) &&
      tier.makingCharges !== undefined && tier.makingCharges !== null && !isNaN(Number(tier.makingCharges)) &&
      tier.gstRate !== undefined && tier.gstRate !== null && !isNaN(Number(tier.gstRate))
    );
    if (!isValidPricing) {
      alert('Please ensure all pricing tier values are valid numbers.');
      return;
    }
    const product: JewelryProduct = {
      ...newProduct as JewelryProduct,
      id: editingProduct ? editingProduct.id : Math.max(0, ...products.map(p => p.id)) + 1,
      status: (newProduct.stock && newProduct.stock > 0) ? 'Active' : 'Out of Stock',
      rating: newProduct.rating || 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0]
    };
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? product : p));
    } else {
      setProducts([...products, product]);
    }
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct(getInitialNewProductState());
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setActiveTab('basic');
  };
  const handleViewProduct = (product: JewelryProduct) => {
    setViewingProduct(product);
  };
  const handleEditProduct = (product: JewelryProduct) => {
    setEditingProduct(product);
    const productWithTierIds = {
      ...product,
      pricingTiers: product.pricingTiers.map(tier => ({
        ...tier,
        id: tier.id || crypto.randomUUID()
      }))
    };
    setNewProduct(productWithTierIds);
    setImagePreviewUrls(product.images);
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
    return sizeMasterList[category] || [];
  }, [newProduct.category, sizeMasterList]);
  const calculateTotalPrice = (tier: PricingTier) => {
    const basePrice = tier.pricePerGram * tier.weight;
    const total = basePrice + tier.makingCharges + (basePrice + tier.makingCharges) * tier.gstRate / 100;
    return total;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => {
                setNewProduct(prev => ({ ...prev, rating: star }));
            } : undefined}
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
  };
  const getSubCategories = useCallback(() => {
    return selectedCategory === 'All' ? [] : categories[selectedCategory as keyof typeof categories] || [];
  }, [selectedCategory, categories]);

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
              <p className="text-2xl font-bold text-gray-900">{Object.keys(categories).length - 1}</p>
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
                ₹{((products.reduce((sum, p) => sum + (p.pricingTiers[0] ? calculateTotalPrice(p.pricingTiers[0]) : 0) * p.stock, 0)) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jewelry products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('All');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {selectedCategory !== 'All' && getSubCategories().length > 0 && (
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="All">All Sub Categories</option>
                {getSubCategories().map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
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
                      <img className="h-16 w-16 flex-shrink-0 object-cover rounded-md" src={product.images[0]} alt={product.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                        <div className="flex items-center mt-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                        </div>
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
                          <span className="font-medium">{tier.metalName} {tier.metalSubCategory}:</span>
                          <span className="ml-1">₹{calculateTotalPrice(tier).toLocaleString('en-IN')}</span>
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
        categories={categories}
        metalQualities={metalQualities}
        metalColors={metalColors}
        diamondQualities={diamondQualities}
        diamondTones={diamondTones}
        shapes={shapes}
        certifications={certifications}
        occasions={occasions}
        genders={genders}
        settingTypes={settingTypes}
        stoneCuts={stoneCuts}
        calculateTotalPrice={calculateTotalPrice}
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
                  <img
                    src={viewingProduct.images[0]}
                    alt={viewingProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h3>
                    <p className="text-gray-600">SKU: {viewingProduct.sku}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-amber-600">
                      ₹{viewingProduct.pricingTiers[0] ? calculateTotalPrice(viewingProduct.pricingTiers[0]).toLocaleString('en-IN') : 'N/A'}
                    </span>
                    {renderStars(viewingProduct.rating)}
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
                  <div>
                    <span className="font-medium text-gray-700">Certifications:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {viewingProduct.diamondCertification}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {viewingProduct.goldCertification}
                      </span>
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