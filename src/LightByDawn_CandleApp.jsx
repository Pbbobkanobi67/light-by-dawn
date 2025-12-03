import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Flame, Package, Droplets, BookOpen, Calculator, DollarSign, ShoppingCart, History, LayoutDashboard, Plus, Trash2, Edit2, Save, X, ChevronRight, TrendingUp, Box, RotateCcw, Download, FileText, Grid, List, Table, Sparkles, Check, MessageSquare, AlertTriangle, Filter, Minus, CheckCircle, XCircle, Zap, ClipboardList, Copy, Menu, Archive, ExternalLink, Send, Settings, Key } from 'lucide-react';
import { supabase } from './supabaseClient';

// Initial data matching your Excel
const initialMaterials = [
  { id: 'W-001', category: 'Wax', name: 'Golden Brands 464 Soy Wax', vendor: 'CandleScience', unit: 'lb', packageSize: 10, packageCost: 32.95, qtyOnHand: 45, reorderPoint: 20 },
  { id: 'W-002', category: 'Wax', name: 'Coconut Soy Blend', vendor: 'Aztec', unit: 'lb', packageSize: 5, packageCost: 18.99, qtyOnHand: 15, reorderPoint: 10 },
  { id: 'C-001', category: 'Container', name: '9oz Straight Side Jar', vendor: 'Fillmore', unit: 'case', packageSize: 12, packageCost: 24.00, qtyOnHand: 120, reorderPoint: 48 },
  { id: 'C-002', category: 'Container', name: '6oz Tin', vendor: 'CandleScience', unit: 'case', packageSize: 24, packageCost: 36.00, qtyOnHand: 96, reorderPoint: 48 },
  { id: 'C-003', category: 'Container', name: '4oz Small Tin', vendor: 'Amazon', unit: 'case', packageSize: 24, packageCost: 28.00, qtyOnHand: 144, reorderPoint: 72 },
  { id: 'K-001', category: 'Wick', name: 'CD-10 Wicks', vendor: 'CandleScience', unit: 'pack', packageSize: 100, packageCost: 12.99, qtyOnHand: 350, reorderPoint: 100 },
  { id: 'K-002', category: 'Wick', name: 'CD-18 Wicks', vendor: 'CandleScience', unit: 'pack', packageSize: 100, packageCost: 12.99, qtyOnHand: 280, reorderPoint: 100 },
  { id: 'L-001', category: 'Label', name: '2 inch Round Kraft Labels', vendor: 'Amazon', unit: 'roll', packageSize: 500, packageCost: 14.99, qtyOnHand: 800, reorderPoint: 200 },
  { id: 'P-001', category: 'Packaging', name: 'White Gift Box 4x4x4', vendor: 'Uline', unit: 'case', packageSize: 25, packageCost: 18.50, qtyOnHand: 75, reorderPoint: 50 },
];

const initialFragrances = [
  { id: 'FO-001', name: 'Ocean Breeze', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.95, flashPoint: 200, maxLoad: 10, qtyOnHand: 24, reorderPoint: 8 },
  { id: 'FO-002', name: 'Jamaican Me Crazy', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.50, flashPoint: 200, maxLoad: 10, qtyOnHand: 32, reorderPoint: 8 },
  { id: 'FO-003', name: 'Pumpkin Spice', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.95, flashPoint: 185, maxLoad: 10, qtyOnHand: 16, reorderPoint: 8 },
  { id: 'FO-004', name: 'Apple Cinnamon', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.50, flashPoint: 200, maxLoad: 10, qtyOnHand: 20, reorderPoint: 8 },
  { id: 'FO-005', name: 'Vanilla', type: 'EO', vendor: 'Amazon', packageSize: 16, packageCost: 25.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 28, reorderPoint: 8 },
  { id: 'FO-006', name: 'Balsam Pine', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 19.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 12, reorderPoint: 8 },
  { id: 'FO-007', name: 'Sandalwood', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 29.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 8, reorderPoint: 8 },
  { id: 'FO-008', name: 'Eucalyptus Spearmint', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.50, flashPoint: 200, maxLoad: 10, qtyOnHand: 24, reorderPoint: 8 },
  { id: 'FO-009', name: 'Sweet Taboo', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 16, reorderPoint: 8 },
  { id: 'FO-010', name: 'Butt Naked', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 20, reorderPoint: 8 },
  { id: 'FO-011', name: 'Coconut Lime', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.50, flashPoint: 200, maxLoad: 10, qtyOnHand: 18, reorderPoint: 8 },
  { id: 'FO-012', name: 'Caramel', type: 'FO', vendor: 'Amazon', packageSize: 16, packageCost: 31.95, flashPoint: 200, maxLoad: 10, qtyOnHand: 14, reorderPoint: 8 },
  { id: 'FO-013', name: 'Lime', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 12.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 6, reorderPoint: 2 },
  { id: 'FO-014', name: 'Petitgrain', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 14.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 4, reorderPoint: 2 },
  { id: 'FO-015', name: 'Jasmine', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 24.99, flashPoint: 200, maxLoad: 3, qtyOnHand: 3, reorderPoint: 2 },
  { id: 'FO-016', name: 'Very Vanilla', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 22, reorderPoint: 8 },
  { id: 'FO-017', name: 'Mountain Meets Ocean', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 31.50, flashPoint: 200, maxLoad: 10, qtyOnHand: 16, reorderPoint: 8 },
  { id: 'FO-018', name: 'Sweetest Taboo', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 14, reorderPoint: 8 },
  { id: 'FO-019', name: 'Pumpkin Spice Latte', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 31.50, flashPoint: 185, maxLoad: 10, qtyOnHand: 18, reorderPoint: 8 },
  { id: 'FO-020', name: 'Orange', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 9.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 5, reorderPoint: 2 },
  { id: 'FO-021', name: 'Cedarwood', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 11.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 4, reorderPoint: 2 },
  { id: 'FO-022', name: 'Frankincense', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 19.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 3, reorderPoint: 2 },
  { id: 'FO-023', name: 'Bergamot', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 14.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 4, reorderPoint: 2 },
  { id: 'FO-024', name: 'Cedar', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 11.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 4, reorderPoint: 2 },
  { id: 'FO-025', name: 'Black Pepper', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 10, reorderPoint: 8 },
  { id: 'FO-026', name: 'Rose', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 29.99, flashPoint: 200, maxLoad: 3, qtyOnHand: 2, reorderPoint: 1 },
  { id: 'FO-027', name: 'Eucalyptus', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 9.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 5, reorderPoint: 2 },
  { id: 'FO-028', name: 'Rosemary', type: 'EO', vendor: 'Plant Therapy', packageSize: 4, packageCost: 11.99, flashPoint: 200, maxLoad: 5, qtyOnHand: 4, reorderPoint: 2 },
  { id: 'FO-029', name: 'Pine', type: 'FO', vendor: 'CandleScience', packageSize: 16, packageCost: 28.99, flashPoint: 200, maxLoad: 10, qtyOnHand: 16, reorderPoint: 8 },
];

const initialRecipes = [
  { id: 'RCP-001', name: 'Coastal Luxe', vibe: 'Tropical • Clean • Airy', style: 'Fresh, upscale beach house', description: 'A luxury coastal fragrance blending airy ocean breeze with soft tropical fruit, bright lime, and delicate jasmine.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Ocean Breeze', type: 'FO', percent: 55 }, { fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 25 }, { fragrance: 'Lime', type: 'EO', percent: 10 }, { fragrance: 'Petitgrain', type: 'EO', percent: 5 }, { fragrance: 'Jasmine', type: 'EO', percent: 5 }] },
  { id: 'RCP-002', name: 'Sunset Colada', vibe: 'Tropical • Fruity • Smooth', style: 'Vacation sunset cocktail', description: 'Bright and sunny tropical fruit softened with creamy vanilla and citrus.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 60 }, { fragrance: 'Vanilla', type: 'EO', percent: 15 }, { fragrance: 'Lime', type: 'EO', percent: 15 }, { fragrance: 'Orange', type: 'EO', percent: 10 }] },
  { id: 'RCP-003', name: 'Harvest Cabin', vibe: 'Warm • Spiced • Comforting', style: 'Cozy fall evening', description: 'A welcoming fall scent with warm apple cinnamon, smooth vanilla, gentle orange, and a cedarwood base.', container: '6oz Tin', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', size: 6, foLoad: 10, archived: false, components: [{ fragrance: 'Apple Cinnamon', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Frankincense', type: 'EO', percent: 5 }] },
  { id: 'RCP-004', name: 'Toes In The Sand', vibe: 'Fresh • Uplifting • Coastal', style: 'Tropical fruit meets coastal breeze', description: 'Tropical fruit meets a refreshing ocean breeze with hints of lime and gentle mint. Clean, bright, and beachy.', container: '4oz Small Tin', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', size: 4, foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 55 }, { fragrance: 'Coconut Lime', type: 'FO', percent: 20 }, { fragrance: 'Eucalyptus Spearmint', type: 'EO', percent: 20 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 5 }] },
  { id: 'RCP-005', name: 'Alpine Holiday', vibe: 'Fresh • Festive • Cozy', style: 'Christmas tree + winter citrus', description: 'A refined Christmas scent combining fresh balsam pine with creamy vanilla and bright winter citrus.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Pine', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Bergamot', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Cedar', type: 'EO', percent: 5 }] },
  { id: 'RCP-006', name: 'Fireside Spice Latte', vibe: 'Cozy • Spiced • Sweet', style: 'Warm holiday café', description: 'Creamy pumpkin spice latte layered with caramel, vanilla, cedarwood, and a subtle hint of black pepper.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Pumpkin Spice Latte', type: 'FO', percent: 50 }, { fragrance: 'Caramel', type: 'FO', percent: 20 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 5 }, { fragrance: 'Black Pepper', type: 'FO', percent: 5 }] },
  { id: 'RCP-007', name: 'Forbidden Vanilla Kiss', vibe: 'Romantic • Seductive • Luxury', style: 'Signature sweet-floral gourmand', description: 'A sensual, sweet-floral indulgence where creamy vanilla swirls with lush blooms and soft citrus sparkle.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Sweet Taboo', type: 'FO', percent: 48 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 35 }, { fragrance: 'Jasmine', type: 'EO', percent: 10 }, { fragrance: 'Bergamot', type: 'EO', percent: 5 }, { fragrance: 'Rose', type: 'EO', percent: 2 }] },
  { id: 'RCP-008', name: 'Alpine Spa', vibe: 'Clean • Fresh • Cozy', style: 'Perfect winter spa scent', description: 'A clean, uplifting alpine blend that combines crisp evergreens with ocean freshness and soothing spa botanicals.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Mountain Meets Ocean', type: 'FO', percent: 40 }, { fragrance: 'Balsam Pine', type: 'EO', percent: 30 }, { fragrance: 'Eucalyptus', type: 'EO', percent: 10 }, { fragrance: 'Rosemary', type: 'EO', percent: 10 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 10 }] },
  { id: 'RCP-009', name: 'Island Bliss', vibe: 'Tropical • Smooth • Playful', style: 'Flirty tropical fruit', description: 'A bright blend of tropical fruit, creamy island sweetness, and soft warm notes that drift across sunlit shores.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 50 }, { fragrance: 'Butt Naked', type: 'FO', percent: 30 }, { fragrance: 'Sweetest Taboo', type: 'FO', percent: 20 }] },
  { id: 'RCP-010', name: 'Eucalyptus Spa', vibe: 'Clean • Cooling • Refreshing', style: 'Herbal aromatherapy', description: 'A refreshing blend of cool eucalyptus and crisp spearmint that opens the senses and calms the mind.', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: 'Eucalyptus Spearmint', type: 'FO', percent: 100 }] },
];

const initialBatchHistory = [];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calculator', label: 'Batch Builder', icon: Calculator },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'materials', label: 'Materials', icon: Package },
  { id: 'fragrances', label: 'Fragrances', icon: Droplets },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
  { id: 'history', label: 'Batch History', icon: History },
];

const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
const formatPercent = (num) => `${(num * 100).toFixed(1)}%`;

const categoryColors = {
  Wax: { bg: 'rgba(254,202,87,0.2)', text: '#feca57' },
  Container: { bg: 'rgba(116,185,255,0.2)', text: '#74b9ff' },
  Wick: { bg: 'rgba(255,159,243,0.2)', text: '#ff9ff3' },
  Label: { bg: 'rgba(85,239,196,0.2)', text: '#55efc4' },
  Packaging: { bg: 'rgba(255,107,107,0.2)', text: '#ff6b6b' },
  Unit: { bg: 'rgba(162,155,254,0.2)', text: '#a29bfe' },
  Fragrance: { bg: 'rgba(253,203,110,0.2)', text: '#fdcb6e' },
};

// localStorage helpers (fallback for offline)
const STORAGE_KEY = 'lightByDawn_data';

const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e);
  }
};

// Supabase helpers - convert between camelCase (app) and snake_case (db)
const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/([A-Z])/g, '_$1').toLowerCase(),
      toSnakeCase(v)
    ])
  );
};

const toCamelCase = (obj) => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      toCamelCase(v)
    ])
  );
};

