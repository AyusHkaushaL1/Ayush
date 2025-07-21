import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Upload, X, Star, Award, Gem, Palette, Ruler, Weight, FileText, Shield, DollarSign, Settings, Eye, Edit } from 'lucide-react';

interface PricingTier {
  metalQuality: string;
  basePrice: number;
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

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  
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
        { metalQuality: '14K', basePrice: 145000, makingCharges: 15000, gstRate: 3 },
        { metalQuality: '18K', basePrice: 185000, makingCharges: 18000, gstRate: 3 },
        { metalQuality: '22K', basePrice: 225000, makingCharges: 22000, gstRate: 3 }
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

  const [newProduct, setNewProduct] = useState<Partial<JewelryProduct>>({
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

  const categories = {
    'All': [],
    'Rings': ['Engagement Rings', 'Wedding Bands', 'Fashion Rings', 'Eternity Rings', 'Promise Rings'],
    'Necklaces': ['Pendant Necklaces', 'Chain Necklaces', 'Chokers', 'Statement Necklaces', 'Tennis Necklaces'],
    'Earrings': ['Stud Earrings', 'Drop Earrings', 'Hoop Earrings', 'Chandelier Earrings', 'Huggie Earrings'],
    'Bracelets': ['Tennis Bracelets', 'Chain Bracelets', 'Bangle Bracelets', 'Charm Bracelets', 'Cuff Bracelets'],
    'Pendants': ['Diamond Pendants', 'Gemstone Pendants', 'Religious Pendants', 'Initial Pendants', 'Heart Pendants'],
    'Sets': ['Bridal Sets', 'Necklace Sets', 'Earring Sets', 'Complete Sets']
  };

  const metalQualities = ['14K', '18K', '22K', '24K', 'Platinum', 'Silver'];
  const metalColors = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'];
  const diamondQualities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const diamondTones = ['D (Colorless)', 'E (Colorless)', 'F (Colorless)', 'G (Near Colorless)', 'H (Near Colorless)', 'I (Near Colorless)', 'J (Near Colorless)'];
  const shapes = ['Round Brilliant', 'Princess', 'Emerald Cut', 'Asscher', 'Oval', 'Marquise', 'Pear', 'Heart', 'Cushion', 'Radiant'];
  const certifications = ['GIA Certified', 'IGI Certified', 'SSEF Certified', 'Gübelin Certified', 'AGS Certified'];
  const availableSizes = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];
  const occasions = ['Engagement', 'Wedding', 'Anniversary', 'Birthday', 'Valentine', 'Graduation', 'Everyday'];
  const genders = ['Women', 'Men', 'Unisex'];
  const settingTypes = ['Prong Setting', 'Bezel Setting', 'Pave Setting', 'Channel Setting', 'Halo Setting', 'Tension Setting'];
  const stoneCuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setNewProduct(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewProduct(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
    
    // Update form state with file names (in real app, you'd upload to server)
    setNewProduct(prev => ({
      ...prev,
      images: files.map(file => file.name)
    }));
  };

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    setSelectedImages(newFiles);
    setImagePreviewUrls(newUrls);
    
    setNewProduct(prev => ({
      ...prev,
      images: newFiles.map(file => file.name)
    }));
  };

  const handlePricingTierChange = (index: number, field: keyof PricingTier, value: string | number) => {
    const updatedTiers = [...(newProduct.pricingTiers || [])];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: typeof value === 'string' && field !== 'metalQuality' ? Number(value) : value
    };
    setNewProduct(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };

  const addPricingTier = () => {
    const newTier: PricingTier = {
      metalQuality: '14K',
      basePrice: 0,
      makingCharges: 0,
      gstRate: 3
    };
    setNewProduct(prev => ({
      ...prev,
      pricingTiers: [...(prev.pricingTiers || []), newTier]
    }));
  };

  const removePricingTier = (index: number) => {
    const updatedTiers = (newProduct.pricingTiers || []).filter((_, i) => i !== index);
    setNewProduct(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.pricingTiers?.length) {
      alert('Please fill in all required fields including at least one pricing tier');
      return;
    }

    const product: JewelryProduct = {
      ...newProduct as JewelryProduct,
      id: editingProduct ? editingProduct.id : Math.max(...products.map(p => p.id)) + 1,
      status: newProduct.stock && newProduct.stock > 0 ? 'Active' : 'Out of Stock',
      rating: newProduct.rating || 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? product : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, product]);
    }