export default function CandleBusinessApp() {
  const [activeTab, setActiveTab] = useState(() => loadFromStorage('activeTab', 'dashboard'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState(() => loadFromStorage('materials', initialMaterials));
  const [fragrances, setFragrances] = useState(() => loadFromStorage('fragrances', initialFragrances));
  const [recipes, setRecipes] = useState(() => loadFromStorage('recipes', initialRecipes));
  const [batchHistory, setBatchHistory] = useState(() => loadFromStorage('batchHistory', initialBatchHistory));
  
  // Multi-batch builder state
  const [batchList, setBatchList] = useState(() => loadFromStorage('batchList', []));
  const [currentBatch, setCurrentBatch] = useState({
    recipe: 'Toes In The Sand',
    quantity: 12,
    size: 4,
    foLoad: 0.10,
    waxCostPerOz: 0.206,
    containerCost: 1.17,
    wickCost: 0.13,
    labelCost: 0.03,
    packagingCost: 0.74,
    avgFoCost: 1.97,
    retailPrice: 18.00,
  });

  // Modal states
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showFragranceModal, setShowFragranceModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingFragrance, setEditingFragrance] = useState(null);

  // Form states
  const [recipeForm, setRecipeForm] = useState({ name: '', vibe: '', style: '', description: '', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: '', type: 'FO', percent: 100 }] });
  const [materialForm, setMaterialForm] = useState({ id: '', category: 'Wax', name: '', vendor: '', unit: 'unit', packageSize: 1, packageCost: 0, qtyOnHand: 0, reorderPoint: 0 });
  const [fragranceForm, setFragranceForm] = useState({ name: '', type: 'FO', vendor: '', packageSize: 16, packageCost: 0, prices: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, quantities: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, flashPoint: 200, maxLoad: 10, qtyOnHand: 0, reorderPoint: 0, archived: false });

  // Fragrance page state
  const [fragranceView, setFragranceView] = useState('grid'); // 'grid', 'list', 'table'
  const [showArchivedFragrances, setShowArchivedFragrances] = useState(false);
  const [selectedFragrances, setSelectedFragrances] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // General AI Chat state
  const [showGeneralChat, setShowGeneralChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: null, y: null }); // null = default position
  const [chatSize, setChatSize] = useState({ width: 380, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [fragranceSort, setFragranceSort] = useState('name'); // 'name', 'type', 'vendor', 'cost', 'stock'
  const [recipeSort, setRecipeSort] = useState('name'); // 'name', 'size', 'profit', 'canMake', 'components'
  const [recipeView, setRecipeView] = useState('grid'); // 'grid', 'list', 'table'
  const [showArchivedRecipes, setShowArchivedRecipes] = useState(false);
  const [pricingRecipe, setPricingRecipe] = useState(initialRecipes[0]?.name || ''); // Selected recipe for pricing engine

  // AI Profit Analysis state
  const [profitAnalysisLoading, setProfitAnalysisLoading] = useState(false);
  const [profitAnalysis, setProfitAnalysis] = useState(null);
  const [profitAnalysisTime, setProfitAnalysisTime] = useState(0);

  // Supabase sync state
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'

  // Load data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        setSyncStatus('syncing');

        const [materialsRes, fragrancesRes, recipesRes, batchHistoryRes, batchListRes] = await Promise.all([
          supabase.from('materials').select('*'),
          supabase.from('fragrances').select('*'),
          supabase.from('recipes').select('*'),
          supabase.from('batch_history').select('*'),
          supabase.from('batch_list').select('*'),
        ]);

        // If we have data in Supabase, use it; otherwise keep localStorage/defaults
        if (materialsRes.data?.length > 0) setMaterials(toCamelCase(materialsRes.data));
        if (fragrancesRes.data?.length > 0) setFragrances(toCamelCase(fragrancesRes.data));
        if (recipesRes.data?.length > 0) setRecipes(toCamelCase(recipesRes.data));
        if (batchHistoryRes.data?.length > 0) setBatchHistory(toCamelCase(batchHistoryRes.data));
        if (batchListRes.data?.length > 0) setBatchList(toCamelCase(batchListRes.data));

        setSyncStatus('idle');
      } catch (error) {
        console.warn('Failed to load from Supabase, using localStorage:', error);
        setSyncStatus('error');
      }
      setDataLoaded(true);
    };

    loadFromSupabase();
  }, []);

  // Save to Supabase helper
  const syncToSupabase = useCallback(async (table, data) => {
    try {
      // Delete all existing rows and insert new ones (simple sync strategy)
      await supabase.from(table).delete().neq('id', '');
      if (data.length > 0) {
        await supabase.from(table).insert(toSnakeCase(data));
      }
    } catch (error) {
      console.warn(`Failed to sync ${table} to Supabase:`, error);
    }
  }, []);

  // Persist active tab to localStorage
  useEffect(() => { saveToStorage('activeTab', activeTab); }, [activeTab]);

  // Persist data to localStorage and Supabase
  useEffect(() => {
    saveToStorage('materials', materials);
    if (dataLoaded) syncToSupabase('materials', materials);
  }, [materials, dataLoaded, syncToSupabase]);

  useEffect(() => {
    saveToStorage('fragrances', fragrances);
    if (dataLoaded) syncToSupabase('fragrances', fragrances);
  }, [fragrances, dataLoaded, syncToSupabase]);

  useEffect(() => {
    saveToStorage('recipes', recipes);
    if (dataLoaded) syncToSupabase('recipes', recipes);
  }, [recipes, dataLoaded, syncToSupabase]);

  useEffect(() => {
    saveToStorage('batchHistory', batchHistory);
    if (dataLoaded) syncToSupabase('batch_history', batchHistory);
  }, [batchHistory, dataLoaded, syncToSupabase]);

  useEffect(() => {
    saveToStorage('batchList', batchList);
    if (dataLoaded) syncToSupabase('batch_list', batchList);
  }, [batchList, dataLoaded, syncToSupabase]);

  // Materials page state
  const [materialView, setMaterialView] = useState('table'); // 'grid', 'list', 'table'
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materialFilter, setMaterialFilter] = useState('All'); // category filter
  const [materialSort, setMaterialSort] = useState('name'); // 'name', 'category', 'vendor', 'cost', 'stock', 'stock-desc'
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveForm, setReceiveForm] = useState({ materialId: '', quantity: 0 });
  const [showLogBatchModal, setShowLogBatchModal] = useState(false);
  const [logBatchForm, setLogBatchForm] = useState({ recipe: '', quantity: 12, size: 9, notes: '', autoDeduct: true });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportText, setExportText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Quick adjust inventory
  const adjustInventory = (materialId, amount) => {
    setMaterials(materials.map(m => {
      if (m.id === materialId) {
        const newQty = Math.max(0, m.qtyOnHand + amount);
        return { ...m, qtyOnHand: newQty };
      }
      return m;
    }));
  };

  // Receive shipment
  const receiveShipment = (materialId, quantity) => {
    adjustInventory(materialId, quantity);
    setShowReceiveModal(false);
    setReceiveForm({ materialId: '', quantity: 0 });
  };

  const [pricingTiers, setPricingTiers] = useState([
    { tier: 'Retail', qtyRange: '1-9', price: 24.00 },
    { tier: 'Wholesale', qtyRange: '10-49', price: 14.00 },
    { tier: 'Bulk', qtyRange: '50-99', price: 11.00 },
    { tier: 'Distributor', qtyRange: '100+', price: 9.00 },
  ]);

  // Calculate single batch
  const calculateBatch = (batch) => {
    const recipe = recipes.find(r => r.name === batch.recipe);
    const waxPerCandle = batch.size * (1 - batch.foLoad);
    const foPerCandle = batch.size * batch.foLoad;
    const waxCost = waxPerCandle * batch.waxCostPerOz;
    const foCost = foPerCandle * batch.avgFoCost;
    const totalCostPerCandle = waxCost + foCost + batch.containerCost + batch.wickCost + batch.labelCost + batch.packagingCost;
    const profitPerCandle = batch.retailPrice - totalCostPerCandle;
    const profitMargin = batch.retailPrice > 0 ? profitPerCandle / batch.retailPrice : 0;
    
    return {
      recipe,
      waxPerCandle,
      foPerCandle,
      waxCost,
      foCost,
      totalCostPerCandle,
      profitPerCandle,
      profitMargin,
      totalBatchCost: totalCostPerCandle * batch.quantity,
      totalBatchRevenue: batch.retailPrice * batch.quantity,
      totalBatchProfit: profitPerCandle * batch.quantity,
      totalWaxBatch: waxPerCandle * batch.quantity,
      totalFoBatch: foPerCandle * batch.quantity,
    };
  };

  const currentCalc = calculateBatch(currentBatch);
  const selectedRecipe = recipes.find(r => r.name === currentBatch.recipe);

  // Pricing engine calculation based on selected recipe
  const pricingCalc = useMemo(() => {
    const recipe = recipes.find(r => r.name === pricingRecipe);
    if (!recipe) return { totalCostPerCandle: 0, profitPerCandle: 0, retailPrice: 0 };
    
    const size = recipe.size || 9;
    const foLoad = (recipe.foLoad || 10) / 100;
    const waxCostPerOz = 0.206;
    const containerCost = size <= 4 ? 1.17 : size <= 6 ? 1.50 : 2.00;
    const wickCost = 0.13;
    const labelCost = 0.03;
    const packagingCost = 0.74;
    const avgFoCost = 1.97;
    const retailPrice = size <= 4 ? 14.00 : size <= 6 ? 18.00 : 24.00;
    
    const waxPerCandle = size * (1 - foLoad);
    const foPerCandle = size * foLoad;
    const waxCost = waxPerCandle * waxCostPerOz;
    const foCost = foPerCandle * avgFoCost;
    const totalCostPerCandle = waxCost + foCost + containerCost + wickCost + labelCost + packagingCost;
    const profitPerCandle = retailPrice - totalCostPerCandle;
    
    console.log('Pricing calc for:', pricingRecipe, 'Size:', size, 'Cost:', totalCostPerCandle);
    
    return {
      totalCostPerCandle,
      profitPerCandle,
      waxPerCandle,
      foPerCandle,
      retailPrice
    };
  }, [pricingRecipe, recipes]);

  const pricingRecipeData = recipes.find(r => r.name === pricingRecipe);

  // Generate comprehensive shopping list
  const shoppingList = useMemo(() => {
    const byRecipe = {};
    const totals = {
      wax: { oz: 0, lbs: 0 },
      fragrances: {},
      containers: {},
      wicks: 0,
      labels: 0,
      packaging: 0,
      totalCandles: 0,
    };

    batchList.forEach(batch => {
      const recipe = recipes.find(r => r.name === batch.recipe);
      if (!recipe) return;

      const calc = calculateBatch(batch);
      const containerKey = recipe.container;

      if (!byRecipe[batch.recipe]) {
        byRecipe[batch.recipe] = {
          recipe: batch.recipe,
          container: recipe.container,
          size: batch.size,
          quantity: 0,
          waxOz: 0,
          foOz: 0,
          fragrances: {},
          cost: 0,
        };
      }

      byRecipe[batch.recipe].quantity += batch.quantity;
      byRecipe[batch.recipe].waxOz += calc.totalWaxBatch;
      byRecipe[batch.recipe].foOz += calc.totalFoBatch;
      byRecipe[batch.recipe].cost += calc.totalBatchCost;

      // Calculate individual fragrance amounts
      recipe.components.forEach(comp => {
        const foAmount = calc.totalFoBatch * (comp.percent / 100);
        if (!byRecipe[batch.recipe].fragrances[comp.fragrance]) {
          byRecipe[batch.recipe].fragrances[comp.fragrance] = { oz: 0, type: comp.type };
        }
        byRecipe[batch.recipe].fragrances[comp.fragrance].oz += foAmount;

        if (!totals.fragrances[comp.fragrance]) {
          totals.fragrances[comp.fragrance] = { oz: 0, type: comp.type };
        }
        totals.fragrances[comp.fragrance].oz += foAmount;
      });

      // Totals
      totals.wax.oz += calc.totalWaxBatch;
      totals.wax.lbs += calc.totalWaxBatch / 16;
      totals.totalCandles += batch.quantity;
      totals.wicks += batch.quantity;
      totals.labels += batch.quantity;
      totals.packaging += batch.quantity;

      if (!totals.containers[containerKey]) {
        totals.containers[containerKey] = 0;
      }
      totals.containers[containerKey] += batch.quantity;
    });

    return { byRecipe: Object.values(byRecipe), totals };
  }, [batchList, recipes]);

  // Stats for dashboard
  const stats = useMemo(() => ({
    totalBatches: batchHistory.length,
    totalCandles: batchHistory.reduce((sum, b) => sum + b.qty, 0),
    totalInvestment: batchHistory.reduce((sum, b) => sum + b.cost, 0),
    avgHotThrow: batchHistory.filter(b => b.hotThrow).reduce((sum, b, _, arr) => sum + b.hotThrow / arr.length, 0),
    recipesCount: recipes.length,
    fragrancesCount: fragrances.length,
    pendingBatches: batchList.length,
    pendingCandles: batchList.reduce((sum, b) => sum + b.quantity, 0),
  }), [batchHistory, recipes, fragrances, batchList]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    const lowMaterials = materials.filter(m => m.qtyOnHand < m.reorderPoint);
    const lowFragrances = fragrances.filter(f => f.qtyOnHand !== undefined && f.qtyOnHand < (f.reorderPoint || 8));
    return [...lowMaterials, ...lowFragrances.map(f => ({ ...f, category: 'Fragrance' }))];
  }, [materials, fragrances]);

  // Calculate what materials a recipe needs for a given quantity
  const calculateRecipeMaterials = (recipe, quantity) => {
    const size = recipe.size;
    const foLoad = recipe.foLoad / 100;
    const waxPerCandle = size * (1 - foLoad);
    const foPerCandle = size * foLoad;
    
    const needs = {
      wax: waxPerCandle * quantity, // in oz
      fragrance: foPerCandle * quantity, // in oz total
      fragranceBreakdown: recipe.components.map(c => ({
        name: c.fragrance,
        type: c.type,
        oz: (foPerCandle * quantity) * (c.percent / 100)
      })),
      containers: quantity,
      wicks: quantity,
      labels: quantity,
      packaging: quantity
    };
    
    return needs;
  };

  // Check if we have enough materials for a recipe
  const canMakeRecipe = (recipe, quantity = 12) => {
    const needs = calculateRecipeMaterials(recipe, quantity);
    
    // Check wax (convert oz needed to lbs for comparison)
    const waxLbsNeeded = needs.wax / 16;
    const totalWaxOnHand = materials
      .filter(m => m.category === 'Wax')
      .reduce((sum, m) => sum + m.qtyOnHand, 0);
    
    if (totalWaxOnHand < waxLbsNeeded) {
      return { canMake: false, reason: `Need ${waxLbsNeeded.toFixed(2)} lbs wax, have ${totalWaxOnHand} lbs`, maxQty: Math.floor((totalWaxOnHand * 16) / (needs.wax / quantity)) };
    }
    
    // Check fragrances
    for (const frag of needs.fragranceBreakdown) {
      const fragInStock = fragrances.find(f => f.name === frag.name);
      if (!fragInStock || (fragInStock.qtyOnHand || 0) < frag.oz) {
        const available = fragInStock?.qtyOnHand || 0;
        const maxFromThis = Math.floor(available / (frag.oz / quantity));
        return { canMake: false, reason: `Need ${frag.oz.toFixed(2)} oz ${frag.name}, have ${available} oz`, maxQty: maxFromThis };
      }
    }
    
    // Check containers based on recipe container type
    const containerName = recipe.container;
    const container = materials.find(m => m.name === containerName);
    if (!container || container.qtyOnHand < quantity) {
      const available = container?.qtyOnHand || 0;
      return { canMake: false, reason: `Need ${quantity} containers, have ${available}`, maxQty: available };
    }
    
    // Check wicks
    const totalWicks = materials.filter(m => m.category === 'Wick').reduce((sum, m) => sum + m.qtyOnHand, 0);
    if (totalWicks < quantity) {
      return { canMake: false, reason: `Need ${quantity} wicks, have ${totalWicks}`, maxQty: totalWicks };
    }
    
    return { canMake: true, reason: 'Ready to make!', maxQty: quantity };
  };

  // Check if current batch has enough stock
  const currentBatchStock = selectedRecipe ? canMakeRecipe(selectedRecipe, currentBatch.quantity) : { canMake: true, reason: '' };

  // What can I make - calculate for all recipes
  const whatCanIMake = useMemo(() => {
    return recipes.map(recipe => {
      const check12 = canMakeRecipe(recipe, 12);
      const check24 = canMakeRecipe(recipe, 24);
      const check6 = canMakeRecipe(recipe, 6);
      
      // Find max we can make
      let maxQty = 0;
      for (let q = 1; q <= 100; q++) {
        if (canMakeRecipe(recipe, q).canMake) {
          maxQty = q;
        } else {
          break;
        }
      }
      
      return {
        recipe,
        canMake6: check6.canMake,
        canMake12: check12.canMake,
        canMake24: check24.canMake,
        maxQty,
        limitReason: check12.reason
      };
    }).sort((a, b) => b.maxQty - a.maxQty);
  }, [recipes, materials, fragrances]);

  // Sorted fragrances
  const sortedFragrances = useMemo(() => {
    const filtered = fragrances.filter(f => showArchivedFragrances || !f.archived);
    const sorted = [...filtered];
    switch (fragranceSort) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return sorted.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
      case 'vendor':
        return sorted.sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name));
      case 'cost':
        return sorted.sort((a, b) => (b.packageCost / b.packageSize) - (a.packageCost / a.packageSize));
      case 'stock':
        return sorted.sort((a, b) => (a.qtyOnHand || 0) - (b.qtyOnHand || 0));
      case 'stock-desc':
        return sorted.sort((a, b) => (b.qtyOnHand || 0) - (a.qtyOnHand || 0));
      default:
        return sorted;
    }
  }, [fragrances, fragranceSort, showArchivedFragrances]);

  // Sorted recipes
  const sortedRecipes = useMemo(() => {
    const filtered = recipes.filter(r => showArchivedRecipes || !r.archived);
    const sorted = [...filtered];
    switch (recipeSort) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sorted.sort((a, b) => b.size - a.size);
      case 'size-asc':
        return sorted.sort((a, b) => a.size - b.size);
      case 'profit':
        // Calculate profit for sorting
        return sorted.sort((a, b) => {
          const profitA = (a.size === 4 ? 14 : a.size === 6 ? 18 : 24) * 0.6; // rough profit estimate
          const profitB = (b.size === 4 ? 14 : b.size === 6 ? 18 : 24) * 0.6;
          return profitB - profitA;
        });
      case 'canMake':
        // Sort by what we can make most of
        return sorted.sort((a, b) => {
          const canMakeA = whatCanIMake.find(w => w.recipe.name === a.name)?.maxQty || 0;
          const canMakeB = whatCanIMake.find(w => w.recipe.name === b.name)?.maxQty || 0;
          return canMakeB - canMakeA;
        });
      case 'components':
        return sorted.sort((a, b) => a.components.length - b.components.length);
      case 'components-desc':
        return sorted.sort((a, b) => b.components.length - a.components.length);
      case 'vibe':
        return sorted.sort((a, b) => (a.vibe || '').localeCompare(b.vibe || ''));
      default:
        return sorted;
    }
  }, [recipes, recipeSort, whatCanIMake, showArchivedRecipes]);

  // Auto-deduct materials when logging a batch
  const deductBatchMaterials = (batch) => {
    const recipe = recipes.find(r => r.name === batch.recipe);
    if (!recipe) return;
    
    const needs = calculateRecipeMaterials(recipe, batch.quantity);
    
    // Deduct wax (from first available wax)
    const waxLbsNeeded = needs.wax / 16;
    let waxRemaining = waxLbsNeeded;
    setMaterials(prev => prev.map(m => {
      if (m.category === 'Wax' && waxRemaining > 0) {
        const deduct = Math.min(m.qtyOnHand, waxRemaining);
        waxRemaining -= deduct;
        return { ...m, qtyOnHand: m.qtyOnHand - deduct };
      }
      return m;
    }));
    
    // Deduct fragrances
    setFragrances(prev => prev.map(f => {
      const needed = needs.fragranceBreakdown.find(fb => fb.name === f.name);
      if (needed && f.qtyOnHand !== undefined) {
        return { ...f, qtyOnHand: Math.max(0, f.qtyOnHand - needed.oz) };
      }
      return f;
    }));
    
    // Deduct containers
    setMaterials(prev => prev.map(m => {
      if (m.name === recipe.container) {
        return { ...m, qtyOnHand: Math.max(0, m.qtyOnHand - batch.quantity) };
      }
      return m;
    }));
    
    // Deduct wicks (from first available)
    let wicksRemaining = batch.quantity;
    setMaterials(prev => prev.map(m => {
      if (m.category === 'Wick' && wicksRemaining > 0) {
        const deduct = Math.min(m.qtyOnHand, wicksRemaining);
        wicksRemaining -= deduct;
        return { ...m, qtyOnHand: m.qtyOnHand - deduct };
      }
      return m;
    }));
    
    // Deduct labels
    let labelsRemaining = batch.quantity;
    setMaterials(prev => prev.map(m => {
      if (m.category === 'Label' && labelsRemaining > 0) {
        const deduct = Math.min(m.qtyOnHand, labelsRemaining);
        labelsRemaining -= deduct;
        return { ...m, qtyOnHand: m.qtyOnHand - deduct };
      }
      return m;
    }));
  };

  // Log a new batch to history
  const logNewBatch = () => {
    if (!logBatchForm.recipe) { alert('Please select a recipe'); return; }
    
    const recipe = recipes.find(r => r.name === logBatchForm.recipe);
    if (!recipe) return;
    
    const calc = calculateBatch({
      ...currentBatch,
      recipe: logBatchForm.recipe,
      quantity: logBatchForm.quantity,
      size: logBatchForm.size
    });
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const cureDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const newBatch = {
      id: `B-${String(batchHistory.length + 1).padStart(3, '0')}`,
      date: dateStr,
      recipe: logBatchForm.recipe,
      qty: logBatchForm.quantity,
      size: logBatchForm.size,
      cost: calc.totalBatchCost,
      cureEnd: cureDate,
      hotThrow: null,
      coldThrow: null,
      status: 'Curing',
      notes: logBatchForm.notes
    };
    
    // Auto-deduct inventory if enabled
    if (logBatchForm.autoDeduct) {
      deductBatchMaterials({ recipe: logBatchForm.recipe, quantity: logBatchForm.quantity });
    }
    
    setBatchHistory([newBatch, ...batchHistory]);
    setShowLogBatchModal(false);
    setLogBatchForm({ recipe: '', quantity: 12, size: 9, notes: '', autoDeduct: true });
  };

  // Open log batch modal with current batch info
  const openLogBatchModal = () => {
    setLogBatchForm({
      recipe: currentBatch.recipe,
      quantity: currentBatch.quantity,
      size: currentBatch.size,
      notes: '',
      autoDeduct: true
    });
    setShowLogBatchModal(true);
  };

  // Batch functions
  const addBatchToList = () => {
    setBatchList([...batchList, { ...currentBatch, id: Date.now() }]);
  };

  const removeBatchFromList = (id) => {
    setBatchList(batchList.filter(b => b.id !== id));
  };

  const resetCurrentBatch = () => {
    const firstRecipe = recipes[0];
    setCurrentBatch({
      recipe: firstRecipe?.name || '',
      quantity: 12,
      size: firstRecipe?.size || 9,
      foLoad: (firstRecipe?.foLoad || 10) / 100,
      waxCostPerOz: 0.206,
      containerCost: 2.00,
      wickCost: 0.13,
      labelCost: 0.03,
      packagingCost: 0.74,
      avgFoCost: 1.97,
      retailPrice: 24.00,
    });
  };

  const clearAllBatches = () => {
    if (confirm('Clear all batches from the list?')) {
      setBatchList([]);
    }
  };

  const exportShoppingList = () => {
    if (batchList.length === 0) {
      return; // Just do nothing if no batches
    }
    
    let text = "LIGHT BY DAWN - SHOPPING LIST\n";
    text += "Generated: " + new Date().toLocaleDateString() + "\n";
    text += "=".repeat(50) + "\n\n";

    text += "BATCHES PLANNED:\n";
    text += "-".repeat(30) + "\n";
    batchList.forEach(b => {
      text += `• ${b.recipe} - ${b.quantity} candles (${b.size}oz)\n`;
    });
    text += `\nTOTAL CANDLES: ${shoppingList.totals.totalCandles}\n\n`;

    text += "BY RECIPE:\n";
    text += "=".repeat(50) + "\n";
    shoppingList.byRecipe.forEach(r => {
      text += `\n${r.recipe.toUpperCase()}\n`;
      text += `-`.repeat(30) + "\n";
      text += `Quantity: ${r.quantity} candles\n`;
      text += `Wax: ${r.waxOz.toFixed(1)} oz (${(r.waxOz/16).toFixed(2)} lbs)\n`;
      text += `Fragrances:\n`;
      Object.entries(r.fragrances).forEach(([name, data]) => {
        text += `  • ${name}: ${data.oz.toFixed(2)} oz\n`;
      });
    });

    text += "\n\nTOTALS BY CATEGORY:\n";
    text += "=".repeat(50) + "\n\n";

    text += "WAX:\n";
    text += `  Total: ${shoppingList.totals.wax.lbs.toFixed(2)} lbs (${shoppingList.totals.wax.oz.toFixed(1)} oz)\n`;
    text += `  Packages (10lb): ${Math.ceil(shoppingList.totals.wax.lbs / 10)}\n\n`;

    text += "FRAGRANCES:\n";
    Object.entries(shoppingList.totals.fragrances).forEach(([name, data]) => {
      text += `  • ${name} (${data.type}): ${data.oz.toFixed(2)} oz\n`;
    });

    text += "\nCONTAINERS:\n";
    Object.entries(shoppingList.totals.containers).forEach(([name, qty]) => {
      text += `  • ${name}: ${qty} units\n`;
    });

    text += `\nWICKS: ${shoppingList.totals.wicks} units\n`;
    text += `LABELS: ${shoppingList.totals.labels} units\n`;
    text += `PACKAGING: ${shoppingList.totals.packaging} units\n`;

    setExportText(text);
    setShowExportModal(true);
  };
  
  const copyExportText = () => {
    navigator.clipboard.writeText(exportText).then(() => {
      setShowExportModal(false); // Close modal on success
    }).catch((err) => {
      console.error('Could not copy:', err);
    });
  };

  const clearShoppingList = () => {
    setShowClearConfirm(true);
  };
  
  const confirmClearShoppingList = () => {
    setBatchList([]);
    setShowClearConfirm(false);
  };

  // Material functions
  const getCategoryPrefix = (category) => {
    const prefixes = { Wax: 'W', Container: 'C', Wick: 'K', Label: 'L', Packaging: 'P', Unit: 'U' };
    return prefixes[category] || 'M';
  };

  const generateMaterialId = (category) => {
    const prefix = getCategoryPrefix(category);
    const existingIds = materials.filter(m => m.id.startsWith(prefix)).map(m => parseInt(m.id.split('-')[1]) || 0);
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `${prefix}-${String(nextNum).padStart(3, '0')}`;
  };

  const toggleMaterialSelection = (matId) => {
    setSelectedMaterials(prev => 
      prev.includes(matId) 
        ? prev.filter(id => id !== matId)
        : [...prev, matId]
    );
  };

  const clearMaterialSelection = () => {
    setSelectedMaterials([]);
  };

  const selectAllMaterials = () => {
    const filtered = filteredMaterials.map(m => m.id);
    setSelectedMaterials(filtered);
  };

  const deleteSelectedMaterials = () => {
    if (confirm(`Delete ${selectedMaterials.length} selected material(s)?`)) {
      setMaterials(materials.filter(m => !selectedMaterials.includes(m.id)));
      setSelectedMaterials([]);
    }
  };

  const filteredMaterials = useMemo(() => {
    let filtered = materialFilter === 'All' ? [...materials] : materials.filter(m => m.category === materialFilter);
    
    switch (materialSort) {
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      case 'vendor':
        return filtered.sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name));
      case 'cost':
        return filtered.sort((a, b) => (b.packageCost / b.packageSize) - (a.packageCost / a.packageSize));
      case 'cost-asc':
        return filtered.sort((a, b) => (a.packageCost / a.packageSize) - (b.packageCost / b.packageSize));
      case 'stock':
        return filtered.sort((a, b) => a.qtyOnHand - b.qtyOnHand);
      case 'stock-desc':
        return filtered.sort((a, b) => b.qtyOnHand - a.qtyOnHand);
      default:
        return filtered;
    }
  }, [materials, materialFilter, materialSort]);

  const openAddMaterial = () => {
    const newId = generateMaterialId('Wax');
    setEditingMaterial(null);
    setMaterialForm({ id: newId, category: 'Wax', name: '', vendor: '', unit: 'unit', packageSize: 1, packageCost: 0, qtyOnHand: 0, reorderPoint: 0 });
    setShowMaterialModal(true);
  };

  const openEditMaterial = (mat) => {
    setEditingMaterial(mat.id);
    setMaterialForm({ ...mat });
    setShowMaterialModal(true);
  };

  const handleMaterialCategoryChange = (newCategory) => {
    if (!editingMaterial) {
      // Only auto-generate ID for new materials
      const newId = generateMaterialId(newCategory);
      setMaterialForm({ ...materialForm, category: newCategory, id: newId });
    } else {
      setMaterialForm({ ...materialForm, category: newCategory });
    }
  };

  const saveMaterial = () => {
    if (!materialForm.name) { alert('Name is required'); return; }
    if (!materialForm.id) { alert('ID is required'); return; }
    
    // Check for duplicate ID (excluding current item if editing)
    const duplicateId = materials.find(m => m.id === materialForm.id && m.id !== editingMaterial);
    if (duplicateId) { alert('This ID already exists. Please use a unique ID.'); return; }
    
    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial ? { ...materialForm } : m));
    } else {
      setMaterials([...materials, { ...materialForm }]);
    }
    setShowMaterialModal(false);
  };

  const deleteMaterial = (id, e) => {
    if (e) e.stopPropagation();
    setMaterials(materials.filter(m => m.id !== id));
    setSelectedMaterials(selectedMaterials.filter(sid => sid !== id));
  };

  // Fragrance functions
  const openAddFragrance = () => {
    setEditingFragrance(null);
    setFragranceForm({ name: '', type: 'FO', vendor: '', packageSize: 16, packageCost: 0, prices: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, quantities: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, flashPoint: 200, maxLoad: 10, qtyOnHand: 0, reorderPoint: 0, archived: false });
    setShowFragranceModal(true);
  };

  const openEditFragrance = (frag) => {
    setEditingFragrance(frag.id);
    const defaultPrices = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }; const defaultQtys = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }; const prices = frag.prices || { ...defaultPrices, [frag.packageSize]: frag.packageCost }; const quantities = frag.quantities || { ...defaultQtys, [frag.packageSize]: frag.qtyOnHand || 0 }; setFragranceForm({ ...frag, prices, quantities });
    setShowFragranceModal(true);
  };

  const saveFragrance = () => {
    if (!fragranceForm.name) return;
    if (editingFragrance) {
      setFragrances(fragrances.map(f => f.id === editingFragrance ? { ...fragranceForm, id: editingFragrance } : f));
    } else {
      const newId = `FO-${String(fragrances.length + 1).padStart(3, '0')}`;
      setFragrances([...fragrances, { ...fragranceForm, id: newId }]);
    }
    setShowFragranceModal(false);
  };

  const deleteFragrance = (id, e) => {
    if (e) e.stopPropagation();
    setFragrances(fragrances.filter(f => f.id !== id));
    setSelectedFragrances(selectedFragrances.filter(sid => sid !== id));
  };

  const archiveFragrance = (id, e) => {
    if (e) e.stopPropagation();
    setFragrances(fragrances.map(f => f.id === id ? { ...f, archived: !f.archived } : f));
  };

  // Recipe functions
  const openNewRecipe = () => {
    setEditingRecipe(null);
    setRecipeForm({ name: '', vibe: '', style: '', description: '', container: '9oz Straight Side Jar', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', size: 9, foLoad: 10, archived: false, components: [{ fragrance: '', type: 'FO', percent: 100 }] });
    setShowRecipeModal(true);
  };

  const openEditRecipe = (recipe) => {
    setEditingRecipe(recipe.id);
    setRecipeForm({ ...recipe, components: [...recipe.components] });
    setShowRecipeModal(true);
  };

  const saveRecipe = () => {
    const totalPercent = recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0);
    if (totalPercent !== 100) return;
    if (!recipeForm.name) return;
    
    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === editingRecipe ? { ...recipeForm, id: editingRecipe } : r));
    } else {
      const newId = `RCP-${String(recipes.length + 1).padStart(3, '0')}`;
      setRecipes([...recipes, { ...recipeForm, id: newId }]);
    }
    setShowRecipeModal(false);
  };

  const deleteRecipe = (id, e) => {
    if (e) e.stopPropagation();
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const archiveRecipe = (id, e) => {
    if (e) e.stopPropagation();
    setRecipes(recipes.map(r => r.id === id ? { ...r, archived: !r.archived } : r));
  };

  const copyRecipe = (recipe, e) => {
    if (e) e.stopPropagation();
    setEditingRecipe(null);
    setRecipeForm({ ...recipe, name: recipe.name + " (Copy)", components: [...recipe.components] });
    setShowRecipeModal(true);
  };

  const addComponent = () => setRecipeForm({ ...recipeForm, components: [...recipeForm.components, { fragrance: '', type: 'FO', percent: 0 }] });
  const removeComponent = (idx) => setRecipeForm({ ...recipeForm, components: recipeForm.components.filter((_, i) => i !== idx) });
  const updateComponent = (idx, field, value) => {
    const updated = [...recipeForm.components];
    updated[idx] = { ...updated[idx], [field]: field === 'percent' ? parseFloat(value) || 0 : value };
    setRecipeForm({ ...recipeForm, components: updated });
  };

  // Create recipe from selected fragrances
  const createRecipeFromSelection = () => {
    if (selectedFragrances.length < 2) return;
    
    // Get fragrance details and distribute percentages evenly
    const evenPercent = Math.floor(100 / selectedFragrances.length);
    const remainder = 100 - (evenPercent * selectedFragrances.length);
    
    const components = selectedFragrances.map((fragId, idx) => {
      const frag = fragrances.find(f => f.id === fragId);
      return {
        fragrance: frag?.name || '',
        type: frag?.type || 'FO',
        percent: idx === 0 ? evenPercent + remainder : evenPercent // Give remainder to first component
      };
    });
    
    setEditingRecipe(null);
    setRecipeForm({
      name: '',
      vibe: '',
      style: '',
      description: '',
      container: '9oz Straight Side Jar',
      wax: 'Golden Brands 464 Soy Wax',
      wick: 'CD-18 Wicks',
      size: 9,
      foLoad: 10,
      components
    });
    setShowRecipeModal(true);
    setActiveTab('recipes');
  };

  // Reset all data
  const resetAllData = () => {
    if (confirm('Reset all data? This will clear batch history, pending batches, and restore default materials, fragrances, and recipes.')) {
      setMaterials(initialMaterials);
      setFragrances(initialFragrances);
      setRecipes(initialRecipes);
      setBatchHistory([]);
      setBatchList([]);
      resetCurrentBatch();
    }
  };

  // Fragrance selection
  const toggleFragranceSelection = (fragId) => {
    setSelectedFragrances(prev => 
      prev.includes(fragId) 
        ? prev.filter(id => id !== fragId)
        : [...prev, fragId]
    );
  };

  const clearFragranceSelection = () => {
    setSelectedFragrances([]);
    setAiResponse(null);
  };

  // AI Assistant for fragrance combinations (using Google Gemini)
  const getAiAdvice = async () => {
    if (selectedFragrances.length < 2) {
      alert('Please select at least 2 fragrances to get AI advice');
      return;
    }

    if (!geminiApiKey) {
      setShowAiPanel(true);
      setAiResponse("Please set your Google Gemini API key first.\n\nClick the chat bubble in the bottom-right corner, then click the key icon to add your FREE API key.\n\nGet your key at: https://aistudio.google.com/apikey");
      return;
    }

    const selectedFragranceDetails = selectedFragrances.map(id => {
      const f = fragrances.find(fr => fr.id === id);
      return f ? `${f.name} (${f.type})` : '';
    }).filter(Boolean);

    setAiLoading(true);
    setShowAiPanel(true);
    setAiResponse(null);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `You are an expert candle maker and fragrance blender. I'm creating a candle and want to combine these fragrances: ${selectedFragranceDetails.join(', ')}.

Please provide:
1. **Compatibility Analysis**: How well do these scents work together?
2. **Suggested Ratio**: Recommend specific percentages for each fragrance (must total 100%)
3. **Scent Profile**: Describe what the final blend will smell like
4. **Mood/Vibe**: What atmosphere does this create?
5. **Season/Occasion**: When is this blend best suited for?
6. **Recipe Name Suggestions**: Give 2-3 creative names for this blend

Keep your response concise but helpful. Format with clear sections.` }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      setAiResponse(responseText);
    } catch (error) {
      console.error("Error getting AI advice:", error);
      setAiResponse(`Error: ${error.message}\n\nPlease check your API key is valid.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Save API key to localStorage
  const saveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setShowApiKeyInput(false);
  };

  // General AI Chat function (using Google Gemini)
  const sendChatMessage = async (message) => {
    if (!message.trim() || chatLoading) return;

    if (!geminiApiKey) {
      setChatMessages(prev => [...prev,
        { role: 'user', content: message },
        { role: 'model', content: "Please set your Google Gemini API key first. Click the key icon in the header to add your key.\n\nGet your FREE API key at: https://aistudio.google.com/apikey" }
      ]);
      setChatInput('');
      setShowApiKeyInput(true);
      return;
    }

    const userMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    // Build inventory context
    const inventoryContext = {
      materials: materials.map(m => ({
        name: m.name, category: m.category, qtyOnHand: m.qtyOnHand, unit: m.unit,
        costPerUnit: m.packageCost / m.packageSize
      })),
      fragrances: fragrances.filter(f => !f.archived).map(f => {
        const totalOz = Object.entries(f.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0) || f.qtyOnHand || 0;
        return { name: f.name, type: f.type, vendor: f.vendor, totalOz, maxLoad: f.maxLoad };
      }),
      recipes: recipes.filter(r => !r.archived).map(r => ({
        name: r.name, vibe: r.vibe, size: r.size, components: r.components
      }))
    };

    // Build conversation history for Gemini format
    const conversationHistory = chatMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `You are a helpful AI assistant for a candle-making business called "Light By Dawn". You have access to the current inventory and can help with questions about fragrances, materials, recipes, candle making techniques, and business suggestions.

Current Inventory Summary:
${JSON.stringify(inventoryContext, null, 2)}

Be concise, friendly, and helpful. When suggesting recipes or products, reference the actual inventory available.` }]
          },
          contents: [...conversationHistory, { role: "user", parts: [{ text: message }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      setChatMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message}\n\nPlease check your API key is valid.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Chat window drag handlers
  const handleDragStart = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setDragOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
  };

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newX = Math.max(0, Math.min(window.innerWidth - chatSize.width, clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - chatSize.height, clientY - dragOffset.y));
    setChatPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset, chatSize]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Chat window resize handlers
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResize = useCallback((e) => {
    if (!isResizing) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const posX = chatPosition.x ?? (window.innerWidth - chatSize.width - 24);
    const posY = chatPosition.y ?? (window.innerHeight - chatSize.height - 100);
    const newWidth = Math.max(280, Math.min(600, clientX - posX));
    const newHeight = Math.max(300, Math.min(700, clientY - posY));
    setChatSize({ width: newWidth, height: newHeight });
  }, [isResizing, chatPosition, chatSize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Global mouse/touch event listeners for drag and resize
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleResize, { passive: false });
      window.addEventListener('touchend', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResize);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  // AI Profit Analysis (using Google Gemini)
  const getProfitAnalysis = async () => {
    if (!geminiApiKey) {
      setProfitAnalysis("Please set your Google Gemini API key first.\n\nClick the chat bubble in the bottom-right corner, then click the key icon to add your FREE API key.\n\nGet your key at: https://aistudio.google.com/apikey");
      return;
    }

    setProfitAnalysisLoading(true);
    setProfitAnalysis(null);
    setProfitAnalysisTime(0);

    console.log('🚀 Starting profit analysis...');
    const startTime = Date.now();

    // Start a timer to show elapsed time
    const timerInterval = setInterval(() => {
      setProfitAnalysisTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Prepare inventory summary
    const inventorySummary = {
      materials: materials.map(m => ({
        name: m.name,
        category: m.category,
        qtyOnHand: m.qtyOnHand,
        unit: m.unit,
        costPerUnit: (m.packageCost / m.packageSize).toFixed(2)
      })),
      fragrances: fragrances.map(f => ({
        name: f.name,
        type: f.type,
        qtyOnHand: f.qtyOnHand || 0,
        costPerOz: (f.packageCost / f.packageSize).toFixed(2)
      })),
      recipes: whatCanIMake.map(w => ({
        name: w.recipe.name,
        size: w.recipe.size,
        maxCanMake: w.maxQty,
        components: w.recipe.components,
        vibe: w.recipe.vibe
      }))
    };

    // Calculate costs and potential profits for each recipe
    const recipeEconomics = recipes.map(recipe => {
      try {
        const batchObj = {
          recipe: recipe.name,
          quantity: 12,
          size: recipe.size || 9,
          foLoad: (recipe.foLoad || 10) / 100,
          waxCostPerOz: 0.206,
          containerCost: recipe.size === 4 ? 1.17 : recipe.size === 6 ? 1.50 : 2.00,
          wickCost: 0.13,
          labelCost: 0.03,
          packagingCost: 0.74,
          avgFoCost: 1.97,
          retailPrice: recipe.size === 4 ? 14.00 : recipe.size === 6 ? 18.00 : 24.00
        };

        const calc = calculateBatch(batchObj);
        const canMake = whatCanIMake.find(w => w.recipe.name === recipe.name);

        return {
          name: recipe.name,
          size: recipe.size || 9,
          costPerCandle: (calc?.totalCostPerCandle || 0).toFixed(2),
          suggestedPrice: batchObj.retailPrice.toFixed(2),
          profitPerCandle: (calc?.profitPerCandle || 0).toFixed(2),
          profitMargin: batchObj.retailPrice > 0 ? (((calc?.profitPerCandle || 0) / batchObj.retailPrice) * 100).toFixed(1) : '0.0',
          maxCanMake: canMake?.maxQty || 0
        };
      } catch (e) {
        return { name: recipe.name, size: recipe.size || 9, costPerCandle: '0.00', suggestedPrice: '0.00', profitPerCandle: '0.00', profitMargin: '0.0', maxCanMake: 0 };
      }
    });

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `You are a candle business profit optimization expert. Analyze this inventory and help maximize profit.

**CURRENT INVENTORY:**
${JSON.stringify(inventorySummary, null, 2)}

**RECIPE ECONOMICS (per candle at 12-batch):**
${JSON.stringify(recipeEconomics, null, 2)}

Based on this data, provide:

1. **💰 MAXIMUM POTENTIAL PROFIT**: Calculate the total profit possible if I make all recipes to their max capacity. Show the number clearly.

2. **🎯 OPTIMAL PRODUCTION PLAN**: List exactly which recipes to make and how many, prioritizing highest profit margins and available inventory. Format as a simple list:
   - Recipe Name: X candles = $Y profit

3. **⭐ TOP 3 MONEY MAKERS**: Which recipes give the best return right now?

4. **⚠️ BOTTLENECKS**: What's limiting production? What should I reorder first?

5. **💡 QUICK WIN**: One actionable tip to increase profits this week.

Keep it concise and actionable. Use bullet points. Focus on the numbers.` }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      setProfitAnalysis(responseText);
    } catch (error) {
      console.error("❌ Error getting profit analysis:", error);
      setProfitAnalysis(`Error: ${error.message}\n\nPlease check your API key is valid.`);
    } finally {
      clearInterval(timerInterval);
      setProfitAnalysisLoading(false);
    }
  };

  // Styles
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '8px', color: '#fce4d6', fontSize: '14px' };
  const btnPrimary = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)', border: 'none', borderRadius: '10px', color: '#1a0a1e', fontWeight: 600, cursor: 'pointer', fontSize: '14px' };
  const btnSecondary = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,159,107,0.15)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '8px', color: '#feca57', cursor: 'pointer', fontSize: '13px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a1e 0%, #2d1b3d 25%, #3d1f35 50%, #4a2028 75%, #1a0a1e 100%)', fontFamily: "'Outfit', system-ui, sans-serif", color: '#fce4d6' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(252,228,214,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #ff6b6b, #feca57, #ff9ff3); border-radius: 4px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #ff9f6b !important; box-shadow: 0 0 0 3px rgba(255,159,107,0.2); }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .logo-icon { width: 40px !important; height: 40px !important; }
          .sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh !important;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
          .main-content { padding: 16px !important; }
          .header-batch-info { display: none !important; }

          /* Page header responsive */
          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .page-header-controls {
            flex-wrap: wrap !important;
            width: 100% !important;
          }
          .page-header-controls select {
            flex: 1 !important;
            min-width: 140px !important;
          }
          .page-header-controls button {
            flex: 1 !important;
            justify-content: center !important;
          }
          .page-title { font-size: 24px !important; }

          /* List items responsive */
          .list-item {
            flex-wrap: wrap !important;
            padding: 12px !important;
            gap: 8px !important;
          }
          .list-item .item-id,
          .list-item .item-category,
          .list-item .item-price { display: none !important; }
          .list-item .item-info {
            flex: 1 1 100% !important;
            order: 1 !important;
          }
          .list-item .item-stock {
            order: 2 !important;
            margin-right: auto !important;
          }
          .list-item .item-actions {
            order: 3 !important;
          }
          .list-item .item-checkbox { order: 0 !important; }
          .list-item .item-alert { display: none !important; }

          /* Table responsive */
          .table-wrapper { overflow-x: auto !important; }

          /* Grid cards responsive */
          .grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      
      {/* Header */}
      <header style={{ background: 'linear-gradient(90deg, rgba(255,107,107,0.15) 0%, rgba(254,202,87,0.1) 50%, rgba(255,159,243,0.15) 100%)', borderBottom: '1px solid rgba(255,159,107,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer', padding: '8px', marginRight: '4px' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-icon" style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(255,107,107,0.3)' }}>
            <Flame size={28} color="#1a0a1e" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Light By Dawn</h1>
            <p style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>Candle Business System</p>
          </div>
        </div>
        {batchList.length > 0 && (
          <div className="header-batch-info" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: 'rgba(255,159,107,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}>
              <ShoppingCart size={14} style={{ display: 'inline', marginRight: '6px' }} />
              {batchList.length} batch{batchList.length > 1 ? 'es' : ''} • {stats.pendingCandles} candles
            </span>
            <button onClick={() => setActiveTab('shopping')} style={btnSecondary}>
              <FileText size={16} /> View Shopping List
            </button>
          </div>
        )}
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 81px)' }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none' }}
          />
        )}

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '240px', background: 'rgba(0,0,0,0.95)', borderRight: '1px solid rgba(255,159,107,0.15)', padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', borderRadius: '10px', background: activeTab === item.id ? 'linear-gradient(90deg, rgba(255,107,107,0.25) 0%, rgba(254,202,87,0.15) 50%, rgba(255,159,243,0.1) 100%)' : 'transparent', color: activeTab === item.id ? '#feca57' : 'rgba(252,228,214,0.7)', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === item.id ? 600 : 400, textAlign: 'left', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
              <item.icon size={20} />
              {item.label}
              {item.id === 'shopping' && batchList.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ff6b6b', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>{batchList.length}</span>
              )}
              {activeTab === item.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="main-content" style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Your candle business at a glance</p>
                </div>
                <button onClick={resetAllData} style={{ ...btnSecondary, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><RotateCcw size={16} /> Reset All Data</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Batches', value: stats.totalBatches, icon: Box, color: '#ff6b6b' },
                  { label: 'Candles Made', value: stats.totalCandles, icon: Flame, color: '#feca57' },
                  { label: 'Investment', value: formatCurrency(stats.totalInvestment), icon: DollarSign, color: '#ff9ff3' },
                  { label: 'Materials Value', value: formatCurrency(materials.reduce((sum, m) => sum + (m.packageCost / m.packageSize * m.qtyOnHand), 0)), icon: Package, color: '#feca57' },
                  { label: 'Fragrance Value', value: formatCurrency(fragrances.reduce((sum, f) => sum + Object.entries(f.quantities || {}).reduce((v, [size, qty]) => v + (qty * (f.prices?.[size] || 0)), 0), 0)), icon: Droplets, color: '#74b9ff' },
                  { label: 'Low Stock', value: lowStockItems.length, icon: AlertTriangle, color: lowStockItems.length > 0 ? '#ff6b6b' : '#55efc4' },
                  { label: 'Recipes Ready', value: `${whatCanIMake.filter(w => w.maxQty >= 12).length} / ${recipes.length}`, icon: CheckCircle, color: '#55efc4' },
                  { label: 'Pending', value: `${stats.pendingBatches} batches`, icon: ShoppingCart, color: '#a29bfe' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                    <stat.icon size={24} color={stat.color} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#fce4d6', marginBottom: '4px' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Low Stock Alert Widget */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={20} color="#ff6b6b" /> Low Stock Alert
                    </h3>
                    <span style={{ fontSize: '13px', color: 'rgba(252,228,214,0.5)' }}>{lowStockItems.length} items</span>
                  </div>
                  {lowStockItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(252,228,214,0.5)' }}>
                      <CheckCircle size={32} color="#55efc4" style={{ marginBottom: '8px' }} />
                      <p>All items well stocked!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {lowStockItems.slice(0, 5).map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginLeft: '8px' }}>{item.category}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ff6b6b' }}>{item.qtyOnHand}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)' }}> / {item.reorderPoint}</span>
                          </div>
                        </div>
                      ))}
                      {lowStockItems.length > 5 && (
                        <button onClick={() => setActiveTab('inventory')} style={{ ...btnSecondary, justifyContent: 'center', marginTop: '8px' }}>
                          View all {lowStockItems.length} items
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* What Can I Make Widget */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Zap size={20} color="#55efc4" /> Ready to Make
                    </h3>
                    <button onClick={() => setActiveTab('inventory')} style={{ fontSize: '12px', color: '#feca57', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {whatCanIMake.slice(0, 5).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: item.maxQty >= 12 ? 'rgba(85,239,196,0.1)' : item.maxQty > 0 ? 'rgba(254,202,87,0.1)' : 'rgba(255,107,107,0.1)', borderRadius: '8px', border: `1px solid ${item.maxQty >= 12 ? 'rgba(85,239,196,0.2)' : item.maxQty > 0 ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)'}` }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.recipe.name}</span>
                          <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginLeft: '8px' }}>{item.recipe.size}oz</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.maxQty >= 12 ? (
                            <CheckCircle size={16} color="#55efc4" />
                          ) : item.maxQty > 0 ? (
                            <AlertTriangle size={16} color="#feca57" />
                          ) : (
                            <XCircle size={16} color="#ff6b6b" />
                          )}
                          <span style={{ fontSize: '14px', fontWeight: 600, color: item.maxQty >= 12 ? '#55efc4' : item.maxQty > 0 ? '#feca57' : '#ff6b6b' }}>
                            {item.maxQty > 0 ? `Up to ${item.maxQty}` : 'Need supplies'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Profit Analysis Section */}
              <div style={{ background: 'linear-gradient(135deg, rgba(85,239,196,0.1) 0%, rgba(116,185,255,0.1) 100%)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TrendingUp size={24} color="#55efc4" /> Potential Profit Analyzer
                    <span style={{ fontSize: '11px', padding: '4px 8px', background: 'rgba(85,239,196,0.2)', borderRadius: '4px', color: '#55efc4', fontFamily: 'sans-serif', fontWeight: 500 }}>AI Powered</span>
                  </h3>
                  <button onClick={getProfitAnalysis} disabled={profitAnalysisLoading} style={{ ...btnPrimary, opacity: profitAnalysisLoading ? 0.7 : 1 }}>
                    <Sparkles size={16} /> {profitAnalysisLoading ? `Analyzing... ${profitAnalysisTime}s` : profitAnalysis ? 'Refresh Analysis' : 'Analyze Inventory'}
                  </button>
                </div>
                
                {!profitAnalysis && !profitAnalysisLoading && (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(252,228,214,0.6)' }}>
                    <TrendingUp size={48} color="rgba(85,239,196,0.3)" style={{ marginBottom: '16px' }} />
                    <p style={{ marginBottom: '8px' }}>Click "Analyze Inventory" to get AI-powered profit optimization</p>
                    <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.4)' }}>Based on your current stock levels, recipe costs, and profit margins</p>
                  </div>
                )}
                
                {profitAnalysisLoading && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(85,239,196,0.2)', borderTopColor: '#55efc4', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'rgba(252,228,214,0.6)', marginBottom: '8px' }}>Analyzing your inventory and calculating optimal profit strategy...</p>
                    <p style={{ color: '#55efc4', fontSize: '18px', fontWeight: 600 }}>{profitAnalysisTime}s</p>
                    <p style={{ color: 'rgba(252,228,214,0.4)', fontSize: '12px', marginTop: '8px' }}>
                      {profitAnalysisTime < 5 ? 'Preparing data...' : 
                       profitAnalysisTime < 15 ? 'AI is crunching numbers...' : 
                       profitAnalysisTime < 30 ? 'Almost there, analyzing profit margins...' :
                       'Taking longer than usual, please wait...'}
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}
                
                {profitAnalysis && !profitAnalysisLoading && (
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.7' }}>
                      {profitAnalysis.split('\n').map((line, i) => {
                        // Style headers with ** **
                        if (line.includes('**') && line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={i} style={{ marginBottom: '8px' }}>
                              {parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j} style={{ color: '#55efc4' }}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        // Style bullet points
                        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                          return <p key={i} style={{ marginBottom: '6px', paddingLeft: '16px', color: 'rgba(252,228,214,0.85)' }}>{line}</p>;
                        }
                        // Empty lines
                        if (line.trim() === '') {
                          return <div key={i} style={{ height: '12px' }} />;
                        }
                        return <p key={i} style={{ marginBottom: '8px', color: 'rgba(252,228,214,0.85)' }}>{line}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '16px' }}>Recent Batches</h3>
              {batchHistory.length === 0 ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                  <History size={48} color="rgba(252,228,214,0.3)" style={{ marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>No batches yet</h4>
                  <p style={{ color: 'rgba(252,228,214,0.6)', marginBottom: '24px' }}>Start by building a batch and logging it to your history</p>
                  <button onClick={() => setActiveTab('calculator')} style={btnPrimary}><Calculator size={18} /> Go to Batch Builder</button>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                      {['Batch', 'Date', 'Recipe', 'Qty', 'Status'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchHistory.slice(0, 5).map(b => (
                      <tr key={b.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 500 }}>{b.id}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(252,228,214,0.7)' }}>{b.date}</td>
                        <td style={{ padding: '14px 16px' }}>{b.recipe}</td>
                        <td style={{ padding: '14px 16px' }}>{b.qty}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: b.status === 'Ready' ? 'rgba(85,239,196,0.2)' : 'rgba(254,202,87,0.2)', color: b.status === 'Ready' ? '#55efc4' : '#feca57' }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}

          {/* Batch Builder */}
          {activeTab === 'calculator' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Batch Builder</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Build multiple batches and export to shopping list</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={resetCurrentBatch} style={btnSecondary}><RotateCcw size={16} /> Reset</button>
                  <button onClick={openLogBatchModal} style={{ ...btnSecondary, color: '#55efc4', borderColor: 'rgba(85,239,196,0.3)' }}><ClipboardList size={16} /> Log Batch</button>
                  <button onClick={addBatchToList} style={btnPrimary}><Plus size={18} /> Add to List</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Left - Inputs */}
                <div>
                  <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={20} color="#feca57" /> Batch Details</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Recipe</label>
                        <select value={currentBatch.recipe} onChange={e => { const r = recipes.find(rec => rec.name === e.target.value); if (r) setCurrentBatch({ ...currentBatch, recipe: r.name, size: r.size, foLoad: r.foLoad / 100 }); }} style={inputStyle}>
                          {recipes.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </div>

                      {selectedRecipe && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                          <div style={{ color: '#feca57', marginBottom: '8px' }}>{selectedRecipe.vibe}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {selectedRecipe.components.map((c, i) => (
                              <span key={i} style={{ padding: '4px 8px', background: 'rgba(255,159,107,0.15)', borderRadius: '4px', fontSize: '11px' }}>{c.fragrance} {c.percent}%</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stock Check Warning */}
                      {!currentBatchStock.canMake && (
                        <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <AlertTriangle size={18} color="#ff6b6b" />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ff6b6b' }}>Insufficient Stock</div>
                            <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{currentBatchStock.reason}</div>
                          </div>
                        </div>
                      )}
                      {currentBatchStock.canMake && (
                        <div style={{ background: 'rgba(85,239,196,0.1)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle size={16} color="#55efc4" />
                          <span style={{ fontSize: '12px', color: '#55efc4' }}>Stock available for this batch</span>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Quantity</label>
                          <input type="number" value={currentBatch.quantity} onChange={e => setCurrentBatch({ ...currentBatch, quantity: parseInt(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Size (oz)</label>
                          <input type="number" value={currentBatch.size} onChange={e => setCurrentBatch({ ...currentBatch, size: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Fragrance Load: {(currentBatch.foLoad * 100).toFixed(0)}%</label>
                        <input type="range" min="0.04" max="0.12" step="0.01" value={currentBatch.foLoad} onChange={e => setCurrentBatch({ ...currentBatch, foLoad: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#feca57' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Retail Price</label>
                        <input type="number" step="0.01" value={currentBatch.retailPrice} onChange={e => setCurrentBatch({ ...currentBatch, retailPrice: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  {/* Unit Costs */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Unit Costs</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[{ label: 'Wax $/oz', key: 'waxCostPerOz' }, { label: 'Container', key: 'containerCost' }, { label: 'Wick', key: 'wickCost' }, { label: 'Label', key: 'labelCost' }, { label: 'Packaging', key: 'packagingCost' }, { label: 'Avg FO $/oz', key: 'avgFoCost' }].map(item => (
                        <div key={item.key}>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>{item.label}</label>
                          <input type="number" step="0.01" value={currentBatch[item.key]} onChange={e => setCurrentBatch({ ...currentBatch, [item.key]: parseFloat(e.target.value) || 0 })} style={{ ...inputStyle, padding: '8px 12px', fontSize: '13px' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right - Results */}
                <div>
                  <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Cost Per Candle</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[{ label: 'Wax', value: currentCalc.waxCost }, { label: 'Fragrance', value: currentCalc.foCost }, { label: 'Container', value: currentBatch.containerCost }, { label: 'Wick', value: currentBatch.wickCost }, { label: 'Label', value: currentBatch.labelCost }, { label: 'Packaging', value: currentBatch.packagingCost }].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(252,228,214,0.7)' }}>{item.label}</span>
                          <span>{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255,159,107,0.2)', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                        <span>Total Cost</span>
                        <span style={{ color: '#feca57' }}>{formatCurrency(currentCalc.totalCostPerCandle)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'linear-gradient(135deg, rgba(85,239,196,0.15) 0%, rgba(85,239,196,0.05) 100%)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#55efc4' }}>Profit Analysis</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Profit per Candle</span><span style={{ fontWeight: 600, color: '#55efc4' }}>{formatCurrency(currentCalc.profitPerCandle)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Profit Margin</span><span style={{ fontWeight: 600, color: '#55efc4' }}>{formatPercent(currentCalc.profitMargin)}</span></div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,159,107,0.3)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Batch Totals ({currentBatch.quantity} candles)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(252,228,214,0.7)' }}>Wax Needed</span><span>{currentCalc.totalWaxBatch.toFixed(1)} oz ({(currentCalc.totalWaxBatch / 16).toFixed(2)} lbs)</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(252,228,214,0.7)' }}>Fragrance Needed</span><span>{currentCalc.totalFoBatch.toFixed(1)} oz</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(252,228,214,0.7)' }}>Total Batch Cost</span><span>{formatCurrency(currentCalc.totalBatchCost)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(252,228,214,0.7)' }}>Total Revenue</span><span>{formatCurrency(currentCalc.totalBatchRevenue)}</span></div>
                      <div style={{ borderTop: '2px solid rgba(255,159,107,0.3)', paddingTop: '16px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 700 }}>
                        <span>Total Profit</span>
                        <span style={{ color: '#55efc4' }}>{formatCurrency(currentCalc.totalBatchProfit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch List */}
              {batchList.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>Batches to Build ({batchList.length})</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={clearAllBatches} style={{ ...btnSecondary, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><Trash2 size={16} /> Clear All</button>
                      <button onClick={() => setActiveTab('shopping')} style={btnPrimary}><ShoppingCart size={18} /> View Shopping List</button>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                          {['Recipe', 'Qty', 'Size', 'Cost/Each', 'Batch Cost', 'Batch Profit', ''].map(h => (
                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batchList.map(b => {
                          const c = calculateBatch(b);
                          return (
                            <tr key={b.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 500 }}>{b.recipe}</td>
                              <td style={{ padding: '14px 16px' }}>{b.quantity}</td>
                              <td style={{ padding: '14px 16px' }}>{b.size} oz</td>
                              <td style={{ padding: '14px 16px' }}>{formatCurrency(c.totalCostPerCandle)}</td>
                              <td style={{ padding: '14px 16px' }}>{formatCurrency(c.totalBatchCost)}</td>
                              <td style={{ padding: '14px 16px', color: '#55efc4', fontWeight: 600 }}>{formatCurrency(c.totalBatchProfit)}</td>
                              <td style={{ padding: '14px 16px' }}>
                                <button onClick={() => removeBatchFromList(b.id)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Inventory - What Can I Make */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inventory</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Track stock levels and see what you can make</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Materials Value</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#feca57' }}>{formatCurrency(materials.reduce((sum, m) => sum + (m.packageCost / m.packageSize * m.qtyOnHand), 0))}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Fragrance Value</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#74b9ff' }}>{formatCurrency(fragrances.reduce((sum, f) => sum + Object.entries(f.quantities || {}).reduce((v, [size, qty]) => v + (qty * (f.prices?.[size] || 0)), 0), 0))}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Low Stock Items</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: lowStockItems.length > 0 ? '#ff6b6b' : '#55efc4' }}>{lowStockItems.length}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Recipes Ready</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#55efc4' }}>{whatCanIMake.filter(w => w.maxQty >= 12).length} / {recipes.length}</div>
                </div>
              </div>

              {/* Low Stock Alert Section */}
              {lowStockItems.length > 0 && (
                <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6b6b' }}>
                    <AlertTriangle size={20} /> Low Stock Alert - {lowStockItems.length} items need reordering
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {lowStockItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
                          <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{item.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff6b6b' }}>{item.qtyOnHand}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.4)' }}> / {item.reorderPoint} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What Can I Make */}
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={24} color="#55efc4" /> What Can I Make?
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                {whatCanIMake.map((item, i) => {
                  const statusColor = item.maxQty >= 24 ? '#55efc4' : item.maxQty >= 12 ? '#feca57' : item.maxQty > 0 ? '#ff9f6b' : '#ff6b6b';
                  const statusBg = item.maxQty >= 24 ? 'rgba(85,239,196,0.1)' : item.maxQty >= 12 ? 'rgba(254,202,87,0.1)' : item.maxQty > 0 ? 'rgba(255,159,107,0.1)' : 'rgba(255,107,107,0.1)';
                  const statusBorder = item.maxQty >= 24 ? 'rgba(85,239,196,0.3)' : item.maxQty >= 12 ? 'rgba(254,202,87,0.3)' : item.maxQty > 0 ? 'rgba(255,159,107,0.3)' : 'rgba(255,107,107,0.3)';
                  
                  return (
                    <div key={i} style={{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{item.recipe.name}</h4>
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{item.recipe.size}oz • {item.recipe.vibe}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {item.maxQty >= 12 ? (
                            <CheckCircle size={24} color={statusColor} />
                          ) : item.maxQty > 0 ? (
                            <AlertTriangle size={24} color={statusColor} />
                          ) : (
                            <XCircle size={24} color={statusColor} />
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px', fontWeight: 700, color: statusColor }}>{item.maxQty}</span>
                        <span style={{ fontSize: '14px', color: 'rgba(252,228,214,0.6)' }}>candles max</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {[6, 12, 24].map(qty => (
                          <span key={qty} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: item.maxQty >= qty ? 'rgba(85,239,196,0.2)' : 'rgba(255,107,107,0.2)', color: item.maxQty >= qty ? '#55efc4' : '#ff6b6b' }}>
                            {qty}x {item.maxQty >= qty ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                      
                      {item.maxQty < 12 && (
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', fontStyle: 'italic' }}>
                          {item.limitReason}
                        </div>
                      )}
                      
                      {item.maxQty >= 12 && (
                        <button onClick={() => { setCurrentBatch({ ...currentBatch, recipe: item.recipe.name, size: item.recipe.size, foLoad: item.recipe.foLoad / 100, quantity: 12 }); setActiveTab('calculator'); }} style={{ ...btnSecondary, width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '12px' }}>
                          <Calculator size={14} /> Build Batch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Materials */}
          {activeTab === 'materials' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Materials</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>All your raw materials with inventory tracking</p>
                </div>
                <div className="page-header-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Category Filter */}
                  <select value={materialFilter} onChange={e => setMaterialFilter(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '8px', color: '#fce4d6', fontSize: '13px' }}>
                    <option value="All">All Categories</option>
                    {['Wax', 'Container', 'Wick', 'Label', 'Packaging', 'Unit'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {/* Sort Dropdown */}
                  <select value={materialSort} onChange={e => setMaterialSort(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '8px', color: '#fce4d6', fontSize: '13px' }}>
                    <option value="name">Sort: Name A-Z</option>
                    <option value="category">Sort: Category</option>
                    <option value="vendor">Sort: Vendor</option>
                    <option value="cost">Sort: Cost (High-Low)</option>
                    <option value="cost-asc">Sort: Cost (Low-High)</option>
                    <option value="stock">Sort: Stock (Low-High)</option>
                    <option value="stock-desc">Sort: Stock (High-Low)</option>
                  </select>
                  {/* View Toggle */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                    {[{ id: 'grid', icon: Grid }, { id: 'list', icon: List }, { id: 'table', icon: Table }].map(v => (
                      <button key={v.id} onClick={() => setMaterialView(v.id)} style={{ padding: '8px 12px', background: materialView === v.id ? 'rgba(255,159,107,0.3)' : 'transparent', border: 'none', borderRadius: '6px', color: materialView === v.id ? '#feca57' : 'rgba(252,228,214,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <v.icon size={16} />
                      </button>
                    ))}
                  </div>
                  <button onClick={openAddMaterial} style={btnPrimary}><Plus size={18} /> Add Material</button>
                </div>
              </div>

              {/* Selection Bar */}
              {selectedMaterials.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, rgba(254,202,87,0.2) 0%, rgba(255,159,107,0.15) 100%)', border: '1px solid rgba(254,202,87,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px' }}><strong style={{ color: '#feca57' }}>{selectedMaterials.length}</strong> material{selectedMaterials.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={selectAllMaterials} style={{ ...btnSecondary, padding: '8px 16px', fontSize: '13px' }}><Check size={14} /> Select All ({filteredMaterials.length})</button>
                    <button onClick={clearMaterialSelection} style={{ ...btnSecondary, padding: '8px 16px', fontSize: '13px' }}><X size={14} /> Clear</button>
                    <button onClick={deleteSelectedMaterials} style={{ ...btnSecondary, padding: '8px 16px', fontSize: '13px', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><Trash2 size={14} /> Delete Selected</button>
                  </div>
                </div>
              )}

              {/* Low Stock Alert */}
              {materials.filter(m => m.qtyOnHand < m.reorderPoint).length > 0 && (
                <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={20} color="#ff6b6b" />
                  <span style={{ color: '#ff6b6b', fontSize: '14px' }}>
                    <strong>{materials.filter(m => m.qtyOnHand < m.reorderPoint).length} item(s)</strong> below reorder point
                  </span>
                </div>
              )}

              {/* Grid View */}
              {materialView === 'grid' && (
                <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {filteredMaterials.map(m => {
                    const isSelected = selectedMaterials.includes(m.id);
                    const isLowStock = m.qtyOnHand < m.reorderPoint;
                    return (
                      <div key={m.id} onClick={() => toggleMaterialSelection(m.id)} style={{ background: isSelected ? 'rgba(254,202,87,0.15)' : 'rgba(255,159,107,0.08)', border: `2px solid ${isLowStock ? 'rgba(255,107,107,0.5)' : isSelected ? 'rgba(254,202,87,0.5)' : 'rgba(255,159,107,0.15)'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', background: '#feca57', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} color="#1a0a1e" />
                          </div>
                        )}
                        {isLowStock && !isSelected && (
                          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                            <AlertTriangle size={18} color="#ff6b6b" />
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', padding: '4px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', color: 'rgba(252,228,214,0.6)' }}>{m.id}</span>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: categoryColors[m.category]?.bg || 'rgba(255,255,255,0.1)', color: categoryColors[m.category]?.text || '#fff' }}>{m.category}</span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{m.name}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                          <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Vendor:</span> {m.vendor}</div>
                          <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Pkg:</span> {m.packageSize} {m.unit}</div>
                          <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Cost:</span> {formatCurrency(m.packageCost)}</div>
                          <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>$/unit:</span> <span style={{ color: '#feca57', fontWeight: 600 }}>{formatCurrency(m.packageCost / m.packageSize)}</span></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,159,107,0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={(e) => { e.stopPropagation(); adjustInventory(m.id, -1); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                            <div style={{ textAlign: 'center', minWidth: '50px' }}>
                              <span style={{ fontSize: '18px', fontWeight: 600, color: isLowStock ? '#ff6b6b' : '#55efc4' }}>{m.qtyOnHand}</span>
                              <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>min {m.reorderPoint}</div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); adjustInventory(m.id, 1); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(85,239,196,0.2)', color: '#55efc4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => openEditMaterial(m)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={12} /></button>
                            <button onClick={(e) => deleteMaterial(m.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {materialView === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredMaterials.map(m => {
                    const isSelected = selectedMaterials.includes(m.id);
                    const isLowStock = m.qtyOnHand < m.reorderPoint;
                    return (
                      <div key={m.id} className="list-item" onClick={() => toggleMaterialSelection(m.id)} style={{ background: isSelected ? 'rgba(254,202,87,0.15)' : 'rgba(255,159,107,0.08)', border: `2px solid ${isLowStock ? 'rgba(255,107,107,0.5)' : isSelected ? 'rgba(254,202,87,0.5)' : 'rgba(255,159,107,0.15)'}`, borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="item-checkbox" style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${isSelected ? '#feca57' : 'rgba(255,159,107,0.3)'}`, background: isSelected ? '#feca57' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSelected && <Check size={14} color="#1a0a1e" />}
                        </div>
                        <span className="item-id" style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(252,228,214,0.5)', width: '60px' }}>{m.id}</span>
                        <span className="item-category" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: categoryColors[m.category]?.bg || 'rgba(255,255,255,0.1)', color: categoryColors[m.category]?.text || '#fff', width: '80px', textAlign: 'center' }}>{m.category}</span>
                        <div className="item-info" style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{m.name}</h4>
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{m.vendor} • {m.packageSize} {m.unit} • {formatCurrency(m.packageCost)}</span>
                        </div>
                        <div className="item-price" style={{ textAlign: 'right', marginRight: '12px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: '#feca57' }}>{formatCurrency(m.packageCost / m.packageSize)}/unit</div>
                        </div>
                        <div className="item-stock" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => adjustInventory(m.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                          <div style={{ textAlign: 'center', minWidth: '50px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: isLowStock ? '#ff6b6b' : '#55efc4' }}>{m.qtyOnHand}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.5)' }}>on hand</div>
                          </div>
                          <button onClick={() => adjustInventory(m.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(85,239,196,0.2)', color: '#55efc4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                        </div>
                        <span className="item-alert">{isLowStock && <AlertTriangle size={18} color="#ff6b6b" />}</span>
                        <div className="item-actions" style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => openEditMaterial(m)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button onClick={(e) => deleteMaterial(m.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table View */}
              {materialView === 'table' && (
                <div className="table-wrapper" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', width: '40px' }}>
                          <div onClick={() => selectedMaterials.length === filteredMaterials.length ? clearMaterialSelection() : selectAllMaterials()} style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 ? '#feca57' : 'rgba(255,159,107,0.3)'}`, background: selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 ? '#feca57' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            {selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 && <Check size={12} color="#1a0a1e" />}
                          </div>
                        </th>
                        {['ID', 'Category', 'Name', 'Vendor', 'Pkg Size', 'Pkg Cost', '$/Unit', 'On Hand', 'Reorder', ''].map(h => (
                          <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials.map(m => {
                        const isSelected = selectedMaterials.includes(m.id);
                        const isLowStock = m.qtyOnHand < m.reorderPoint;
                        return (
                          <tr key={m.id} onClick={() => toggleMaterialSelection(m.id)} style={{ borderTop: '1px solid rgba(255,159,107,0.1)', background: isSelected ? 'rgba(254,202,87,0.1)' : isLowStock ? 'rgba(255,107,107,0.05)' : 'transparent', cursor: 'pointer' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${isSelected ? '#feca57' : 'rgba(255,159,107,0.3)'}`, background: isSelected ? '#feca57' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isSelected && <Check size={12} color="#1a0a1e" />}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{m.id}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: categoryColors[m.category]?.bg || 'rgba(255,255,255,0.1)', color: categoryColors[m.category]?.text || '#fff' }}>{m.category}</span>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 500 }}>{m.name}</td>
                            <td style={{ padding: '14px 16px', color: 'rgba(252,228,214,0.7)' }}>{m.vendor}</td>
                            <td style={{ padding: '14px 16px' }}>{m.packageSize} {m.unit}</td>
                            <td style={{ padding: '14px 16px' }}>{formatCurrency(m.packageCost)}</td>
                            <td style={{ padding: '14px 16px', color: '#feca57', fontWeight: 600 }}>{formatCurrency(m.packageCost / m.packageSize)}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button onClick={(e) => { e.stopPropagation(); adjustInventory(m.id, -1); }} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                                <span style={{ fontWeight: 600, color: isLowStock ? '#ff6b6b' : '#55efc4', minWidth: '40px', textAlign: 'center' }}>{m.qtyOnHand}</span>
                                <button onClick={(e) => { e.stopPropagation(); adjustInventory(m.id, 1); }} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(85,239,196,0.2)', color: '#55efc4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                                {isLowStock && <AlertTriangle size={14} color="#ff6b6b" />}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'rgba(252,228,214,0.5)' }}>{m.reorderPoint}</td>
                            <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => openEditMaterial(m)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={12} /></button>
                                <button onClick={(e) => deleteMaterial(m.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '24px' }}>
                {[
                  { label: 'Total Items', value: materials.length, color: '#feca57' },
                  { label: 'Categories', value: [...new Set(materials.map(m => m.category))].length, color: '#74b9ff' },
                  { label: 'Low Stock', value: materials.filter(m => m.qtyOnHand < m.reorderPoint).length, color: '#ff6b6b' },
                  { label: 'Total Value', value: formatCurrency(materials.reduce((sum, m) => sum + (m.packageCost / m.packageSize * m.qtyOnHand), 0)), color: '#55efc4' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fragrances */}
          {activeTab === 'fragrances' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fragrances</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Your fragrance oils and essential oils library</p>
                </div>
                <div className="page-header-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Sort Dropdown */}
                  <select value={fragranceSort} onChange={e => setFragranceSort(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '8px', color: '#fce4d6', fontSize: '13px' }}>
                    <option value="name">Sort: Name A-Z</option>
                    <option value="type">Sort: Type (EO/FO)</option>
                    <option value="vendor">Sort: Vendor</option>
                    <option value="cost">Sort: Cost (High-Low)</option>
                    <option value="stock">Sort: Stock (Low-High)</option>
                    <option value="stock-desc">Sort: Stock (High-Low)</option>
                  </select>
                  {/* View Toggle */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                    {[{ id: 'grid', icon: Grid }, { id: 'list', icon: List }, { id: 'table', icon: Table }].map(v => (
                      <button key={v.id} onClick={() => setFragranceView(v.id)} style={{ padding: '8px 12px', background: fragranceView === v.id ? 'rgba(255,159,107,0.3)' : 'transparent', border: 'none', borderRadius: '6px', color: fragranceView === v.id ? '#feca57' : 'rgba(252,228,214,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <v.icon size={16} />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowArchivedFragrances(!showArchivedFragrances)} style={{ padding: '8px 16px', background: showArchivedFragrances ? 'rgba(162,155,254,0.3)' : 'rgba(0,0,0,0.3)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '8px', color: showArchivedFragrances ? '#a29bfe' : 'rgba(252,228,214,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Archive size={16} /> {showArchivedFragrances ? 'Hide Archived' : 'Show Archived'}</button>
                  <button onClick={openAddFragrance} style={btnPrimary}><Plus size={18} /> Add Fragrance</button>
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Fragrances</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#feca57' }}>{fragrances.filter(f => !f.archived).length}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Stock</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#55efc4' }}>{fragrances.reduce((sum, f) => sum + Object.entries(f.quantities || {}).reduce((s, [sz, qty]) => s + (qty * parseFloat(sz)), 0), 0).toFixed(1)} oz</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#74b9ff' }}>{formatCurrency(fragrances.reduce((sum, f) => sum + Object.entries(f.quantities || {}).reduce((v, [size, qty]) => v + (qty * (f.prices?.[size] || 0)), 0), 0))}</div>
                </div>
              </div>

              {/* Selection Bar */}
              {selectedFragrances.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, rgba(162,155,254,0.2) 0%, rgba(255,159,243,0.15) 100%)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px' }}><strong style={{ color: '#a29bfe' }}>{selectedFragrances.length}</strong> fragrance{selectedFragrances.length > 1 ? 's' : ''} selected</span>
                    {selectedFragrances.length === 1 && (
                      <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', fontStyle: 'italic' }}>Select 2+ to make a recipe</span>
                    )}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedFragrances.map(id => {
                        const f = fragrances.find(fr => fr.id === id);
                        return f ? (
                          <span key={id} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px' }}>{f.name}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={clearFragranceSelection} style={{ ...btnSecondary, padding: '8px 16px', fontSize: '13px' }}><X size={14} /> Clear</button>
                    {selectedFragrances.length >= 2 && (
                      <button onClick={createRecipeFromSelection} style={{ ...btnSecondary, padding: '8px 16px', fontSize: '13px', color: '#55efc4', borderColor: 'rgba(85,239,196,0.3)' }}>
                        <BookOpen size={14} /> Make Recipe
                      </button>
                    )}
                    <button onClick={getAiAdvice} disabled={aiLoading || selectedFragrances.length < 2} style={{ ...btnPrimary, padding: '8px 16px', fontSize: '13px', opacity: (aiLoading || selectedFragrances.length < 2) ? 0.5 : 1 }}>
                      <Sparkles size={14} /> {aiLoading ? 'Analyzing...' : 'Get AI Advice'}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '24px' }}>
                {/* Main Content */}
                <div style={{ flex: 1 }}>
                  {/* Grid View */}
                  {fragranceView === 'grid' && (
                    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {sortedFragrances.map(f => {
                        const isSelected = selectedFragrances.includes(f.id);
                        return (
                          <div key={f.id} onClick={() => toggleFragranceSelection(f.id)} style={{ background: isSelected ? 'rgba(162,155,254,0.15)' : 'rgba(255,159,107,0.08)', border: `2px solid ${isSelected ? 'rgba(162,155,254,0.5)' : 'rgba(255,159,107,0.15)'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}>
                            {isSelected && (
                              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', background: '#a29bfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={14} color="#1a0a1e" />
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <div>
                                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{f.name}</h4>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: f.type === 'FO' ? 'rgba(254,202,87,0.2)' : 'rgba(85,239,196,0.2)', color: f.type === 'FO' ? '#feca57' : '#55efc4' }}>{f.type === 'FO' ? 'Fragrance Oil' : 'Essential Oil'}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                <button onClick={() => openEditFragrance(f)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={12} /></button>
                                <button onClick={() => window.open(`https://www.amazon.com/s?k=fragrance+oil+${encodeURIComponent(f.name)}`, '_blank')} style={{ background: 'rgba(255,159,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff9f6b', cursor: 'pointer' }} title="Search on Amazon"><ExternalLink size={12} /></button>
                                <button onClick={(e) => archiveFragrance(f.id, e)} style={{ background: f.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: f.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={f.archived ? 'Unarchive' : 'Archive'}><Archive size={12} /></button>
                                <button onClick={(e) => deleteFragrance(f.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                              <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Vendor:</span> {f.vendor}</div>
                              <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Stock:</span> <span style={{ color: '#55efc4', fontWeight: 600 }}>{(Object.entries(f.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0) || f.qtyOnHand || 0).toFixed(1)} oz</span></div>
                              <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Max Load:</span> {f.maxLoad}%</div>
                              <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Avg $/oz:</span> <span style={{ color: '#feca57', fontWeight: 600 }}>{(() => { const prices = f.prices || {}; const valid = Object.entries(prices).filter(([s, p]) => p > 0).map(([s, p]) => p / parseFloat(s)); return valid.length > 0 ? formatCurrency(valid.reduce((a, b) => a + b, 0) / valid.length) : (f.packageCost > 0 ? formatCurrency(f.packageCost / f.packageSize) : '$0.00'); })()}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* List View */}
                  {fragranceView === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sortedFragrances.map(f => {
                        const isSelected = selectedFragrances.includes(f.id);
                        return (
                          <div key={f.id} className="list-item" onClick={() => toggleFragranceSelection(f.id)} style={{ background: isSelected ? 'rgba(162,155,254,0.15)' : 'rgba(255,159,107,0.08)', border: `2px solid ${isSelected ? 'rgba(162,155,254,0.5)' : 'rgba(255,159,107,0.15)'}`, borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="item-checkbox" style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${isSelected ? '#a29bfe' : 'rgba(255,159,107,0.3)'}`, background: isSelected ? '#a29bfe' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isSelected && <Check size={14} color="#1a0a1e" />}
                            </div>
                            <div className="item-info" style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{f.name}</h4>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: f.type === 'FO' ? 'rgba(254,202,87,0.2)' : 'rgba(85,239,196,0.2)', color: f.type === 'FO' ? '#feca57' : '#55efc4' }}>{f.type}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{f.vendor} • <span style={{ color: '#55efc4' }}>{(Object.entries(f.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0) || f.qtyOnHand || 0).toFixed(1)} oz</span></div>
                            </div>
                            <div className="item-price" style={{ textAlign: 'right', marginRight: '12px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 600, color: '#feca57' }}>{(() => { const prices = f.prices || {}; const valid = Object.entries(prices).filter(([s, p]) => p > 0).map(([s, p]) => p / parseFloat(s)); return valid.length > 0 ? formatCurrency(valid.reduce((a, b) => a + b, 0) / valid.length) : (f.packageCost > 0 ? formatCurrency(f.packageCost / f.packageSize) : '$0.00'); })()}/oz</div>
                              <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>Max {f.maxLoad}%</div>
                            </div>
                            <div className="item-actions" style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => openEditFragrance(f)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={14} /></button>
                              <button onClick={() => window.open(`https://www.amazon.com/s?k=fragrance+oil+${encodeURIComponent(f.name)}`, '_blank')} style={{ background: 'rgba(255,159,107,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#ff9f6b', cursor: 'pointer' }} title="Search on Amazon"><ExternalLink size={14} /></button>
                              <button onClick={(e) => archiveFragrance(f.id, e)} style={{ background: f.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: f.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={f.archived ? 'Unarchive' : 'Archive'}><Archive size={14} /></button>
                              <button onClick={(e) => deleteFragrance(f.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Table View */}
                  {fragranceView === 'table' && (
                    <div className="table-wrapper" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                            <th style={{ padding: '14px 16px', textAlign: 'left', width: '40px' }}></th>
                            {['Name', 'Type', 'Vendor', 'Stock', 'Avg $/oz', 'Max Load', ''].map(h => (
                              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedFragrances.map(f => {
                            const isSelected = selectedFragrances.includes(f.id);
                            return (
                              <tr key={f.id} onClick={() => toggleFragranceSelection(f.id)} style={{ borderTop: '1px solid rgba(255,159,107,0.1)', background: isSelected ? 'rgba(162,155,254,0.1)' : 'transparent', cursor: 'pointer' }}>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${isSelected ? '#a29bfe' : 'rgba(255,159,107,0.3)'}`, background: isSelected ? '#a29bfe' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {isSelected && <Check size={12} color="#1a0a1e" />}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{f.name}</td>
                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: f.type === 'FO' ? 'rgba(254,202,87,0.2)' : 'rgba(85,239,196,0.2)', color: f.type === 'FO' ? '#feca57' : '#55efc4' }}>{f.type}</span>
                                </td>
                                <td style={{ padding: '14px 16px', color: 'rgba(252,228,214,0.7)' }}>{f.vendor}</td>
                                <td style={{ padding: '14px 16px', color: '#55efc4', fontWeight: 600 }}>{(Object.entries(f.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0) || f.qtyOnHand || 0).toFixed(1)} oz</td>
                                <td style={{ padding: '14px 16px', color: '#feca57', fontWeight: 600 }}>{(() => { const prices = f.prices || {}; const valid = Object.entries(prices).filter(([s, p]) => p > 0).map(([s, p]) => p / parseFloat(s)); return valid.length > 0 ? formatCurrency(valid.reduce((a, b) => a + b, 0) / valid.length) : (f.packageCost > 0 ? formatCurrency(f.packageCost / f.packageSize) : '$0.00'); })()}</td>
                                <td style={{ padding: '14px 16px' }}>{f.maxLoad}%</td>
                                <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => openEditFragrance(f)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={12} /></button>
                                    <button onClick={() => window.open(`https://www.amazon.com/s?k=fragrance+oil+${encodeURIComponent(f.name)}`, '_blank')} style={{ background: 'rgba(255,159,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff9f6b', cursor: 'pointer' }} title="Search on Amazon"><ExternalLink size={12} /></button>
                                    <button onClick={(e) => archiveFragrance(f.id, e)} style={{ background: f.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: f.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={f.archived ? 'Unarchive' : 'Archive'}><Archive size={12} /></button>
                                    <button onClick={(e) => deleteFragrance(f.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* AI Assistant Panel */}
                {showAiPanel && (
                  <div style={{ width: '380px', flexShrink: 0 }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(162,155,254,0.15) 0%, rgba(255,159,243,0.1) 100%)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '16px', padding: '20px', position: 'sticky', top: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={20} color="#1a0a1e" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>AI Blend Advisor</h3>
                            <p style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>Powered by Claude</p>
                          </div>
                        </div>
                        <button onClick={() => setShowAiPanel(false)} style={{ background: 'none', border: 'none', color: 'rgba(252,228,214,0.5)', cursor: 'pointer' }}><X size={18} /></button>
                      </div>

                      {aiLoading && (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(162,155,254,0.3)', borderTopColor: '#a29bfe', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                          <p style={{ color: 'rgba(252,228,214,0.7)' }}>Analyzing your fragrance combination...</p>
                          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                      )}

                      {aiResponse && !aiLoading && (
                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(252,228,214,0.9)', whiteSpace: 'pre-wrap' }}>
                          {aiResponse.split('\n').map((line, i) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return <h4 key={i} style={{ fontSize: '14px', fontWeight: 600, color: '#a29bfe', marginTop: i > 0 ? '16px' : '0', marginBottom: '8px' }}>{line.replace(/\*\*/g, '')}</h4>;
                            }
                            if (line.match(/^\d+\.\s\*\*/)) {
                              return <h4 key={i} style={{ fontSize: '14px', fontWeight: 600, color: '#a29bfe', marginTop: '16px', marginBottom: '8px' }}>{line.replace(/\*\*/g, '')}</h4>;
                            }
                            return <p key={i} style={{ marginBottom: '8px' }}>{line}</p>;
                          })}
                        </div>
                      )}

                      {!aiResponse && !aiLoading && (
                        <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(252,228,214,0.5)' }}>
                          <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                          <p style={{ fontSize: '13px' }}>Select 2+ fragrances and click "Get AI Advice" for blend recommendations</p>
                        </div>
                      )}

                      {aiResponse && !aiLoading && (
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(162,155,254,0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button onClick={createRecipeFromSelection} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', fontSize: '13px' }}>
                            <BookOpen size={14} /> Make Recipe
                          </button>
                          <button onClick={getAiAdvice} style={{ ...btnSecondary, width: '100%', justifyContent: 'center', fontSize: '13px' }}>
                            <RotateCcw size={14} /> Regenerate Advice
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tip when no selection */}
              {selectedFragrances.length === 0 && !showAiPanel && (
                <div style={{ marginTop: '24px', background: 'rgba(162,155,254,0.1)', border: '1px dashed rgba(162,155,254,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <Sparkles size={24} color="#a29bfe" style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '14px', color: 'rgba(252,228,214,0.7)' }}>
                    <strong style={{ color: '#a29bfe' }}>Tip:</strong> Click on fragrances to select them, then use the AI Blend Advisor to get recipe suggestions and scent ratios!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recipes */}
          {activeTab === 'recipes' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Recipes</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Your signature candle blends</p>
                </div>
                <div className="page-header-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Sort Dropdown */}
                  <select value={recipeSort} onChange={e => setRecipeSort(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '8px', color: '#fce4d6', fontSize: '13px' }}>
                    <option value="name">Sort: Name A-Z</option>
                    <option value="size">Sort: Size (Large-Small)</option>
                    <option value="size-asc">Sort: Size (Small-Large)</option>
                    <option value="canMake">Sort: Can Make (Most)</option>
                    <option value="profit">Sort: Profit (High-Low)</option>
                    <option value="components">Sort: Complexity (Simple)</option>
                    <option value="components-desc">Sort: Complexity (Complex)</option>
                    <option value="vibe">Sort: Vibe/Theme</option>
                  </select>
                  {/* View Toggle */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                    {[{ id: 'grid', icon: Grid }, { id: 'list', icon: List }, { id: 'table', icon: Table }].map(v => (
                      <button key={v.id} onClick={() => setRecipeView(v.id)} style={{ padding: '8px 12px', background: recipeView === v.id ? 'rgba(255,159,107,0.3)' : 'transparent', border: 'none', borderRadius: '6px', color: recipeView === v.id ? '#feca57' : 'rgba(252,228,214,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <v.icon size={16} />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowArchivedRecipes(!showArchivedRecipes)} style={{ padding: '8px 16px', background: showArchivedRecipes ? 'rgba(162,155,254,0.3)' : 'rgba(0,0,0,0.3)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '8px', color: showArchivedRecipes ? '#a29bfe' : 'rgba(252,228,214,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Archive size={16} /> {showArchivedRecipes ? 'Hide Archived' : 'Show Archived'}</button>
                  <button onClick={openNewRecipe} style={btnPrimary}><Plus size={18} /> Create Recipe</button>
                </div>
              </div>

              {/* Grid View */}
              {recipeView === 'grid' && (
                <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {sortedRecipes.map(r => {
                    const canMakeInfo = whatCanIMake.find(w => w.recipe.name === r.name);
                    return (
                      <div key={r.id} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '4px' }}>{r.name}</h3>
                            <p style={{ color: '#feca57', fontSize: '13px' }}>{r.vibe}</p>
                          </div>
                          {canMakeInfo && (
                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: canMakeInfo.maxQty >= 12 ? 'rgba(85,239,196,0.2)' : canMakeInfo.maxQty > 0 ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)', color: canMakeInfo.maxQty >= 12 ? '#55efc4' : canMakeInfo.maxQty > 0 ? '#feca57' : '#ff6b6b' }}>
                              {canMakeInfo.maxQty > 0 ? `${canMakeInfo.maxQty}` : '0'}
                            </span>
                          )}
                        </div>
                        <p style={{ color: 'rgba(252,228,214,0.5)', fontSize: '12px', marginBottom: '12px' }}>{r.size}oz • {r.foLoad}% FO • {r.components.length} notes</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {r.components.slice(0, 3).map((c, i) => (
                            <span key={i} style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', fontSize: '11px' }}>{c.fragrance}</span>
                          ))}
                          {r.components.length > 3 && <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>+{r.components.length - 3}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditRecipe(r)} style={{ ...btnSecondary, flex: 1, justifyContent: 'center', padding: '8px' }}><Edit2 size={14} /></button>
                          <button onClick={(e) => copyRecipe(r, e)} style={{ ...btnSecondary, padding: '8px', color: '#74b9ff', borderColor: 'rgba(116,185,255,0.3)' }} title="Copy Recipe"><Copy size={14} /></button>
                          <button onClick={(e) => archiveRecipe(r.id, e)} style={{ ...btnSecondary, padding: '8px', color: r.archived ? '#55efc4' : '#a29bfe', borderColor: r.archived ? 'rgba(85,239,196,0.3)' : 'rgba(162,155,254,0.3)' }} title={r.archived ? 'Unarchive' : 'Archive'}><Archive size={14} /></button>
                          <button onClick={(e) => deleteRecipe(r.id, e)} style={{ ...btnSecondary, padding: '8px', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {recipeView === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sortedRecipes.map(r => {
                    const canMakeInfo = whatCanIMake.find(w => w.recipe.name === r.name);
                    return (
                      <div key={r.id} className="list-item" style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="item-info" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{r.name}</h4>
                            <span style={{ color: '#feca57', fontSize: '12px' }}>{r.vibe}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{r.size}oz • {r.container} • {r.components.length} fragrance notes</div>
                        </div>
                        <div className="item-price" style={{ textAlign: 'right', marginRight: '12px' }}>
                          {canMakeInfo && (
                            <div style={{ fontSize: '16px', fontWeight: 600, color: canMakeInfo.maxQty >= 12 ? '#55efc4' : canMakeInfo.maxQty > 0 ? '#feca57' : '#ff6b6b' }}>
                              {canMakeInfo.maxQty > 0 ? `Can make ${canMakeInfo.maxQty}` : 'Need supplies'}
                            </div>
                          )}
                        </div>
                        <div className="item-actions" style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEditRecipe(r)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button onClick={(e) => copyRecipe(r, e)} style={{ background: 'rgba(116,185,255,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#74b9ff', cursor: 'pointer' }} title="Copy Recipe"><Copy size={14} /></button>
                          <button onClick={(e) => archiveRecipe(r.id, e)} style={{ background: r.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: r.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={r.archived ? 'Unarchive' : 'Archive'}><Archive size={14} /></button>
                          <button onClick={(e) => deleteRecipe(r.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '8px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table View */}
              {recipeView === 'table' && (
                <div className="table-wrapper" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Recipe</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Size</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Container</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Notes</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Can Make</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRecipes.map(r => {
                        const canMakeInfo = whatCanIMake.find(w => w.recipe.name === r.name);
                        return (
                          <tr key={r.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 600 }}>{r.name}</div>
                              <div style={{ fontSize: '12px', color: '#feca57' }}>{r.vibe}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: '14px' }}>{r.size}oz</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>{r.container}</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px' }}>{r.components.length} fragrances</td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              {canMakeInfo && (
                                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, background: canMakeInfo.maxQty >= 12 ? 'rgba(85,239,196,0.2)' : canMakeInfo.maxQty > 0 ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)', color: canMakeInfo.maxQty >= 12 ? '#55efc4' : canMakeInfo.maxQty > 0 ? '#feca57' : '#ff6b6b' }}>
                                  {canMakeInfo.maxQty}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button onClick={() => openEditRecipe(r)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                <button onClick={(e) => deleteRecipe(r.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                <button onClick={(e) => copyRecipe(r, e)} style={{ background: 'rgba(116,185,255,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#74b9ff', cursor: 'pointer' }} title="Copy Recipe"><Copy size={14} /></button>
                                <button onClick={(e) => archiveRecipe(r.id, e)} style={{ background: r.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: r.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={r.archived ? 'Unarchive' : 'Archive'}><Archive size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          {activeTab === 'pricing' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing Engine</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Set your pricing tiers and analyze margins</p>
                </div>
              </div>

              {/* Recipe Selector - Prominent Card */}
              <div style={{ background: 'linear-gradient(135deg, rgba(254,202,87,0.15) 0%, rgba(255,107,107,0.1) 100%)', border: '2px solid rgba(254,202,87,0.4)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '0 0 auto' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Recipe</label>
                    <select 
                      value={pricingRecipe} 
                      onChange={e => setPricingRecipe(e.target.value)} 
                      style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(254,202,87,0.5)', borderRadius: '10px', color: '#fce4d6', fontSize: '16px', fontWeight: 600, minWidth: '280px', cursor: 'pointer' }}
                    >
                      {recipes.map(r => (
                        <option key={r.id} value={r.name}>{r.name} ({r.size}oz)</option>
                      ))}
                    </select>
                  </div>
                  
                  {pricingRecipeData && (
                    <>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '13px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Recipe Details</div>
                        <div style={{ fontSize: '15px', color: '#feca57', marginBottom: '2px' }}>{pricingRecipeData.vibe}</div>
                        <div style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>{pricingRecipeData.container} • {pricingRecipeData.foLoad}% FO Load</div>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '0 20px', borderLeft: '1px solid rgba(254,202,87,0.3)' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>COST PER CANDLE</div>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#feca57' }}>{formatCurrency(pricingCalc.totalCostPerCandle)}</div>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '0 20px', borderLeft: '1px solid rgba(254,202,87,0.3)' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>TARGET PRICE (65%)</div>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#55efc4' }}>{formatCurrency(pricingCalc.totalCostPerCandle / 0.35)}</div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Fragrance breakdown */}
                {pricingRecipeData && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(254,202,87,0.2)' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '8px' }}>FRAGRANCE BLEND</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {pricingRecipeData.components.map((c, i) => (
                        <span key={i} style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', fontSize: '12px' }}>
                          {c.fragrance} <span style={{ color: '#ff9ff3', fontWeight: 600 }}>{c.percent}%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', background: 'rgba(255,159,107,0.1)', borderBottom: '1px solid rgba(255,159,107,0.15)' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pricing Tiers</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: 'rgba(0,0,0,0.2)' }}>{['Tier', 'Qty', 'Price', 'Profit', 'Margin'].map(h => (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.5)' }}>{h}</th>))}</tr></thead>
                      <tbody>
                        {pricingTiers.map((t, i) => {
                          const profit = t.price - pricingCalc.totalCostPerCandle;
                          const margin = profit / t.price;
                          return (
                            <tr key={i} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 500 }}>{t.tier}</td>
                              <td style={{ padding: '14px 16px', color: 'rgba(252,228,214,0.6)' }}>{t.qtyRange}</td>
                              <td style={{ padding: '14px 16px' }}><input type="number" step="0.01" value={t.price} onChange={e => { const updated = [...pricingTiers]; updated[i].price = parseFloat(e.target.value) || 0; setPricingTiers(updated); }} style={{ width: '80px', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '6px', color: '#fce4d6', fontSize: '14px' }} /></td>
                              <td style={{ padding: '14px 16px', fontWeight: 600, color: profit > 0 ? '#55efc4' : '#ff6b6b' }}>{formatCurrency(profit)}</td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: margin > 0.5 ? 'rgba(85,239,196,0.2)' : margin > 0.3 ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)', color: margin > 0.5 ? '#55efc4' : margin > 0.3 ? '#feca57' : '#ff6b6b' }}>
                                  {formatPercent(margin)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div style={{ background: 'linear-gradient(135deg, rgba(85,239,196,0.15) 0%, rgba(85,239,196,0.05) 100%)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#55efc4' }}>Target Pricing Guide</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px', textTransform: 'uppercase' }}>65% Margin</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#55efc4' }}>{formatCurrency(pricingCalc.totalCostPerCandle / 0.35)}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px', textTransform: 'uppercase' }}>50% Margin</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#feca57' }}>{formatCurrency(pricingCalc.totalCostPerCandle / 0.5)}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px', textTransform: 'uppercase' }}>35% Margin</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff9f6b' }}>{formatCurrency(pricingCalc.totalCostPerCandle / 0.65)}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px', textTransform: 'uppercase' }}>Min Viable (10%)</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff6b6b' }}>{formatCurrency(pricingCalc.totalCostPerCandle / 0.9)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Break-Even Analysis</h3>
                    <div style={{ fontSize: '14px', color: 'rgba(252,228,214,0.7)', marginBottom: '12px' }}>
                      Assuming $200/month fixed costs (supplies, marketing, etc.)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,159,107,0.1)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>AT RETAIL</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#feca57' }}>{Math.ceil(200 / (pricingTiers[0]?.price - pricingCalc.totalCostPerCandle || 1))} candles</div>
                      </div>
                      <div style={{ background: 'rgba(255,159,107,0.1)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>AT WHOLESALE</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#74b9ff' }}>{Math.ceil(200 / (pricingTiers[2]?.price - pricingCalc.totalCostPerCandle || 1))} candles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shopping List */}
          {activeTab === 'shopping' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shopping List</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>{batchList.length > 0 ? `${batchList.length} batch${batchList.length > 1 ? 'es' : ''} • ${shoppingList.totals.totalCandles} total candles` : 'Add batches from Batch Builder to generate shopping list'}</p>
                </div>
                {batchList.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={clearShoppingList} style={{ ...btnSecondary, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><Trash2 size={18} /> Clear List</button>
                    <button onClick={exportShoppingList} style={btnPrimary}><Download size={18} /> Export</button>
                  </div>
                )}
              </div>

              {batchList.length === 0 ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                  <ShoppingCart size={48} color="rgba(252,228,214,0.3)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No batches planned yet</h3>
                  <p style={{ color: 'rgba(252,228,214,0.6)', marginBottom: '24px' }}>Go to Batch Builder to add recipes to your shopping list</p>
                  <button onClick={() => setActiveTab('calculator')} style={btnPrimary}><Calculator size={18} /> Go to Batch Builder</button>
                </div>
              ) : (
                <>
                  {/* By Recipe */}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '16px' }}>By Recipe</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    {shoppingList.byRecipe.map((r, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px', fontWeight: 600 }}>{r.recipe}</h4>
                            <span style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>{r.container} • {r.quantity} candles</span>
                          </div>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: '#feca57' }}>{formatCurrency(r.cost)}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Wax</div>
                            <div>{r.waxOz.toFixed(1)} oz ({(r.waxOz / 16).toFixed(2)} lbs)</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Fragrance</div>
                            <div>{r.foOz.toFixed(2)} oz</div>
                          </div>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Fragrance Breakdown</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {Object.entries(r.fragrances).map(([name, data]) => (
                              <span key={name} style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '12px' }}>
                                {name}: <span style={{ color: '#feca57', fontWeight: 600 }}>{data.oz.toFixed(2)} oz</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Category Totals */}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '16px' }}>Totals by Category</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {/* Wax */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: categoryColors.Wax.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color={categoryColors.Wax.text} />
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Wax</h4>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{shoppingList.totals.wax.lbs.toFixed(2)} lbs</div>
                      <div style={{ color: 'rgba(252,228,214,0.6)', fontSize: '13px' }}>{shoppingList.totals.wax.oz.toFixed(1)} oz total</div>
                      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,159,107,0.1)', borderRadius: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'rgba(252,228,214,0.6)' }}>Packages needed (10lb):</span> <span style={{ fontWeight: 600, color: '#feca57' }}>{Math.ceil(shoppingList.totals.wax.lbs / 10)}</span>
                      </div>
                    </div>

                    {/* Fragrances */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: categoryColors.Fragrance.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Droplets size={20} color={categoryColors.Fragrance.text} />
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Fragrances</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                        {Object.entries(shoppingList.totals.fragrances).sort((a, b) => b[1].oz - a[1].oz).map(([name, data]) => (
                          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,159,107,0.05)', borderRadius: '6px' }}>
                            <span style={{ fontSize: '13px' }}>{name} <span style={{ fontSize: '11px', color: data.type === 'EO' ? '#55efc4' : '#feca57' }}>({data.type})</span></span>
                            <span style={{ fontWeight: 600, color: '#feca57' }}>{data.oz.toFixed(2)} oz</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Containers */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: categoryColors.Container.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Box size={20} color={categoryColors.Container.text} />
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Containers</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(shoppingList.totals.containers).map(([name, qty]) => (
                          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,159,107,0.05)', borderRadius: '6px' }}>
                            <span style={{ fontSize: '13px' }}>{name}</span>
                            <span style={{ fontWeight: 600, color: '#74b9ff' }}>{qty} units</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Other Materials */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,159,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="#ff9f6b" />
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Other Materials</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,159,107,0.05)', borderRadius: '6px' }}><span>Wicks</span><span style={{ fontWeight: 600, color: '#ff9ff3' }}>{shoppingList.totals.wicks} units</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,159,107,0.05)', borderRadius: '6px' }}><span>Labels</span><span style={{ fontWeight: 600, color: '#55efc4' }}>{shoppingList.totals.labels} units</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,159,107,0.05)', borderRadius: '6px' }}><span>Gift Boxes</span><span style={{ fontWeight: 600, color: '#ff6b6b' }}>{shoppingList.totals.packaging} units</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Export Bar */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(254,202,87,0.1) 50%, rgba(255,159,243,0.15) 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: 'rgba(252,228,214,0.6)', marginBottom: '4px' }}>Total Candles to Make</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{shoppingList.totals.totalCandles} candles</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={clearShoppingList} style={{ ...btnSecondary, padding: '16px 24px', fontSize: '16px', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><Trash2 size={20} /> Clear List</button>
                      <button onClick={exportShoppingList} style={{ ...btnPrimary, padding: '16px 32px', fontSize: '16px' }}><Download size={20} /> Export</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Batch History */}
          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Batch History</h2>
                  <p style={{ color: 'rgba(252,228,214,0.6)' }}>Track your production, cure times, and test results</p>
                </div>
                <button onClick={openLogBatchModal} style={btnPrimary}><Plus size={18} /> Log New Batch</button>
              </div>

              {batchHistory.length === 0 ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                  <History size={48} color="rgba(252,228,214,0.3)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No batch history yet</h3>
                  <p style={{ color: 'rgba(252,228,214,0.6)', marginBottom: '24px' }}>Log your completed batches to track production and test results</p>
                  <button onClick={() => setActiveTab('calculator')} style={btnPrimary}><Calculator size={18} /> Go to Batch Builder</button>
                </div>
              ) : (
                <>
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: 'rgba(255,159,107,0.1)' }}>{['Batch', 'Date', 'Recipe', 'Qty', 'Size', 'Cost', 'Cure End', 'Hot', 'Cold', 'Status', 'Notes'].map(h => (<th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>))}</tr></thead>
                      <tbody>
                        {batchHistory.map(b => (
                          <tr key={b.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                            <td style={{ padding: '14px 12px', fontFamily: 'monospace', fontSize: '12px' }}>{b.id}</td>
                            <td style={{ padding: '14px 12px', color: 'rgba(252,228,214,0.7)' }}>{b.date}</td>
                            <td style={{ padding: '14px 12px', fontWeight: 500 }}>{b.recipe}</td>
                            <td style={{ padding: '14px 12px' }}>{b.qty}</td>
                            <td style={{ padding: '14px 12px' }}>{b.size} oz</td>
                            <td style={{ padding: '14px 12px' }}>{formatCurrency(b.cost)}</td>
                            <td style={{ padding: '14px 12px', color: 'rgba(252,228,214,0.6)' }}>{b.cureEnd}</td>
                            <td style={{ padding: '14px 12px', color: b.hotThrow >= 8 ? '#55efc4' : b.hotThrow ? '#feca57' : 'rgba(252,228,214,0.3)' }}>{b.hotThrow || '-'}</td>
                            <td style={{ padding: '14px 12px', color: b.coldThrow >= 8 ? '#55efc4' : b.coldThrow ? '#feca57' : 'rgba(252,228,214,0.3)' }}>{b.coldThrow || '-'}</td>
                            <td style={{ padding: '14px 12px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: b.status === 'Ready' ? 'rgba(85,239,196,0.2)' : 'rgba(254,202,87,0.2)', color: b.status === 'Ready' ? '#55efc4' : '#feca57' }}>{b.status}</span></td>
                            <td style={{ padding: '14px 12px', color: 'rgba(252,228,214,0.6)', fontSize: '13px' }}>{b.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
                    {[{ label: 'Total Batches', value: stats.totalBatches }, { label: 'Total Candles', value: stats.totalCandles }, { label: 'Total Investment', value: formatCurrency(stats.totalInvestment) }, { label: 'Avg Hot Throw', value: stats.avgHotThrow ? stats.avgHotThrow.toFixed(1) : '-' }].map((stat, i) => (
                      <div key={i} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{stat.value}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Material Modal */}
      {showMaterialModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{editingMaterial ? 'Edit Material' : 'Add Material'}</h2>
              <button onClick={() => setShowMaterialModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>ID *</label>
                  <input type="text" value={materialForm.id} onChange={e => setMaterialForm({ ...materialForm, id: e.target.value.toUpperCase() })} placeholder="e.g., W-001" style={inputStyle} />
                  <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>W=Wax, C=Container, K=Wick, L=Label, P=Packaging, U=Unit</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Category *</label>
                  <select value={materialForm.category} onChange={e => handleMaterialCategoryChange(e.target.value)} style={inputStyle}>
                    {['Wax', 'Container', 'Wick', 'Label', 'Packaging', 'Unit'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Name *</label>
                <input type="text" value={materialForm.name} onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })} placeholder="e.g., Golden Brands 464 Soy Wax" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Vendor</label>
                <input type="text" value={materialForm.vendor} onChange={e => setMaterialForm({ ...materialForm, vendor: e.target.value })} placeholder="e.g., CandleScience" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Unit</label>
                  <select value={materialForm.unit} onChange={e => setMaterialForm({ ...materialForm, unit: e.target.value })} style={inputStyle}>
                    {['unit', 'each', 'jar', 'tin', 'lb', 'oz', 'case', 'pack', 'roll', 'bottle'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Package Size</label>
                  <input type="number" value={materialForm.packageSize} onChange={e => setMaterialForm({ ...materialForm, packageSize: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                  <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>Items per package</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Package Cost</label>
                  <input type="number" step="0.01" value={materialForm.packageCost} onChange={e => setMaterialForm({ ...materialForm, packageCost: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                  <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>Total cost of package</span>
                </div>
              </div>
              
              {/* Inventory Section */}
              <div style={{ borderTop: '1px solid rgba(255,159,107,0.2)', paddingTop: '16px', marginTop: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#feca57', marginBottom: '12px' }}>Inventory Tracking</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Quantity on Hand</label>
                    <input type="number" value={materialForm.qtyOnHand} onChange={e => setMaterialForm({ ...materialForm, qtyOnHand: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Reorder Point</label>
                    <input type="number" value={materialForm.reorderPoint} onChange={e => setMaterialForm({ ...materialForm, reorderPoint: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>Alert when stock falls to this level</span>
                  </div>
                </div>
              </div>

              {/* Cost Preview */}
              {materialForm.packageSize > 0 && materialForm.packageCost > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>Cost per {materialForm.unit}:</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#feca57' }}>{formatCurrency(materialForm.packageCost / materialForm.packageSize)}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)' }}>
                    {formatCurrency(materialForm.packageCost)} ÷ {materialForm.packageSize} {materialForm.unit}s = {formatCurrency(materialForm.packageCost / materialForm.packageSize)} per {materialForm.unit}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setShowMaterialModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button onClick={saveMaterial} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Save size={18} /> {editingMaterial ? 'Save Changes' : 'Add Material'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fragrance Modal */}
      {showFragranceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{editingFragrance ? 'Edit Fragrance' : 'Add Fragrance'}</h2>
              <button onClick={() => setShowFragranceModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Name *</label>
                <input type="text" value={fragranceForm.name} onChange={e => setFragranceForm({ ...fragranceForm, name: e.target.value })} placeholder="e.g., Ocean Breeze" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Type</label>
                  <select value={fragranceForm.type} onChange={e => setFragranceForm({ ...fragranceForm, type: e.target.value })} style={inputStyle}>
                    <option value="FO">Fragrance Oil (FO)</option>
                    <option value="EO">Essential Oil (EO)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Vendor</label>
                  <input type="text" value={fragranceForm.vendor} onChange={e => setFragranceForm({ ...fragranceForm, vendor: e.target.value })} placeholder="e.g., CandleScience" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Flash Point (°F)</label>
                  <input type="number" value={fragranceForm.flashPoint} onChange={e => setFragranceForm({ ...fragranceForm, flashPoint: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Max Load %</label>
                  <input type="number" value={fragranceForm.maxLoad} onChange={e => setFragranceForm({ ...fragranceForm, maxLoad: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '8px' }}>Inventory by Size</label>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 60px', gap: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>
                    <span>Size</span><span>Qty</span><span>Cost</span><span>$/oz</span>
                  </div>
                  {[0.5, 1, 4, 8, 16].map(size => (
                    <div key={size} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 60px', gap: '8px', padding: '6px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#fce4d6' }}>{size} oz</span>
                      <input type="number" min="0" value={fragranceForm.quantities?.[size] || 0} onChange={e => setFragranceForm({ ...fragranceForm, quantities: { ...fragranceForm.quantities, [size]: parseInt(e.target.value) || 0 } })} style={{ ...inputStyle, padding: '4px 6px', fontSize: '12px' }} placeholder="0" />
                      <input type="number" step="0.01" min="0" value={fragranceForm.prices?.[size] || ''} onChange={e => setFragranceForm({ ...fragranceForm, prices: { ...fragranceForm.prices, [size]: parseFloat(e.target.value) || 0 } })} style={{ ...inputStyle, padding: '4px 6px', fontSize: '12px' }} placeholder="$0.00" />
                      <span style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>{fragranceForm.prices?.[size] > 0 ? `$${(fragranceForm.prices[size] / size).toFixed(2)}` : '-'}</span>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 60px', gap: '8px', padding: '8px 12px', borderTop: '1px solid rgba(255,159,107,0.3)', background: 'rgba(255,159,107,0.1)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#feca57' }}>Total</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#55efc4' }}>{Object.entries(fragranceForm.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0).toFixed(1)} oz</span>
                    <span></span><span></span>
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Reorder Point (total oz)</label>
                <input type="number" step="0.5" value={fragranceForm.reorderPoint} onChange={e => setFragranceForm({ ...fragranceForm, reorderPoint: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setShowFragranceModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button onClick={saveFragrance} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Save size={18} /> {editingFragrance ? 'Save Changes' : 'Add Fragrance'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Batch Modal */}
      {showLogBatchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Log Completed Batch</h2>
              <button onClick={() => setShowLogBatchModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Recipe *</label>
                <select value={logBatchForm.recipe} onChange={e => { const r = recipes.find(rec => rec.name === e.target.value); if (r) setLogBatchForm({ ...logBatchForm, recipe: r.name, size: r.size }); }} style={inputStyle}>
                  <option value="">Select a recipe...</option>
                  {recipes.map(r => <option key={r.id} value={r.name}>{r.name} ({r.size}oz)</option>)}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Quantity Made</label>
                  <input type="number" value={logBatchForm.quantity} onChange={e => setLogBatchForm({ ...logBatchForm, quantity: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Candle Size (oz)</label>
                  <input type="number" value={logBatchForm.size} onChange={e => setLogBatchForm({ ...logBatchForm, size: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Notes</label>
                <textarea value={logBatchForm.notes} onChange={e => setLogBatchForm({ ...logBatchForm, notes: e.target.value })} rows={2} placeholder="Any notes about this batch..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              
              {/* Auto-deduct toggle */}
              <div style={{ background: 'rgba(85,239,196,0.1)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '10px', padding: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={logBatchForm.autoDeduct} onChange={e => setLogBatchForm({ ...logBatchForm, autoDeduct: e.target.checked })} style={{ width: '20px', height: '20px', accentColor: '#55efc4' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#55efc4' }}>Auto-deduct from inventory</div>
                    <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>Automatically subtract materials used from your stock levels</div>
                  </div>
                </label>
              </div>
              
              {/* Preview what will be deducted */}
              {logBatchForm.autoDeduct && logBatchForm.recipe && (
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>Will be deducted:</div>
                  {(() => {
                    const recipe = recipes.find(r => r.name === logBatchForm.recipe);
                    if (!recipe) return null;
                    const needs = calculateRecipeMaterials(recipe, logBatchForm.quantity);
                    return (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ padding: '4px 8px', background: 'rgba(254,202,87,0.2)', borderRadius: '4px', fontSize: '11px' }}>Wax: {(needs.wax / 16).toFixed(2)} lbs</span>
                        <span style={{ padding: '4px 8px', background: 'rgba(116,185,255,0.2)', borderRadius: '4px', fontSize: '11px' }}>Containers: {needs.containers}</span>
                        <span style={{ padding: '4px 8px', background: 'rgba(255,159,243,0.2)', borderRadius: '4px', fontSize: '11px' }}>Wicks: {needs.wicks}</span>
                        {needs.fragranceBreakdown.map((f, i) => (
                          <span key={i} style={{ padding: '4px 8px', background: 'rgba(162,155,254,0.2)', borderRadius: '4px', fontSize: '11px' }}>{f.name}: {f.oz.toFixed(2)} oz</span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setShowLogBatchModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button onClick={logNewBatch} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Save size={18} /> Log Batch</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{editingRecipe ? 'Edit Recipe' : 'Create Recipe'}</h2>
              <button onClick={() => setShowRecipeModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Recipe Name *</label><input type="text" value={recipeForm.name} onChange={e => setRecipeForm({ ...recipeForm, name: e.target.value })} placeholder="e.g., Sunset Dreams" style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Vibe/Theme</label><input type="text" value={recipeForm.vibe} onChange={e => setRecipeForm({ ...recipeForm, vibe: e.target.value })} placeholder="e.g., Tropical • Warm" style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Style</label><input type="text" value={recipeForm.style} onChange={e => setRecipeForm({ ...recipeForm, style: e.target.value })} placeholder="e.g., Beach house luxury" style={inputStyle} /></div>
              </div>
              <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Description</label><textarea value={recipeForm.description} onChange={e => setRecipeForm({ ...recipeForm, description: e.target.value })} rows={2} placeholder="Describe the scent profile..." style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Container</label><select value={recipeForm.container} onChange={e => setRecipeForm({ ...recipeForm, container: e.target.value })} style={inputStyle}><option value="9oz Straight Side Jar">9oz Straight Side Jar</option><option value="6oz Tin">6oz Tin</option><option value="4oz Small Tin">4oz Small Tin</option></select></div>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Size (oz)</label><input type="number" value={recipeForm.size} onChange={e => setRecipeForm({ ...recipeForm, size: parseFloat(e.target.value) || 0 })} style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>FO Load %</label><input type="number" value={recipeForm.foLoad} onChange={e => setRecipeForm({ ...recipeForm, foLoad: parseFloat(e.target.value) || 0 })} style={inputStyle} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#feca57' }}>Fragrance Components (must total 100%)</label>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0) === 100 ? '#55efc4' : '#ff6b6b' }}>Total: {recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0)}%</span>
                </div>
                {recipeForm.components.map((comp, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 40px', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    <select value={comp.fragrance} onChange={e => updateComponent(idx, 'fragrance', e.target.value)} style={inputStyle}><option value="">Select fragrance...</option>{fragrances.map(f => <option key={f.id} value={f.name}>{f.name} ({f.type})</option>)}</select>
                    <select value={comp.type} onChange={e => updateComponent(idx, 'type', e.target.value)} style={inputStyle}><option value="FO">FO</option><option value="EO">EO</option></select>
                    <input type="number" value={comp.percent} onChange={e => updateComponent(idx, 'percent', e.target.value)} placeholder="%" style={{ ...inputStyle, textAlign: 'center' }} />
                    <button onClick={() => removeComponent(idx)} disabled={recipeForm.components.length <= 1} style={{ padding: '10px', background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '8px', color: '#ff6b6b', cursor: recipeForm.components.length <= 1 ? 'not-allowed' : 'pointer', opacity: recipeForm.components.length <= 1 ? 0.5 : 1 }}><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={addComponent} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,159,107,0.15)', border: '1px dashed rgba(255,159,107,0.3)', borderRadius: '8px', color: '#feca57', cursor: 'pointer', fontSize: '13px', width: '100%', justifyContent: 'center' }}><Plus size={16} /> Add Component</button>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setShowRecipeModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button onClick={saveRecipe} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Save size={18} /> {editingRecipe ? 'Save Changes' : 'Create Recipe'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Shopping List Modal */}
      {showExportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #2d1b3d 0%, #1a0a1e 100%)', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'hidden', border: '1px solid rgba(255,159,107,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,159,107,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>Shopping List Export</h2>
              <button onClick={() => setShowExportModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 160px)' }}>
              <textarea
                readOnly
                value={exportText}
                style={{ width: '100%', height: '400px', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '10px', color: '#fce4d6', fontSize: '13px', fontFamily: 'monospace', resize: 'none' }}
              />
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,159,107,0.2)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowExportModal(false)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Close</button>
              <button onClick={copyExportText} style={{ ...btnPrimary, padding: '12px 24px' }}><Copy size={18} /> Copy to Clipboard</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Shopping List Confirm Modal */}
      {showClearConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #2d1b3d 0%, #1a0a1e 100%)', borderRadius: '20px', width: '100%', maxWidth: '400px', overflow: 'hidden', border: '1px solid rgba(255,107,107,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,107,107,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#ff6b6b' }}>Clear Shopping List?</h2>
              <button onClick={() => setShowClearConfirm(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ color: 'rgba(252,228,214,0.8)', marginBottom: '8px' }}>Are you sure you want to clear the entire shopping list?</p>
              <p style={{ color: 'rgba(252,228,214,0.5)', fontSize: '13px' }}>This will remove all {batchList.length} planned batch{batchList.length !== 1 ? 'es' : ''}.</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,107,107,0.2)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowClearConfirm(false)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={confirmClearShoppingList} style={{ padding: '12px 24px', background: 'rgba(255,107,107,0.3)', border: '1px solid rgba(255,107,107,0.5)', borderRadius: '10px', color: '#ff6b6b', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}><Trash2 size={16} /> Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setShowGeneralChat(!showGeneralChat)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(162,155,254,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900,
          transition: 'transform 0.2s ease'
        }}
        title="AI Assistant"
      >
        <MessageSquare size={28} color="#1a0a1e" />
      </button>

      {/* General AI Chat Panel */}
      {showGeneralChat && (
        <div style={{
          position: 'fixed',
          left: chatPosition.x ?? 'auto',
          top: chatPosition.y ?? 'auto',
          right: chatPosition.x === null ? '24px' : 'auto',
          bottom: chatPosition.y === null ? '100px' : 'auto',
          width: window.innerWidth < 500 ? 'calc(100% - 32px)' : `${chatSize.width}px`,
          height: `${chatSize.height}px`,
          background: 'linear-gradient(180deg, #2d1b3d 0%, #1a0a1e 100%)', borderRadius: '20px',
          border: '1px solid rgba(162,155,254,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', zIndex: 901, overflow: 'hidden',
          userSelect: isDragging || isResizing ? 'none' : 'auto'
        }}>
          {/* Header - Draggable */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(162,155,254,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'move', touchAction: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="#1a0a1e" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>AI Assistant</h3>
                <p style={{ fontSize: '11px', color: geminiApiKey ? '#55efc4' : 'rgba(252,228,214,0.5)' }}>
                  {geminiApiKey ? 'Gemini Connected' : 'API Key Required'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowApiKeyInput(!showApiKeyInput)} style={{ background: geminiApiKey ? 'rgba(85,239,196,0.2)' : 'rgba(255,159,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: geminiApiKey ? '#55efc4' : '#ff9f6b', cursor: 'pointer' }} title="API Key Settings"><Key size={16} /></button>
              <button onClick={() => setShowGeneralChat(false)} style={{ background: 'none', border: 'none', color: 'rgba(252,228,214,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(162,155,254,0.2)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(252,228,214,0.7)', marginBottom: '8px' }}>
                Enter your FREE Google Gemini API key (<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#a29bfe' }}>get one here</a>)
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIza..."
                  style={{
                    flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(162,155,254,0.3)',
                    borderRadius: '8px', color: '#fce4d6', fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={() => saveApiKey(geminiApiKey)}
                  style={{
                    padding: '8px 16px', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
                    border: 'none', borderRadius: '8px', color: '#1a0a1e', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(252,228,214,0.4)' }}>
                <Key size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                  {geminiApiKey ? "Hi! I'm your candle business assistant." : "Click the key icon above to add your FREE API key"}
                </p>
                <p style={{ fontSize: '12px' }}>
                  {geminiApiKey ? "Ask me about inventory, recipes, or suggestions!" : "Powered by Google Gemini - 100% free!"}
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '10px 14px', borderRadius: '12px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)' : 'rgba(255,255,255,0.08)',
                color: msg.role === 'user' ? '#1a0a1e' : '#fce4d6',
                fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            ))}
            {chatLoading && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a29bfe', animation: 'pulse 1s ease-in-out infinite' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a29bfe', animation: 'pulse 1s ease-in-out infinite', animationDelay: '0.2s' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a29bfe', animation: 'pulse 1s ease-in-out infinite', animationDelay: '0.4s' }} />
                </div>
                <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }} style={{ padding: '12px 16px', borderTop: '1px solid rgba(162,155,254,0.2)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about inventory, recipes..."
              style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(162,155,254,0.2)',
                borderRadius: '10px', color: '#fce4d6', fontSize: '13px', outline: 'none'
              }}
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              style={{
                padding: '10px 14px', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
                border: 'none', borderRadius: '10px', cursor: chatLoading ? 'not-allowed' : 'pointer',
                opacity: chatLoading || !chatInput.trim() ? 0.5 : 1
              }}
            >
              <Send size={18} color="#1a0a1e" />
            </button>
          </form>

          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            style={{
              position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px',
              cursor: 'se-resize', touchAction: 'none',
              background: 'linear-gradient(135deg, transparent 50%, rgba(162,155,254,0.4) 50%)',
              borderRadius: '0 0 20px 0'
            }}
          />
        </div>
      )}
    </div>
  );
}