    setNewProduct({
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
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setActiveTab('basic');
    setShowAddModal(false);
  };

  const handleViewProduct = (product: any) => {
    setViewingProduct(product);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddModal(true);
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = newProduct.sizes || [];
    if (currentSizes.includes(size)) {
      setNewProduct(prev => ({
        ...prev,
        sizes: currentSizes.filter(s => s !== size)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        sizes: [...currentSizes, size]
      }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewProduct(prev => ({
      ...prev,
      tags
    }));
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
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
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

  const getSubCategories = () => {
    return selectedCategory === 'All' ? [] : categories[selectedCategory as keyof typeof categories] || [];
  };

  const AddProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Edit Jewelry Product' : 'Add New Jewelry Product'}
            </h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingProduct(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Tab Navigation */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category *
                  </label>
                  <select
                    name="subCategory"
                    value={newProduct.subCategory || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    disabled={!newProduct.category}
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategories().map(subCategory => (
                      <option key={subCategory} value={subCategory}>{subCategory}</option>
                    ))}
                  </select>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={newProduct.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={newProduct.occasion || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Occasion</option>
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>{occasion}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images *
                </label>
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
                        <div key={index} className="relative">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Rating
                </label>
                {renderStars(newProduct.rating || 0, true)}
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gem className="inline h-4 w-4 mr-1" />
                    Metal Quality
                  </label>
                  <select
                    name="metalQuality"
                    value={newProduct.metalQuality || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Metal Quality</option>
                    {metalQualities.map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" />
                    Metal Color
                  </label>
                  <select
                    name="metalColor"
                    value={newProduct.metalColor || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Metal Color</option>
                    {metalColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Quality
                  </label>
                  <select
                    name="diamondQuality"
                    value={newProduct.diamondQuality || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Diamond Quality</option>
                    {diamondQualities.map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Tone
                  </label>
                  <select
                    name="diamondTone"
                    value={newProduct.diamondTone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Diamond Tone</option>
                    {diamondTones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shape
                  </label>
                  <select
                    name="shape"
                    value={newProduct.shape || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Shape</option>
                    {shapes.map(shape => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setting Type
                  </label>
                  <select
                    name="settingType"
                    value={newProduct.settingType || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Setting Type</option>
                    {settingTypes.map(setting => (
                      <option key={setting} value={setting}>{setting}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="inline h-4 w-4 mr-1" />
                    Metal Gross Weight (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="metalGrossWeight"
                    value={newProduct.metalGrossWeight || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="3.2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Weight (Carat)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="diamondWeight"
                    value={newProduct.diamondWeight || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="1.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Diamonds
                  </label>
                  <input
                    type="number"
                    name="totalDiamonds"
                    value={newProduct.totalDiamonds || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Band Width (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="bandWidth"
                    value={newProduct.bandWidth || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Clarity
                  </label>
                  <select
                    name="stoneClarity"
                    value={newProduct.stoneClarity || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Clarity</option>
                    {diamondQualities.map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Cut
                  </label>
                  <select
                    name="stoneCut"
                    value={newProduct.stoneCut || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Cut</option>
                    {stoneCuts.map(cut => (
                      <option key={cut} value={cut}>{cut}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Stones
                  </label>
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
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Available Sizes
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map(size => (
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
                <p className="text-sm text-amber-700">
                  Set different prices for different metal qualities. When customers select a metal type on the frontend, 
                  the price will automatically update based on these tiers. Include base price, making charges, and GST rate.
                </p>
              </div>

              {(newProduct.pricingTiers || []).map((tier, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Pricing Tier {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePricingTier(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metal Quality
                      </label>
                      <select
                        value={tier.metalQuality}
                        onChange={(e) => handlePricingTierChange(index, 'metalQuality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {metalQualities.map(quality => (
                          <option key={quality} value={quality}>{quality}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price (₹)
                      </label>
                      <input
                        type="number"
                        value={tier.basePrice}
                        onChange={(e) => handlePricingTierChange(index, 'basePrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="185000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Making Charges (₹)
                      </label>
                      <input
                        type="number"
                        value={tier.makingCharges}
                        onChange={(e) => handlePricingTierChange(index, 'makingCharges', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="18000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={tier.gstRate}
                        onChange={(e) => handlePricingTierChange(index, 'gstRate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Total Price:</strong> ₹{(tier.basePrice + tier.makingCharges + (tier.basePrice + tier.makingCharges) * tier.gstRate / 100).toLocaleString('en-IN')}
                      <span className="ml-2 text-xs text-gray-500">
                        (Base: ₹{tier.basePrice.toLocaleString('en-IN')} + Making: ₹{tier.makingCharges.toLocaleString('en-IN')} + GST: ₹{((tier.basePrice + tier.makingCharges) * tier.gstRate / 100).toLocaleString('en-IN')})
                      </span>
                    </p>
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
                    <Shield className="inline h-4 w-4 mr-1" />
                    Diamond Certification
                  </label>
                  <select
                    name="diamondCertification"
                    value={newProduct.diamondCertification || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Certification</option>
                    {certifications.map(cert => (
                      <option key={cert} value={cert}>{cert}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline h-4 w-4 mr-1" />
                    Gold Certification
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Policy
                  </label>
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
                <label htmlFor="customizable" className="text-sm font-medium text-gray-700">
                  Allow customization for this product
                </label>
              </div>

              {newProduct.customizable && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Customization Options</h4>
                  <p className="text-sm text-amber-700">
                    When enabled, customers can request modifications to metal type, stone selection, 
                    sizing, engraving options, and other specifications. Custom orders will require approval and may have 
                    extended delivery times.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Color
                  </label>
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
          <button
            onClick={() => {
              setShowAddModal(false);
              setEditingProduct(null);
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProduct}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jewelry Products</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Gem className="h-5 w-5" />
            </button> */}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Jewelry Product</span>
          </button>
        </div>
      </div>

      {/* Enhanced Product Stats */}
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
              <p className="text-2xl font-bold text-gray-900">4.8</p>
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
              <p className="text-2xl font-bold text-gray-900">₹{(products.reduce((sum, p) => sum + (p.pricingTiers[0]?.basePrice || 0) * p.stock, 0) / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
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

      {/* Enhanced Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight & Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing Tiers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock & Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
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
                      {product.pricingTiers.map((tier, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">{tier.metalQuality}:</span>
                          <span className="ml-1">₹{(tier.basePrice + tier.makingCharges).toLocaleString('en-IN')}</span>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(product.rating)}
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

      {showAddModal && <AddProductModal />}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                      ₹{viewingProduct.pricingTiers[0]?.basePrice?.toLocaleString('en-IN') || 'N/A'}
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