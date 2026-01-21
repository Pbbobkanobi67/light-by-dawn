import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Flame, Package, Droplets, BookOpen, Calculator, DollarSign, ShoppingCart, History, LayoutDashboard, Plus, Trash2, Edit2, Save, X, ChevronRight, TrendingUp, Box, RotateCcw, Download, FileText, Grid, List, Table, Sparkles, Check, MessageSquare, AlertTriangle, Filter, Minus, CheckCircle, XCircle, Zap, ClipboardList, Copy, Menu, Archive, ExternalLink, Send, Settings, Key, Printer, ScrollText, Scale, Move, Store, RefreshCw, Info, Link } from 'lucide-react';
import { supabase } from './supabaseClient';

// Initial data matching your Excel
const initialMaterials = [
  { id: 'W-001', category: 'Wax', name: 'Golden Brands 464 Soy Wax', vendor: 'CandleScience', unit: 'lb', packageSize: 10, packageCost: 32.95, qtyOnHand: 45, reorderPoint: 20 },
  { id: 'W-002', category: 'Wax', name: 'Coconut Soy Blend', vendor: 'Aztec', unit: 'lb', packageSize: 5, packageCost: 18.99, qtyOnHand: 15, reorderPoint: 10 },
  { id: 'C-001', category: 'Container', name: '9oz Straight Side Jar', vendor: 'Fillmore', unit: 'case', packageSize: 12, packageCost: 24.00, qtyOnHand: 120, reorderPoint: 48, fillCapacity: 8.2 },
  { id: 'C-002', category: 'Container', name: '6oz Tin', vendor: 'CandleScience', unit: 'case', packageSize: 24, packageCost: 36.00, qtyOnHand: 96, reorderPoint: 48, fillCapacity: 5.5 },
  { id: 'C-003', category: 'Container', name: '4oz Small Tin', vendor: 'Amazon', unit: 'case', packageSize: 24, packageCost: 28.00, qtyOnHand: 144, reorderPoint: 72, fillCapacity: 3.5 },
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
  { id: 'RCP-001', name: 'Coastal Luxe', vibe: 'Tropical • Clean • Airy', style: 'Fresh, upscale beach house', description: 'A luxury coastal fragrance blending airy ocean breeze with soft tropical fruit, bright lime, and delicate jasmine.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Ocean Breeze', type: 'FO', percent: 55 }, { fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 25 }, { fragrance: 'Lime', type: 'EO', percent: 10 }, { fragrance: 'Petitgrain', type: 'EO', percent: 5 }, { fragrance: 'Jasmine', type: 'EO', percent: 5 }] },
  { id: 'RCP-002', name: 'Sunset Colada', vibe: 'Tropical • Fruity • Smooth', style: 'Vacation sunset cocktail', description: 'Bright and sunny tropical fruit softened with creamy vanilla and citrus.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 60 }, { fragrance: 'Vanilla', type: 'EO', percent: 15 }, { fragrance: 'Lime', type: 'EO', percent: 15 }, { fragrance: 'Orange', type: 'EO', percent: 10 }] },
  { id: 'RCP-003', name: 'Harvest Cabin', vibe: 'Warm • Spiced • Comforting', style: 'Cozy fall evening', description: 'A welcoming fall scent with warm apple cinnamon, smooth vanilla, gentle orange, and a cedarwood base.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Apple Cinnamon', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Frankincense', type: 'EO', percent: 5 }] },
  { id: 'RCP-004', name: 'Toes In The Sand', vibe: 'Fresh • Uplifting • Coastal', style: 'Tropical fruit meets coastal breeze', description: 'Tropical fruit meets a refreshing ocean breeze with hints of lime and gentle mint. Clean, bright, and beachy.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 55 }, { fragrance: 'Coconut Lime', type: 'FO', percent: 20 }, { fragrance: 'Eucalyptus Spearmint', type: 'EO', percent: 20 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 5 }] },
  { id: 'RCP-005', name: 'Alpine Holiday', vibe: 'Fresh • Festive • Cozy', style: 'Christmas tree + winter citrus', description: 'A refined Christmas scent combining fresh balsam pine with creamy vanilla and bright winter citrus.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Pine', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Bergamot', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Cedar', type: 'EO', percent: 5 }] },
  { id: 'RCP-006', name: 'Fireside Spice Latte', vibe: 'Cozy • Spiced • Sweet', style: 'Warm holiday café', description: 'Creamy pumpkin spice latte layered with caramel, vanilla, cedarwood, and a subtle hint of black pepper.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Pumpkin Spice Latte', type: 'FO', percent: 50 }, { fragrance: 'Caramel', type: 'FO', percent: 20 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 5 }, { fragrance: 'Black Pepper', type: 'FO', percent: 5 }] },
  { id: 'RCP-007', name: 'Forbidden Vanilla Kiss', vibe: 'Romantic • Seductive • Luxury', style: 'Signature sweet-floral gourmand', description: 'A sensual, sweet-floral indulgence where creamy vanilla swirls with lush blooms and soft citrus sparkle.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Sweet Taboo', type: 'FO', percent: 48 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 35 }, { fragrance: 'Jasmine', type: 'EO', percent: 10 }, { fragrance: 'Bergamot', type: 'EO', percent: 5 }, { fragrance: 'Rose', type: 'EO', percent: 2 }] },
  { id: 'RCP-008', name: 'Alpine Spa', vibe: 'Clean • Fresh • Cozy', style: 'Perfect winter spa scent', description: 'A clean, uplifting alpine blend that combines crisp evergreens with ocean freshness and soothing spa botanicals.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Mountain Meets Ocean', type: 'FO', percent: 40 }, { fragrance: 'Balsam Pine', type: 'EO', percent: 30 }, { fragrance: 'Eucalyptus', type: 'EO', percent: 10 }, { fragrance: 'Rosemary', type: 'EO', percent: 10 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 10 }] },
  { id: 'RCP-009', name: 'Island Bliss', vibe: 'Tropical • Smooth • Playful', style: 'Flirty tropical fruit', description: 'A bright blend of tropical fruit, creamy island sweetness, and soft warm notes that drift across sunlit shores.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 50 }, { fragrance: 'Butt Naked', type: 'FO', percent: 30 }, { fragrance: 'Sweetest Taboo', type: 'FO', percent: 20 }] },
  { id: 'RCP-010', name: 'Eucalyptus Spa', vibe: 'Clean • Cooling • Refreshing', style: 'Herbal aromatherapy', description: 'A refreshing blend of cool eucalyptus and crisp spearmint that opens the senses and calms the mind.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', foLoad: 10, archived: false, components: [{ fragrance: 'Eucalyptus Spearmint', type: 'FO', percent: 100 }] },
];

const initialBatchHistory = [];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'calculator', label: 'Batch Builder', icon: Calculator },
  { id: 'instructions', label: 'Instructions', icon: ScrollText },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'materials', label: 'Materials', icon: Package },
  { id: 'fragrances', label: 'Fragrances', icon: Droplets },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
  { id: 'history', label: 'Batch History', icon: History },
  { id: 'sales', label: 'Sales', icon: Store },
  { id: 'admin', label: 'Admin', icon: Settings },
];

const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
const formatPercent = (num) => `${(num * 100).toFixed(1)}%`;

// Unit conversion helpers for oz to ml/grams
const ozToMl = (oz) => (oz * 29.5735).toFixed(1);
const ozToGrams = (oz) => (oz * 28.3495).toFixed(1);

// Fragrance pricing helper functions
const calculateTotalOz = (quantities) => {
  if (!quantities) return 0;
  return Object.entries(quantities).reduce((sum, [size, qty]) => sum + (parseFloat(size) * (qty || 0)), 0);
};

const calculateWeightedPricePerOz = (prices, quantities) => {
  if (!prices || !quantities) return 0;
  let totalCost = 0;
  let totalOz = 0;
  Object.keys(quantities).forEach(size => {
    const qty = quantities[size] || 0;
    const price = prices[size] || 0;
    if (qty > 0 && price > 0) {
      totalCost += price * qty;
      totalOz += parseFloat(size) * qty;
    }
  });
  return totalOz > 0 ? totalCost / totalOz : 0;
};

const calculateTotalInvestment = (prices, quantities) => {
  if (!prices || !quantities) return 0;
  return Object.keys(quantities).reduce((sum, size) => {
    const qty = quantities[size] || 0;
    const price = prices[size] || 0;
    return sum + (price * qty);
  }, 0);
};

// Get fragrance price per oz with fallback chain: weighted avg → 16oz price → legacy → default
const getFragrancePricePerOz = (frag) => {
  if (!frag) return 1.97;

  // Try weighted average first
  const weightedAvg = calculateWeightedPricePerOz(frag.prices, frag.quantities);
  if (weightedAvg > 0) return weightedAvg;

  // Fallback to 16oz price if available
  if (frag.prices?.['16'] > 0) return frag.prices['16'] / 16;

  // Fallback to legacy packageCost/packageSize
  if (frag.packageCost && frag.packageSize) return frag.packageCost / frag.packageSize;

  // Default fallback
  return 1.97;
};

const categoryColors = {
  Wax: { bg: 'rgba(254,202,87,0.2)', text: '#feca57' },
  Container: { bg: 'rgba(116,185,255,0.2)', text: '#74b9ff' },
  Wick: { bg: 'rgba(255,159,243,0.2)', text: '#ff9ff3' },
  Label: { bg: 'rgba(85,239,196,0.2)', text: '#55efc4' },
  Packaging: { bg: 'rgba(255,107,107,0.2)', text: '#ff6b6b' },
  Unit: { bg: 'rgba(162,155,254,0.2)', text: '#a29bfe' },
  Fragrance: { bg: 'rgba(253,203,110,0.2)', text: '#fdcb6e' },
};

// ============ Fragrance Bottle Weight-Based Tracking Helpers ============
const GRAMS_PER_OZ = 28.3495;

// Calculate net oz remaining in a bottle based on weight
const calculateNetOzRemaining = (bottle) => {
  if (!bottle || bottle.currentWeightGrams === null || bottle.currentWeightGrams === undefined) return null;
  // Use tare weight if known, otherwise estimate tare as 10% of gross weight
  const tareWeight = bottle.tareWeightGrams ?? (bottle.grossWeightGrams ? bottle.grossWeightGrams * 0.1 : 0);
  const netGrams = Math.max(0, bottle.currentWeightGrams - tareWeight);
  return netGrams / GRAMS_PER_OZ;
};

// Calculate percentage of bottle remaining
const calculatePercentRemaining = (bottle) => {
  if (!bottle || !bottle.purchaseSizeOz) return null;
  const ozRemaining = calculateNetOzRemaining(bottle);
  if (ozRemaining === null) return null;
  return Math.min(100, Math.max(0, (ozRemaining / bottle.purchaseSizeOz) * 100));
};

// Get bottle status based on percentage remaining
const getBottleStatus = (bottle) => {
  const percent = calculatePercentRemaining(bottle);
  if (percent === null) return 'unknown';
  if (percent <= 0) return 'empty';
  if (percent < 20) return 'low';
  return 'active';
};

// Get total oz available for a specific fragrance name across all bottles
const getTotalOzForFragrance = (fragranceName, bottles) => {
  if (!bottles || !fragranceName) return 0;
  return bottles
    .filter(b => b.fragranceName === fragranceName && b.status !== 'empty' && b.status !== 'archived')
    .reduce((sum, b) => sum + (calculateNetOzRemaining(b) || 0), 0);
};

// Generate unique bottle ID
const generateBottleId = () => `FB-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

// Vendor link helper - renders vendor as clickable link if it's a URL
const VendorLink = ({ vendor, style = {} }) => {
  if (!vendor) return null;
  const isUrl = vendor.startsWith('http');
  const baseStyle = { color: '#a29bfe', textDecoration: 'none', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'bottom', ...style };

  if (isUrl) {
    // Extract domain name from URL
    const domain = vendor.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    return (
      <a
        href={vendor}
        target="_blank"
        rel="noopener noreferrer"
        style={baseStyle}
        onClick={(e) => e.stopPropagation()}
        title={vendor}
      >
        {domain}
      </a>
    );
  }

  // For known vendors, link to their website
  const vendorUrls = {
    'CandleScience': 'https://www.candlescience.com',
    'Amazon': 'https://www.amazon.com',
    'Lone Star': 'https://www.lonestarcandlesupply.com',
    'Plant Therapy': 'https://www.planttherapy.com',
    'Fillmore': 'https://www.fillmorecontainer.com',
    'Uline': 'https://www.uline.com',
    'Aztec': 'https://www.azteccandle.com',
  };

  const url = vendorUrls[vendor];
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={baseStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {vendor}
      </a>
    );
  }

  return <span style={{ color: 'rgba(252,228,214,0.7)', ...style }}>{vendor}</span>;
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

// Shorten long URLs (especially Amazon) using is.gd (no interstitial page)
const shortenUrl = async (url) => {
  // Only shorten if URL is long or is Amazon
  if (url.length < 80 && !url.includes('amazon.com')) return url;
  try {
    const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const shortUrl = await response.text();
      if (shortUrl.startsWith('http')) return shortUrl.trim();
    }
  } catch (error) {
    console.warn('URL shortening failed:', error);
  }
  return url; // Return original if shortening fails
};

export default function CandleBusinessApp() {
  const [activeTab, setActiveTab] = useState(() => loadFromStorage('activeTab', 'dashboard'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState(() => loadFromStorage('materials', initialMaterials));
  const [fragrances, setFragrances] = useState(() => loadFromStorage('fragrances', initialFragrances));
  const [recipes, setRecipes] = useState(() => {
    // Load recipes and migrate: remove container/size fields (now selected at batch time)
    const loaded = loadFromStorage('recipes', initialRecipes);
    return loaded.map(r => {
      const { container, size, ...rest } = r;
      return rest;
    });
  });
  const [batchHistory, setBatchHistory] = useState(() => loadFromStorage('batchHistory', initialBatchHistory));

  // App defaults/settings
  const defaultAppSettings = {
    // Batch Builder Defaults
    defaultCandleSize: 9,
    defaultQuantity: 12,
    defaultFoLoad: 10, // percentage
    defaultWax: '',
    defaultContainer: '',
    defaultWick: '',
    defaultLabel: '',
    defaultPackaging: '',
    // Pricing Defaults
    defaultOverheadPerCandle: 0.50,
    defaultLaborCostPerCandle: 1.00,
    defaultProfitMarginTarget: 50, // percentage
    // Recipe Defaults
    defaultRecipeFoLoad: 10, // percentage
    defaultDyeUnit: 'drops',
    // Display Preferences
    defaultRecipeView: 'grid',
    defaultFragranceView: 'grid',
    showArchivedByDefault: false,
    // Behavior Settings
    returnToFragrancesOnRecipeCancel: true,
    // Business Settings
    businessName: 'Light By Dawn',
    currencySymbol: '$',
    // Label pricing tiers
    smallLabelCost: 0.08, // 4oz and under
    mediumLabelCost: 0.10, // 5-6oz
    largeLabelCost: 0.12, // 7oz+
  };
  const [appDefaults, setAppDefaults] = useState(() => loadFromStorage('appDefaults', defaultAppSettings));

  // Multi-batch builder state
  const [batchList, setBatchList] = useState(() => loadFromStorage('batchList', []));
  const [currentBatch, setCurrentBatch] = useState({
    recipe: 'Toes In The Sand',
    quantity: 12,
    size: 4,
    foLoad: 0.10,
    wax: '',
    container: '',
    wick: '',
    label: '',
    packaging: '',
    fragranceOption: 'recipe', // 'recipe' = use recipe as-is, 'modify' = customize
    waxCostPerOz: 0,
    containerCost: 0,
    wickCost: 0,
    labelCost: 0,
    packagingCost: 0,
    avgFoCost: 0,
    retailPrice: 18.00,
  });

  // Modal states
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeModalPos, setRecipeModalPos] = useState({ x: null, y: null }); // null = centered
  const [recipeModalSize, setRecipeModalSize] = useState({ width: 700, height: null }); // null = auto height
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [isResizingModal, setIsResizingModal] = useState(false);
  const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showUrlImportModal, setShowUrlImportModal] = useState(false);
  const [urlImportInput, setUrlImportInput] = useState('');
  const [urlImportLoading, setUrlImportLoading] = useState(false);
  const [urlImportType, setUrlImportType] = useState('material'); // 'material' or 'fragrance'
  const [showFragranceModal, setShowFragranceModal] = useState(false);
  const [showBatchInstructionsModal, setShowBatchInstructionsModal] = useState(false);
  const [batchInstructions, setBatchInstructions] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingFragrance, setEditingFragrance] = useState(null);

  // Form states
  const [recipeForm, setRecipeForm] = useState({ name: '', vibe: '', style: '', description: '', wax: '', wick: '', foLoad: 10, archived: false, components: [{ fragrance: '', type: 'FO', percent: 100 }], dyes: [] });
  const [materialForm, setMaterialForm] = useState({ id: '', category: 'Wax', name: '', vendor: '', unit: 'unit', packageSize: 1, packageCost: 0, qtyOnHand: 0, reorderPoint: 0, fillCapacity: 0 });
  const [fragranceForm, setFragranceForm] = useState({ name: '', type: 'FO', vendor: '', packageSize: 16, packageCost: 0, prices: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, quantities: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, flashPoint: 200, maxLoad: 10, qtyOnHand: 0, reorderPoint: 0, archived: false });

  // ============ Fragrance Bottles & Batch Wizard State ============
  const [fragranceBottles, setFragranceBottles] = useState([]);
  const [showBatchWizard, setShowBatchWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    selectedBottles: [], // Array of bottle IDs selected for this batch
    recipe: null,
    quantity: 12,
    size: 9,
    container: '',
    wick: '',
    label: '',
    packaging: '',
    foLoad: 0.10,
    retailPrice: 24.00,
  });
  const [showAddBottleModal, setShowAddBottleModal] = useState(false);
  const [quickAddCount, setQuickAddCount] = useState(0); // Track bottles added in current session
  const [lastAddedBottles, setLastAddedBottles] = useState([]); // Recently added bottles for reference
  const [bottleForm, setBottleForm] = useState({
    fragranceId: '',
    fragranceName: '',
    vendor: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseSizeOz: 16,
    purchasePriceTotal: 0,
    grossWeightGrams: null,
    tareWeightGrams: null,
    currentWeightGrams: null,
    notes: '',
    isNewBottle: false, // false = existing/partial, true = new/full bottle
  });

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
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || 'AIzaSyBpTrANmbEIHtBWvrOuKI_V85PdyDSqI3U');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: null, y: null }); // null = default position
  const [chatSize, setChatSize] = useState({ width: 380, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Mobile AI chat state
  const [mobileAiChatOpen, setMobileAiChatOpen] = useState(false);
  const [mobileAiChatPos, setMobileAiChatPos] = useState({ x: 20, y: 100 });
  const [isMobileAiDragging, setIsMobileAiDragging] = useState(false);
  const mobileAiDragOffset = React.useRef({ x: 0, y: 0 });

  // Mobile FAB position state (draggable button)
  const [mobileAiFabPos, setMobileAiFabPos] = useState({ x: null, y: null }); // null = use default position
  const [isFabDragging, setIsFabDragging] = useState(false);
  const fabDragOffset = React.useRef({ x: 0, y: 0 });
  const fabDragMoved = React.useRef(false);

  const [fragranceSort, setFragranceSort] = useState('name'); // 'name', 'type', 'vendor', 'cost', 'stock'
  const [recipeSort, setRecipeSort] = useState('name'); // 'name', 'size', 'profit', 'canMake', 'components'
  const [recipeView, setRecipeView] = useState('grid'); // 'grid', 'list', 'table'
  const [showArchivedRecipes, setShowArchivedRecipes] = useState(false);
  const [pricingRecipe, setPricingRecipe] = useState(initialRecipes[0]?.name || ''); // Selected recipe for pricing engine

  // AI Profit Analysis state
  const [profitAnalysisLoading, setProfitAnalysisLoading] = useState(false);
  const [profitAnalysis, setProfitAnalysis] = useState(null);
  const [profitAnalysisTime, setProfitAnalysisTime] = useState(0);

  // Instructions page state
  const [savedInstructions, setSavedInstructions] = useState(() => loadFromStorage('savedInstructions', []));
  const [savedChats, setSavedChats] = useState(() => loadFromStorage('savedChats', []));
  const [instructionsAiLoading, setInstructionsAiLoading] = useState(false);
  const [instructionsAiPrompt, setInstructionsAiPrompt] = useState('');
  const [instructionsAiResponse, setInstructionsAiResponse] = useState(null);
  const [instructionsConversation, setInstructionsConversation] = useState([]); // Full conversation history
  const [currentChatId, setCurrentChatId] = useState(null); // Track which saved chat is loaded
  const [viewingInstruction, setViewingInstruction] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // { type: 'instruction'|'chat', id, title }
  const [converterValue, setConverterValue] = useState('');
  const [converterUnit, setConverterUnit] = useState('oz'); // 'oz', 'ml', 'g'
  const conversationEndRef = React.useRef(null); // For auto-scroll
  const [pendingAutoPrompt, setPendingAutoPrompt] = useState(null); // Auto-trigger AI when navigating from Batch Builder

  // Supabase sync state
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'

  // Track loaded data counts to prevent syncing empty data over real data
  // CRITICAL: These refs must be declared BEFORE the load useEffect
  const loadedCountsRef = React.useRef({ materials: 0, fragrances: 0, recipes: 0, batchHistory: 0, batchList: 0, savedInstructions: 0, savedChats: 0, fragranceBottles: 0 });
  const syncEnabledRef = React.useRef(false);

  

  // Load data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        setSyncStatus('syncing');

        const [materialsRes, fragrancesRes, recipesRes, batchHistoryRes, batchListRes, savedInstructionsRes, savedChatsRes, fragranceBottlesRes, settingsRes] = await Promise.all([
          supabase.from('materials').select('*'),
          supabase.from('fragrances').select('*'),
          supabase.from('recipes').select('*'),
          supabase.from('batch_history').select('*'),
          supabase.from('batch_list').select('*'),
          supabase.from('saved_instructions').select('*'),
          supabase.from('saved_chats').select('*'),
          supabase.from('fragrance_bottles').select('*'),
          supabase.from('settings').select('*').eq('id', 'app_settings').single(),
        ]);

        // Simple sync: Supabase is the source of truth
        const loadData = (supabaseData, localKey, setter, countKey) => {
          const supabaseCamel = toCamelCase(supabaseData || []);
          setter(supabaseCamel);
          loadedCountsRef.current[countKey] = supabaseCamel.length;
          console.log(`${localKey}: ${supabaseCamel.length} from Supabase`);
        };

        // Load core tables with smart sync
        if (materialsRes.data !== null) {
          loadData(materialsRes.data, 'materials', setMaterials, 'materials');
        }
        if (fragrancesRes.data !== null) {
          loadData(fragrancesRes.data, 'fragrances', setFragrances, 'fragrances');
        }
        if (recipesRes.data !== null) {
          loadData(recipesRes.data, 'recipes', setRecipes, 'recipes');
        }
        if (batchHistoryRes.data !== null) {
          setBatchHistory(toCamelCase(batchHistoryRes.data));
          loadedCountsRef.current.batchHistory = batchHistoryRes.data.length;
        }
        if (batchListRes.data !== null) {
          setBatchList(toCamelCase(batchListRes.data));
          loadedCountsRef.current.batchList = batchListRes.data.length;
        }
        if (savedInstructionsRes.data !== null) {
          setSavedInstructions(toCamelCase(savedInstructionsRes.data));
          loadedCountsRef.current.savedInstructions = savedInstructionsRes.data.length;
        }
        if (savedChatsRes.data !== null) {
          setSavedChats(toCamelCase(savedChatsRes.data));
          loadedCountsRef.current.savedChats = savedChatsRes.data.length;
        }
        if (fragranceBottlesRes.data !== null) {
          setFragranceBottles(toCamelCase(fragranceBottlesRes.data));
          loadedCountsRef.current.fragranceBottles = fragranceBottlesRes.data.length;
        }

        // Load settings (API key)
        if (settingsRes.data?.gemini_api_key) {
          setGeminiApiKey(settingsRes.data.gemini_api_key);
          localStorage.setItem('geminiApiKey', settingsRes.data.gemini_api_key);
        }

        console.log('Loaded from Supabase:', loadedCountsRef.current);

        setSyncStatus('idle');
      } catch (error) {
        console.warn('Failed to load from Supabase, using localStorage:', error);
        setSyncStatus('error');
      }
      setDataLoaded(true);
    };

    loadFromSupabase();
  }, []);

  // Real-time subscriptions DISABLED - was causing data wipes
  // Data syncs to Supabase on save and loads fresh on page refresh
  // For now, refresh the page to see changes from other devices

  // Sync to Supabase - UPSERT only for core tables (no auto-delete to prevent cross-device conflicts)
  const syncToSupabase = useCallback(async (table, data, upsertOnly = false) => {
    try {
      const snakeData = toSnakeCase(data);

      if (upsertOnly) {
        // UPSERT ONLY: Add new items, update existing - NO deletions
        // Deletions must be explicit via deleteFromSupabase()
        if (data.length > 0) {
          const { error } = await supabase.from(table).upsert(snakeData, { onConflict: 'id' });
          if (error) {
            console.error(`Supabase upsert error for ${table}:`, error.message);
          } else {
            console.log(`Synced ${data.length} items to ${table} (upsert)`);
          }
        }
      } else {
        // DELETE+INSERT for non-core data - simple replacement
        const { error: delError } = await supabase.from(table).delete().neq('id', '');
        if (delError) {
          console.error(`Supabase delete error for ${table}:`, delError.message);
          return;
        }
        if (data.length > 0) {
          const { error } = await supabase.from(table).insert(snakeData);
          if (error) {
            console.error(`Supabase insert error for ${table}:`, error.message);
          } else {
            console.log(`Synced ${data.length} items to ${table} (replace)`);
          }
        } else {
          console.log(`Cleared ${table} (0 items)`);
        }
      }
    } catch (error) {
      console.warn(`Failed to sync ${table} to Supabase:`, error);
    }
  }, []);

  // Explicit delete from Supabase - call this when user deletes an item
  const deleteFromSupabase = useCallback(async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        console.error(`Failed to delete ${id} from ${table}:`, error.message);
      } else {
        console.log(`Deleted ${id} from ${table}`);
      }
    } catch (error) {
      console.warn(`Failed to delete from ${table}:`, error);
    }
  }, []);

  // Persist active tab to localStorage
  useEffect(() => { saveToStorage('activeTab', activeTab); }, [activeTab]);

  // Enable sync only after initial load + delay
  useEffect(() => {
    if (dataLoaded && !syncEnabledRef.current) {
      const timer = setTimeout(() => {
        syncEnabledRef.current = true;
        console.log('Supabase sync enabled');
      }, 500); // 500ms delay for safety
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, materials, fragrances, recipes, syncToSupabase]);

  // Safe sync function - protects against accidental data wipes
  const safeSyncToSupabase = useCallback(async (table, data, loadedKey) => {
    if (!syncEnabledRef.current) return;

    // Core tables use UPSERT only (no auto-delete to prevent cross-device conflicts)
    const coreDataTables = ['materials', 'fragrances', 'recipes'];
    const isCoreTable = coreDataTables.includes(table);

    // CRITICAL: Never sync empty core data - prevents accidental wipes
    if (isCoreTable && data.length === 0) {
      console.warn(`BLOCKED: Cannot sync empty ${table} - this would wipe core data!`);
      return;
    }

    // Core tables: upsert only (add/update, deletions are explicit)
    // Non-core tables: delete+insert (simple replacement)
    await syncToSupabase(table, data, isCoreTable);
  }, [syncToSupabase]);

  // Persist data to localStorage and Supabase (with safety checks)
  useEffect(() => {
    saveToStorage('materials', materials);
    safeSyncToSupabase('materials', materials, 'materials');
  }, [materials, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('fragrances', fragrances);
    safeSyncToSupabase('fragrances', fragrances, 'fragrances');
  }, [fragrances, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('recipes', recipes);
    safeSyncToSupabase('recipes', recipes, 'recipes');
  }, [recipes, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('batchHistory', batchHistory);
    safeSyncToSupabase('batch_history', batchHistory, 'batchHistory');
  }, [batchHistory, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('batchList', batchList);
    safeSyncToSupabase('batch_list', batchList, 'batchList');
  }, [batchList, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('appDefaults', appDefaults);
  }, [appDefaults]);

  useEffect(() => {
    saveToStorage('savedInstructions', savedInstructions);
    safeSyncToSupabase('saved_instructions', savedInstructions, 'savedInstructions');
  }, [savedInstructions, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('savedChats', savedChats);
    safeSyncToSupabase('saved_chats', savedChats, 'savedChats');
  }, [savedChats, safeSyncToSupabase]);

  useEffect(() => {
    saveToStorage('fragranceBottles', fragranceBottles);
    safeSyncToSupabase('fragrance_bottles', fragranceBottles, 'fragranceBottles');
  }, [fragranceBottles, safeSyncToSupabase]);

  // Smart Sync: Update fragrance qtyOnHand from bottle totals
  // When bottles exist for a fragrance, their total becomes the source of truth
  useEffect(() => {
    if (fragranceBottles.length === 0) return;

    // Group bottles by fragrance name and calculate totals
    const bottleTotals = {};
    fragranceBottles.forEach(bottle => {
      if (bottle.status === 'archived') return;
      const ozRemaining = calculateNetOzRemaining(bottle) || 0;
      if (!bottleTotals[bottle.fragranceName]) {
        bottleTotals[bottle.fragranceName] = 0;
      }
      bottleTotals[bottle.fragranceName] += ozRemaining;
    });

    // Update fragrances that have bottles tracked
    setFragrances(prev => {
      let changed = false;
      const updated = prev.map(frag => {
        if (bottleTotals.hasOwnProperty(frag.name)) {
          const newQty = Math.round(bottleTotals[frag.name] * 100) / 100; // Round to 2 decimals
          if (Math.abs((frag.qtyOnHand || 0) - newQty) > 0.01) {
            changed = true;
            return { ...frag, qtyOnHand: newQty };
          }
        }
        return frag;
      });
      return changed ? updated : prev;
    });
  }, [fragranceBottles]);

  // Auto-scroll conversation to bottom when new messages arrive
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [instructionsConversation, instructionsAiLoading]);

  // Auto-trigger AI when navigating from Batch Builder
  useEffect(() => {
    if (pendingAutoPrompt && activeTab === 'instructions' && !instructionsAiLoading) {
      generateBatchInstructions(pendingAutoPrompt);
      setPendingAutoPrompt(null);
    }
  }, [pendingAutoPrompt, activeTab, instructionsAiLoading]);

  // Materials page state
  const [materialView, setMaterialView] = useState('table'); // 'grid', 'list', 'table'
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materialFilter, setMaterialFilter] = useState('All'); // category filter
  const [materialSort, setMaterialSort] = useState('name'); // 'name', 'category', 'vendor', 'cost', 'stock', 'stock-desc'
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveForm, setReceiveForm] = useState({ materialId: '', quantity: 0 });
  const [showLogBatchModal, setShowLogBatchModal] = useState(false);
  const [logBatchForm, setLogBatchForm] = useState({ recipe: '', quantity: 12, size: 4, notes: '', autoDeduct: true });
  const [showQuickLogModal, setShowQuickLogModal] = useState(false);
  const [quickLogBatch, setQuickLogBatch] = useState(null);
  const [quickLogNotes, setQuickLogNotes] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportText, setExportText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Shopify integration state
  const [shopifyOrders, setShopifyOrders] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState(null);
  const [shopifyLastSync, setShopifyLastSync] = useState(null);

  // Fetch Shopify data
  const fetchShopifyData = useCallback(async () => {
    setShopifyLoading(true);
    setShopifyError(null);
    try {
      // Fetch orders from last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const [ordersRes, productsRes] = await Promise.all([
        fetch(`/api/shopify?endpoint=orders&status=any&created_at_min=${ninetyDaysAgo.toISOString()}&limit=50`),
        fetch(`/api/shopify?endpoint=products&limit=50`)
      ]);

      if (!ordersRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch from Shopify');
      }

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setShopifyOrders(ordersData.orders || []);
      setShopifyProducts(productsData.products || []);
      setShopifyLastSync(new Date().toISOString());
    } catch (err) {
      console.error('Shopify fetch error:', err);
      setShopifyError(err.message);
    } finally {
      setShopifyLoading(false);
    }
  }, []);

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

  const selectedRecipe = recipes.find(r => r.name === currentBatch.recipe);

  // Auto-calculate avgFoCost from recipe components using weighted average pricing
  const calculatedAvgFoCost = useMemo(() => {
    if (!selectedRecipe?.components?.length) return 1.97; // default fallback
    const costs = selectedRecipe.components.map(c => {
      const frag = fragrances.find(f => f.name === c.fragrance);
      const pricePerOz = getFragrancePricePerOz(frag);
      return pricePerOz * (c.percent / 100);
    });
    return Math.round(costs.reduce((sum, c) => sum + c, 0) * 100) / 100;
  }, [selectedRecipe, fragrances]);

  // Use calculated avgFoCost if not manually set
  const effectiveAvgFoCost = currentBatch.avgFoCost > 0 ? currentBatch.avgFoCost : calculatedAvgFoCost;
  const currentCalc = calculateBatch({ ...currentBatch, avgFoCost: effectiveAvgFoCost });

  // Pricing engine calculation based on selected recipe (using 9oz as default)
  const pricingCalc = useMemo(() => {
    const recipe = recipes.find(r => r.name === pricingRecipe);
    if (!recipe) return { totalCostPerCandle: 0, profitPerCandle: 0, retailPrice: 0 };

    const size = 9; // Default size since recipes no longer have container/size
    const foLoad = (recipe.foLoad || 10) / 100;
    const waxCostPerOz = 0.206;
    const containerCost = 2.00; // 9oz jar cost
    const wickCost = 0.13;
    const labelCost = 0.03;
    const packagingCost = 0.74;
    const avgFoCost = 1.97;
    const retailPrice = 24.00; // 9oz price

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
      const containerKey = batch.container || 'Container';

      if (!byRecipe[batch.recipe]) {
        byRecipe[batch.recipe] = {
          recipe: batch.recipe,
          container: batch.container,
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
  const stats = useMemo(() => {
    // Calculate totals supporting both old and new batch formats
    const totalCandles = batchHistory.reduce((sum, b) => sum + (b.quantity || b.qty || 0), 0);
    const totalInvestment = batchHistory.reduce((sum, b) => {
      if (b.cost) return sum + b.cost;
      if (b.waxCostPerOz !== undefined) {
        const calc = calculateBatch(b);
        return sum + calc.totalBatchCost;
      }
      return sum;
    }, 0);
    return {
      totalBatches: batchHistory.length,
      totalCandles,
      totalInvestment,
      avgHotThrow: batchHistory.filter(b => b.hotThrow).reduce((sum, b, _, arr) => sum + b.hotThrow / arr.length, 0),
      recipesCount: recipes.length,
      fragrancesCount: fragrances.length,
      pendingBatches: batchList.length,
      pendingCandles: batchList.reduce((sum, b) => sum + b.quantity, 0),
    };
  }, [batchHistory, recipes, fragrances, batchList]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    const lowMaterials = materials.filter(m => m.qtyOnHand < m.reorderPoint);
    const lowFragrances = fragrances.filter(f => f.qtyOnHand !== undefined && f.qtyOnHand < (f.reorderPoint || 8));
    return [...lowMaterials, ...lowFragrances.map(f => ({ ...f, category: 'Fragrance' }))];
  }, [materials, fragrances]);

  // Calculate what materials a recipe needs for a given quantity
  const calculateRecipeMaterials = (recipe, quantity, size = 9) => {
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
  const canMakeRecipe = (recipe, quantity = 12, size = 9, containerName = '') => {
    const needs = calculateRecipeMaterials(recipe, quantity, size);

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

    // Check containers if specified
    if (containerName) {
      const container = materials.find(m => m.name === containerName);
      if (!container || container.qtyOnHand < quantity) {
        const available = container?.qtyOnHand || 0;
        return { canMake: false, reason: `Need ${quantity} containers, have ${available}`, maxQty: available };
      }
    }

    // Check wicks
    const totalWicks = materials.filter(m => m.category === 'Wick').reduce((sum, m) => sum + m.qtyOnHand, 0);
    if (totalWicks < quantity) {
      return { canMake: false, reason: `Need ${quantity} wicks, have ${totalWicks}`, maxQty: totalWicks };
    }

    return { canMake: true, reason: 'Ready to make!', maxQty: quantity };
  };

  // Check if current batch has enough stock - returns ALL shortages
  const currentBatchStock = useMemo(() => {
    if (!selectedRecipe) return { canMake: true, shortages: [], inStock: [], allNeeds: [] };
    const quantity = currentBatch.quantity;
    const needs = calculateRecipeMaterials(selectedRecipe, quantity, currentBatch.size);
    const shortages = [];
    const inStock = [];
    const allNeeds = [];

    // Check wax
    const selectedWax = currentBatch.wax ? materials.find(m => m.name === currentBatch.wax) : null;
    const waxLbsNeeded = Math.round(needs.wax / 16 * 100) / 100;
    const waxName = selectedWax?.name || 'Wax';
    const waxHave = selectedWax ? selectedWax.qtyOnHand : materials.filter(m => m.category === 'Wax').reduce((sum, m) => sum + m.qtyOnHand, 0);
    allNeeds.push({ name: waxName, category: 'Wax', needed: waxLbsNeeded, have: waxHave, unit: 'lbs' });
    if (waxHave < waxLbsNeeded) {
      shortages.push({ name: waxName, needed: waxLbsNeeded, have: waxHave, unit: 'lbs', toOrder: Math.round((waxLbsNeeded - waxHave) * 100) / 100 });
    } else {
      inStock.push({ name: waxName, needed: waxLbsNeeded, have: waxHave, unit: 'lbs' });
    }

    // Check container
    const containerName = currentBatch.container || 'Container';
    const container = materials.find(m => m.name === containerName);
    const containerHave = container?.qtyOnHand || 0;
    allNeeds.push({ name: containerName, category: 'Container', needed: quantity, have: containerHave, unit: 'pcs' });
    if (containerHave < quantity) {
      shortages.push({ name: containerName, needed: quantity, have: containerHave, unit: 'pcs', toOrder: quantity - containerHave });
    } else {
      inStock.push({ name: containerName, needed: quantity, have: containerHave, unit: 'pcs' });
    }

    // Check wick
    const selectedWick = currentBatch.wick ? materials.find(m => m.name === currentBatch.wick) : null;
    const wickName = selectedWick?.name || 'Wicks';
    const wickHave = selectedWick ? selectedWick.qtyOnHand : materials.filter(m => m.category === 'Wick').reduce((sum, m) => sum + m.qtyOnHand, 0);
    allNeeds.push({ name: wickName, category: 'Wick', needed: quantity, have: wickHave, unit: 'pcs' });
    if (wickHave < quantity) {
      shortages.push({ name: wickName, needed: quantity, have: wickHave, unit: 'pcs', toOrder: quantity - wickHave });
    } else {
      inStock.push({ name: wickName, needed: quantity, have: wickHave, unit: 'pcs' });
    }

    // Check fragrances
    const totalFoOz = currentBatch.size * currentBatch.foLoad * quantity;
    for (const comp of selectedRecipe.components || []) {
      const frag = fragrances.find(f => f.name === comp.fragrance);
      const ozNeeded = Math.round(totalFoOz * (comp.percent / 100) * 100) / 100;
      const quantities = frag?.quantities || {};
      const totalAvailable = Math.round(Object.entries(quantities).reduce((sum, [sz, qty]) => sum + ((qty || 0) * parseFloat(sz)), 0) * 100) / 100;

      allNeeds.push({ name: comp.fragrance, category: 'Fragrance', needed: ozNeeded, have: totalAvailable, unit: 'oz' });
      if (!frag || totalAvailable < ozNeeded) {
        shortages.push({ name: comp.fragrance, needed: ozNeeded, have: totalAvailable, unit: 'oz', toOrder: Math.round((ozNeeded - totalAvailable) * 100) / 100 });
      } else {
        inStock.push({ name: comp.fragrance, needed: ozNeeded, have: totalAvailable, unit: 'oz' });
      }
    }

    return { canMake: shortages.length === 0, shortages, inStock, allNeeds };
  }, [selectedRecipe, currentBatch, materials, fragrances]);

  // Combined materials needed for ALL batches in batch list
  const batchListSummary = useMemo(() => {
    if (batchList.length === 0) return { totalNeeds: {}, shortages: [], inStock: [], canMakeAll: true };

    // Aggregate all needs by item name
    const totalNeeds = {};

    for (const batch of batchList) {
      const recipe = recipes.find(r => r.name === batch.recipe);
      if (!recipe) continue;

      const quantity = batch.quantity || 0;
      const size = batch.size || 9;
      const foLoad = batch.foLoad || 0.10;

      // Wax (convert to lbs)
      const waxOz = size * (1 - foLoad) * quantity;
      const waxLbs = waxOz / 16;
      const waxName = batch.wax || 'Wax';
      totalNeeds[waxName] = totalNeeds[waxName] || { name: waxName, category: 'Wax', needed: 0, unit: 'lbs' };
      totalNeeds[waxName].needed += waxLbs;

      // Container
      const containerName = batch.container || 'Container';
      totalNeeds[containerName] = totalNeeds[containerName] || { name: containerName, category: 'Container', needed: 0, unit: 'pcs' };
      totalNeeds[containerName].needed += quantity;

      // Wick
      const wickName = batch.wick || 'Wicks';
      totalNeeds[wickName] = totalNeeds[wickName] || { name: wickName, category: 'Wick', needed: 0, unit: 'pcs' };
      totalNeeds[wickName].needed += quantity;

      // Fragrances
      const totalFoOz = size * foLoad * quantity;
      for (const comp of recipe.components || []) {
        const ozNeeded = totalFoOz * (comp.percent / 100);
        totalNeeds[comp.fragrance] = totalNeeds[comp.fragrance] || { name: comp.fragrance, category: 'Fragrance', needed: 0, unit: 'oz' };
        totalNeeds[comp.fragrance].needed += ozNeeded;
      }
    }

    // Check stock for each item
    const shortages = [];
    const inStock = [];

    for (const item of Object.values(totalNeeds)) {
      item.needed = Math.round(item.needed * 100) / 100;
      let have = 0;

      if (item.category === 'Wax') {
        const mat = materials.find(m => m.name === item.name && m.category === 'Wax');
        have = mat ? mat.qtyOnHand : materials.filter(m => m.category === 'Wax').reduce((sum, m) => sum + m.qtyOnHand, 0);
      } else if (item.category === 'Container' || item.category === 'Wick') {
        const mat = materials.find(m => m.name === item.name);
        have = mat?.qtyOnHand || 0;
      } else if (item.category === 'Fragrance') {
        const frag = fragrances.find(f => f.name === item.name);
        const quantities = frag?.quantities || {};
        have = Object.entries(quantities).reduce((sum, [sz, qty]) => sum + ((qty || 0) * parseFloat(sz)), 0);
      }

      have = Math.round(have * 100) / 100;
      item.have = have;

      if (have < item.needed) {
        item.toOrder = Math.round((item.needed - have) * 100) / 100;
        shortages.push(item);
      } else {
        inStock.push(item);
      }
    }

    return { totalNeeds: Object.values(totalNeeds), shortages, inStock, canMakeAll: shortages.length === 0 };
  }, [batchList, recipes, materials, fragrances]);

  // What can I make - calculate for all recipes (using 9oz as default size)
  const whatCanIMake = useMemo(() => {
    const defaultSize = 9;
    const activeRecipes = recipes.filter(r => !r.archived);
    return activeRecipes.map(recipe => {
      const check12 = canMakeRecipe(recipe, 12, defaultSize);
      const check24 = canMakeRecipe(recipe, 24, defaultSize);
      const check6 = canMakeRecipe(recipe, 6, defaultSize);

      // Find max we can make
      let maxQty = 0;
      for (let q = 1; q <= 100; q++) {
        if (canMakeRecipe(recipe, q, defaultSize).canMake) {
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
  // skipFragrances: when true, skips fragrance deduction (used by Batch Wizard since bottles handle it via Smart Sync)
  const deductBatchMaterials = (batch, { skipFragrances = false } = {}) => {
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

    // Deduct fragrances (skip if bottles are handling it via Smart Sync)
    if (!skipFragrances) {
      setFragrances(prev => prev.map(f => {
        const needed = needs.fragranceBreakdown.find(fb => fb.name === f.name);
        if (needed && f.qtyOnHand !== undefined) {
          return { ...f, qtyOnHand: Math.max(0, f.qtyOnHand - needed.oz) };
        }
        return f;
      }));
    }

    // Deduct containers
    setMaterials(prev => prev.map(m => {
      if (m.name === batch.container) {
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
    setLogBatchForm({ recipe: '', quantity: 12, size: 4, notes: '', autoDeduct: true });
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

  const openQuickLogModal = (batch) => {
    setQuickLogBatch(batch);
    setQuickLogNotes('');
    setShowQuickLogModal(true);
  };

  const confirmLogBatch = () => {
    if (!quickLogBatch) return;
    // Add to batch history with timestamp and notes
    const loggedBatch = {
      ...quickLogBatch,
      id: Date.now(),
      loggedAt: new Date().toISOString(),
      status: 'completed',
      notes: quickLogNotes
    };
    setBatchHistory([loggedBatch, ...batchHistory]);
    // Remove from batches to build
    setBatchList(batchList.filter(b => b.id !== quickLogBatch.id));
    // Close modal
    setShowQuickLogModal(false);
    setQuickLogBatch(null);
    setQuickLogNotes('');
  };

  const resetCurrentBatch = () => {
    const firstRecipe = recipes[0];
    // Get material costs from defaults
    const defaultWaxMat = materials.find(m => m.name === appDefaults.defaultWax);
    const defaultContainerMat = materials.find(m => m.name === appDefaults.defaultContainer);
    const defaultWickMat = materials.find(m => m.name === appDefaults.defaultWick);

    setCurrentBatch({
      recipe: firstRecipe?.name || '',
      quantity: appDefaults.defaultQuantity || 12,
      size: appDefaults.defaultCandleSize || 9,
      foLoad: (appDefaults.defaultFoLoad || 10) / 100,
      wax: appDefaults.defaultWax || '',
      container: appDefaults.defaultContainer || '',
      wick: appDefaults.defaultWick || '',
      label: appDefaults.defaultLabel || '',
      packaging: appDefaults.defaultPackaging || '',
      waxCostPerOz: defaultWaxMat ? Math.round(defaultWaxMat.packageCost / defaultWaxMat.packageSize / 16 * 100) / 100 : 0,
      containerCost: defaultContainerMat ? Math.round(defaultContainerMat.packageCost / defaultContainerMat.packageSize * 100) / 100 : 0,
      wickCost: defaultWickMat ? Math.round(defaultWickMat.packageCost / defaultWickMat.packageSize * 100) / 100 : 0,
      labelCost: appDefaults.defaultLabel === 'standard-vinyl' ? appDefaults.largeLabelCost : 0,
      packagingCost: 0,
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
      case 'id':
        return filtered.sort((a, b) => a.id.localeCompare(b.id));
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

  const saveMaterial = async () => {
    if (!materialForm.name) { alert('Name is required'); return; }
    if (!materialForm.id) { alert('ID is required'); return; }
    
    // Check for duplicate ID (excluding current item if editing)
    const duplicateId = materials.find(m => m.id === materialForm.id && m.id !== editingMaterial);
    if (duplicateId) { alert('This ID already exists. Please use a unique ID.'); return; }
    
    // Save to Supabase FIRST
    const { error } = await supabase.from('materials').upsert([toSnakeCase({ ...materialForm })], { onConflict: 'id' });
    if (error) {
      alert('Failed to save: ' + error.message);
      return;
    }

    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial ? { ...materialForm } : m));
    } else {
      setMaterials([...materials, { ...materialForm }]);
    }
    setShowMaterialModal(false);
  };

  // Import material from URL using AI
  const importMaterialFromUrl = async () => {
    if (!urlImportInput.trim()) {
      alert('Please enter a product URL');
      return;
    }
    if (!geminiApiKey) {
      alert('Please set your Gemini API key first (click the chat bubble, then the key icon)');
      return;
    }

    setUrlImportLoading(true);
    try {
      // Fetch the URL content using our serverless API (avoids CORS)
      let cleanedContent = '';

      // Try our own API endpoint first
      try {
        const apiResponse = await fetch(`/api/fetch-url?url=${encodeURIComponent(urlImportInput)}`);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          cleanedContent = data.content || '';
        }
      } catch (apiError) {
        console.log('API fetch failed, trying proxies...');
      }

      // Fallback to CORS proxies if API fails
      if (!cleanedContent) {
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(urlImportInput)}`,
          `https://corsproxy.io/?${encodeURIComponent(urlImportInput)}`
        ];
        for (const proxyUrl of proxies) {
          try {
            const proxyResponse = await fetch(proxyUrl);
            if (proxyResponse.ok) {
              const contentType = proxyResponse.headers.get('content-type') || '';
              let pageContent = '';
              if (contentType.includes('json')) {
                const proxyData = await proxyResponse.json();
                pageContent = proxyData.contents || '';
              } else {
                pageContent = await proxyResponse.text();
              }
              if (pageContent) {
                cleanedContent = pageContent
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .substring(0, 15000);
                break;
              }
            }
          } catch (proxyError) {
            continue;
          }
        }
      }

      if (!cleanedContent) {
        throw new Error('Could not fetch the page content. Please try again or enter details manually.');
      }

      // Determine vendor from URL
      let vendor = 'Unknown';
      if (urlImportInput.includes('candlescience.com')) vendor = 'CandleScience';
      else if (urlImportInput.includes('amazon.com')) vendor = 'Amazon';
      else if (urlImportInput.includes('lonestarcandle')) vendor = 'Lone Star';

      // Check for Amazon bot protection
      if (vendor === 'Amazon' && (cleanedContent.includes('Continue shopping') || cleanedContent.length < 500)) {
        throw new Error('Amazon blocks automated access. Please copy product details manually.');
      }

      // Use Gemini to extract product info
      const prompt = `You are extracting product information from a candle-making supply website.

IMPORTANT: Look for the MAIN PRODUCT on this page and extract its details.

From this page content, find and return ONLY a JSON object (no markdown, no backticks, no explanation):

{
  "name": "the main product name from the page title or heading",
  "category": "Wax" or "Container" or "Wick" or "Label" or "Packaging" or "Unit",
  "packageSize": the number of items or weight (e.g., 10 for 10lb bag, 12 for case of 12 jars),
  "unit": "lb" or "oz" or "unit" or "case" or "pack" or "roll",
  "packageCost": the price as a number without $ sign,
  "fillCapacity": for containers only - the oz capacity (e.g., 8 for 8oz jar), otherwise null
}

RULES:
- For wax products, look for weight in lbs (e.g., "10 lb" means packageSize=10, unit="lb")
- For containers/jars, packageSize is how many jars, fillCapacity is the oz size of each jar
- Category is based on product type: wax/soy wax = "Wax", jars/tins/vessels = "Container", wicks = "Wick"
- Find the actual price on the page (look for $ amounts)

Page URL: ${urlImportInput}
Vendor: ${vendor}

PAGE CONTENT:
${cleanedContent.substring(0, 12000)}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON from response (handle markdown code blocks)
      let jsonStr = aiText;
      if (aiText.includes('```')) {
        jsonStr = aiText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      }

      const productInfo = JSON.parse(jsonStr);

      // Validate extracted data
      if (!productInfo.name || productInfo.name.length < 2) {
        throw new Error('Could not extract product name. Please enter details manually.');
      }

      // Generate ID based on category
      const validCategories = ['Wax', 'Container', 'Wick', 'Label', 'Packaging', 'Unit'];
      if (!validCategories.includes(productInfo.category)) {
        productInfo.category = 'Unit'; // Default fallback
      }

      const prefixes = { Wax: 'W', Container: 'C', Wick: 'K', Label: 'L', Packaging: 'P', Unit: 'U' };
      const prefix = prefixes[productInfo.category] || 'M';
      const existingInCategory = materials.filter(m => m.id.startsWith(prefix + '-')).length;
      const newId = `${prefix}-${String(existingInCategory + 1).padStart(3, '0')}`;

      // Shorten URL for vendor field (especially Amazon links)
      const vendorUrl = await shortenUrl(urlImportInput);

      // Pre-fill the material form
      setMaterialForm({
        id: newId,
        category: productInfo.category || 'Unit',
        name: productInfo.name || '',
        vendor: vendorUrl,
        unit: productInfo.unit || 'unit',
        packageSize: productInfo.packageSize || 1,
        packageCost: productInfo.packageCost || 0,
        qtyOnHand: 0,
        reorderPoint: 0,
        fillCapacity: productInfo.fillCapacity || null
      });

      setEditingMaterial(null);
      setShowUrlImportModal(false);
      setShowMaterialModal(true);
      setUrlImportInput('');

    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import: ' + error.message + '\n\nTry copying the product details manually.');
    } finally {
      setUrlImportLoading(false);
    }
  };

  const deleteMaterial = async (id, e) => {
    if (e) e.stopPropagation();
    const item = materials.find(m => m.id === id);
    if (!confirm(`Delete "${item?.name || id}"? This cannot be undone.`)) return;

    // Delete from Supabase FIRST
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    // Then update local state
    setMaterials(materials.filter(m => m.id !== id));
    setSelectedMaterials(selectedMaterials.filter(sid => sid !== id));
  };

  // Fragrance functions
  const openAddFragrance = () => {
    setEditingFragrance(null);
    setFragranceForm({ name: '', type: 'FO', vendor: '', packageSize: 16, packageCost: 0, prices: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, quantities: { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }, flashPoint: 200, maxLoad: 10, qtyOnHand: 0, reorderPoint: 0, archived: false });
    setShowFragranceModal(true);
  };

  // Import fragrance from URL using AI
  const importFragranceFromUrl = async () => {
    if (!urlImportInput.trim()) {
      alert('Please enter a product URL');
      return;
    }
    if (!geminiApiKey) {
      alert('Please set your Gemini API key first (click the chat bubble, then the key icon)');
      return;
    }

    setUrlImportLoading(true);
    try {
      // Fetch the URL content using our serverless API
      let cleanedContent = '';

      try {
        const apiResponse = await fetch(`/api/fetch-url?url=${encodeURIComponent(urlImportInput)}`);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          cleanedContent = data.content || '';
        }
      } catch (apiError) {
        console.log('API fetch failed, trying proxies...');
      }

      // Fallback to CORS proxies
      if (!cleanedContent) {
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(urlImportInput)}`,
          `https://corsproxy.io/?${encodeURIComponent(urlImportInput)}`
        ];
        for (const proxyUrl of proxies) {
          try {
            const proxyResponse = await fetch(proxyUrl);
            if (proxyResponse.ok) {
              const contentType = proxyResponse.headers.get('content-type') || '';
              let pageContent = '';
              if (contentType.includes('json')) {
                const proxyData = await proxyResponse.json();
                pageContent = proxyData.contents || '';
              } else {
                pageContent = await proxyResponse.text();
              }
              if (pageContent) {
                cleanedContent = pageContent
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .substring(0, 15000);
                break;
              }
            }
          } catch (proxyError) {
            continue;
          }
        }
      }

      if (!cleanedContent) {
        throw new Error('Could not fetch the page content. Please try again or enter details manually.');
      }

      // Determine vendor from URL
      let vendor = 'Unknown';
      if (urlImportInput.includes('candlescience.com')) vendor = 'CandleScience';
      else if (urlImportInput.includes('amazon.com')) vendor = 'Amazon';
      else if (urlImportInput.includes('lonestarcandle')) vendor = 'Lone Star';

      // Check for Amazon bot protection
      if (vendor === 'Amazon' && (cleanedContent.includes('Continue shopping') || cleanedContent.length < 500)) {
        throw new Error('Amazon blocks automated access. Please copy product details manually.');
      }

      // Use Gemini to extract fragrance info
      const prompt = `You are extracting fragrance oil/essential oil product information from a candle-making supply website.

IMPORTANT: Extract ALL available bottle sizes and their total prices from this product page.

From this page content, find and return ONLY a JSON object (no markdown, no backticks, no explanation):

{
  "name": "the fragrance name (clean, without 'fragrance oil' or 'essential oil' suffix)",
  "type": "FO" for fragrance oil or "EO" for essential oil,
  "prices": {
    "1": total price for 1oz bottle or 0 if not available,
    "4": total price for 4oz bottle or 0 if not available,
    "8": total price for 8oz bottle or 0 if not available,
    "16": total price for 15oz or 16oz bottle or 0 if not available
  },
  "flashPoint": flash point temperature in Fahrenheit (number),
  "maxLoad": max fragrance load percentage for candles (number)
}

EXTRACTION RULES:
- Look for patterns like "1 oz Bottle ($X.XX)" or "4 oz - $X.XX"
- The page shows "Choose a Variant" followed by size options with prices
- For 16oz field: use 15oz or 16oz price (whichever is listed)
- Extract the TOTAL PRICE for each bottle, not the per-oz price
- flashPoint: look for "Flashpoint" or "Flash Point" followed by temperature
- maxLoad: look for "Max Load" or "recommended usage" percentage (default 10 if not found)

Page URL: ${urlImportInput}
Vendor: ${vendor}

PAGE CONTENT:
${cleanedContent.substring(0, 12000)}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON from response
      let jsonStr = aiText;
      if (aiText.includes('```')) {
        jsonStr = aiText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      }

      const productInfo = JSON.parse(jsonStr);

      // Validate extracted data
      if (!productInfo.name || productInfo.name.length < 2) {
        throw new Error('Could not extract fragrance name. Please enter details manually.');
      }

      // Generate ID
      const newId = `FO-${String(fragrances.length + 1).padStart(3, '0')}`;

      // Pre-fill the fragrance form with extracted prices
      const defaultPrices = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 };
      const defaultQtys = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 };

      // Merge extracted prices with defaults
      const extractedPrices = productInfo.prices || {};
      const prices = {
        0.5: extractedPrices['0.5'] || 0,
        1: extractedPrices['1'] || 0,
        4: extractedPrices['4'] || 0,
        8: extractedPrices['8'] || 0,
        16: extractedPrices['16'] || 0
      };

      // Find the largest size with a price for packageSize
      const pkgSize = [16, 8, 4, 1, 0.5].find(s => prices[s] > 0) || 16;
      const pkgCost = prices[pkgSize] || 0;

      // Shorten URL for vendor field (especially Amazon links)
      const vendorUrl = await shortenUrl(urlImportInput);

      setFragranceForm({
        id: newId,
        name: productInfo.name || '',
        type: productInfo.type === 'EO' ? 'EO' : 'FO',
        vendor: vendorUrl,
        packageSize: pkgSize,
        packageCost: pkgCost,
        prices: prices,
        quantities: { ...defaultQtys },
        flashPoint: productInfo.flashPoint || 200,
        maxLoad: productInfo.maxLoad || 10,
        qtyOnHand: 0,
        reorderPoint: 0,
        archived: false
      });

      setEditingFragrance(null);
      setShowUrlImportModal(false);
      setShowFragranceModal(true);
      setUrlImportInput('');

    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import: ' + error.message + '\n\nTry copying the product details manually.');
    } finally {
      setUrlImportLoading(false);
    }
  };

  const openEditFragrance = (frag) => {
    setEditingFragrance(frag.id);
    const defaultPrices = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }; const defaultQtys = { 0.5: 0, 1: 0, 4: 0, 8: 0, 16: 0 }; const prices = frag.prices || { ...defaultPrices, [frag.packageSize]: frag.packageCost }; const quantities = frag.quantities || { ...defaultQtys, [frag.packageSize]: frag.qtyOnHand || 0 }; setFragranceForm({ ...frag, prices, quantities });
    setShowFragranceModal(true);
  };

  const saveFragrance = async () => {
    if (!fragranceForm.name) return;

    // Generate ID for new fragrances BEFORE saving to Supabase
    const fragranceToSave = editingFragrance
      ? { ...fragranceForm, id: editingFragrance }
      : { ...fragranceForm, id: `FO-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };

    // Save to Supabase FIRST
    const { error } = await supabase.from('fragrances').upsert([toSnakeCase(fragranceToSave)], { onConflict: 'id' });
    if (error) {
      alert('Failed to save: ' + error.message);
      return;
    }

    if (editingFragrance) {
      setFragrances(fragrances.map(f => f.id === editingFragrance ? fragranceToSave : f));
    } else {
      setFragrances([...fragrances, fragranceToSave]);
    }
    setShowFragranceModal(false);
  };

  const deleteFragrance = async (id, e) => {
    if (e) e.stopPropagation();
    const item = fragrances.find(f => f.id === id);
    if (!confirm(`Delete "${item?.name || id}"? This cannot be undone.`)) return;

    const { error } = await supabase.from('fragrances').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    setFragrances(fragrances.filter(f => f.id !== id));
    setSelectedFragrances(selectedFragrances.filter(sid => sid !== id));
  };

  const archiveFragrance = (id, e) => {
    if (e) e.stopPropagation();
    setFragrances(fragrances.map(f => f.id === id ? { ...f, archived: !f.archived } : f));
  };

  const deleteBottle = async (bottleId) => {
    const bottle = fragranceBottles.find(b => b.id === bottleId);
    if (!confirm(`Delete this ${bottle?.purchaseSizeOz || ''}oz bottle of ${bottle?.fragranceName || 'fragrance'}? This cannot be undone.`)) return;

    const { error } = await supabase.from('fragrance_bottles').delete().eq('id', bottleId);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    setFragranceBottles(prev => prev.filter(b => b.id !== bottleId));
  };

  // Recipe functions
  const openNewRecipe = () => {
    setEditingRecipe(null);
    setRecipeForm({ name: '', vibe: '', style: '', description: '', container: '', wax: '', wick: '', size: 4, foLoad: appDefaults.defaultRecipeFoLoad || 10, archived: false, components: [{ fragrance: '', type: 'FO', percent: 100 }], dyes: [] });
    setRecipeModalPos({ x: null, y: null }); // Reset to centered
    setRecipeModalSize({ width: 700, height: null }); // Reset size
    setShowRecipeModal(true);
  };

  const openEditRecipe = (recipe) => {
    setEditingRecipe(recipe.id);
    setRecipeForm({ ...recipe, components: [...recipe.components], dyes: [...(recipe.dyes || [])] });
    setRecipeModalPos({ x: null, y: null }); // Reset to centered
    setRecipeModalSize({ width: 700, height: null }); // Reset size
    setShowRecipeModal(true);
  };

  // Recipe modal drag handlers
  const handleModalDragStart = (e) => {
    if (e.target.closest('input, select, textarea, button')) return;
    e.preventDefault();
    const modal = e.currentTarget.parentElement;
    const rect = modal.getBoundingClientRect();
    setModalDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDraggingModal(true);
  };

  const handleModalDrag = useCallback((e) => {
    if (!isDraggingModal) return;
    e.preventDefault();
    const newX = e.clientX - modalDragOffset.x;
    const newY = e.clientY - modalDragOffset.y;
    setRecipeModalPos({ x: Math.max(0, newX), y: Math.max(0, newY) });
  }, [isDraggingModal, modalDragOffset]);

  const handleModalDragEnd = useCallback(() => {
    setIsDraggingModal(false);
  }, []);

  // Recipe modal resize handlers
  const handleModalResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingModal(true);
  };

  const handleModalResize = useCallback((e) => {
    if (!isResizingModal) return;
    e.preventDefault();
    const modal = document.getElementById('recipe-modal');
    if (!modal) return;
    const rect = modal.getBoundingClientRect();
    const newWidth = Math.max(400, e.clientX - rect.left + 10);
    const newHeight = Math.max(300, e.clientY - rect.top + 10);
    setRecipeModalSize({ width: newWidth, height: newHeight });
  }, [isResizingModal]);

  const handleModalResizeEnd = useCallback(() => {
    setIsResizingModal(false);
  }, []);

  // Add global mouse event listeners for drag/resize
  React.useEffect(() => {
    if (isDraggingModal) {
      window.addEventListener('mousemove', handleModalDrag);
      window.addEventListener('mouseup', handleModalDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleModalDrag);
        window.removeEventListener('mouseup', handleModalDragEnd);
      };
    }
  }, [isDraggingModal, handleModalDrag, handleModalDragEnd]);

  React.useEffect(() => {
    if (isResizingModal) {
      window.addEventListener('mousemove', handleModalResize);
      window.addEventListener('mouseup', handleModalResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleModalResize);
        window.removeEventListener('mouseup', handleModalResizeEnd);
      };
    }
  }, [isResizingModal, handleModalResize, handleModalResizeEnd]);

  const saveRecipe = async () => {
    const totalPercent = recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0);
    if (totalPercent !== 100) return;
    if (!recipeForm.name) return;

    // Build the recipe object with appropriate ID
    const recipeId = editingRecipe || `RCP-${String(recipes.length + 1).padStart(3, '0')}`;
    const recipeToSave = { ...recipeForm, id: recipeId };

    // Save to Supabase FIRST
    const { error } = await supabase.from('recipes').upsert([toSnakeCase(recipeToSave)], { onConflict: 'id' });
    if (error) {
      alert('Failed to save: ' + error.message);
      return;
    }

    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === editingRecipe ? recipeToSave : r));
    } else {
      setRecipes([...recipes, recipeToSave]);
    }
    setShowRecipeModal(false);
  };

  // Handle recipe modal cancel - optionally return to fragrances
  const cancelRecipeModal = () => {
    setShowRecipeModal(false);
    if (appDefaults.returnToFragrancesOnRecipeCancel && selectedFragrances.length > 0) {
      setActiveTab('fragrances');
    }
  };

  const deleteRecipe = async (id, e) => {
    if (e) e.stopPropagation();
    const item = recipes.find(r => r.id === id);
    if (!confirm(`Delete recipe "${item?.name || id}"? This cannot be undone.`)) return;

    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    setRecipes(recipes.filter(r => r.id !== id));
  };

  const archiveRecipe = (id, e) => {
    if (e) e.stopPropagation();
    setRecipes(recipes.map(r => r.id === id ? { ...r, archived: !r.archived } : r));
  };

  const copyRecipe = (recipe, e) => {
    if (e) e.stopPropagation();
    setEditingRecipe(null);
    setRecipeForm({ ...recipe, name: recipe.name + " (Copy)", components: [...recipe.components], dyes: [...(recipe.dyes || [])] });
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

    // Check if we have AI-suggested ratios
    const aiData = aiResponse?.data;

    // Get fragrance details and use AI ratios if available, otherwise distribute evenly
    let components;

    if (aiData?.ratios?.length > 0) {
      // Use AI-suggested ratios
      components = selectedFragrances.map(fragId => {
        const frag = fragrances.find(f => f.id === fragId);
        const fragName = frag?.name || '';
        // Find matching ratio from AI response
        const aiRatio = aiData.ratios.find(r => r.fragrance === fragName);
        return {
          fragrance: fragName,
          type: frag?.type || 'FO',
          percent: aiRatio?.percent || Math.floor(100 / selectedFragrances.length)
        };
      });

      // Ensure percentages total 100
      const total = components.reduce((sum, c) => sum + c.percent, 0);
      if (total !== 100 && components.length > 0) {
        components[0].percent += (100 - total);
      }
    } else {
      // Distribute percentages evenly
      const evenPercent = Math.floor(100 / selectedFragrances.length);
      const remainder = 100 - (evenPercent * selectedFragrances.length);

      components = selectedFragrances.map((fragId, idx) => {
        const frag = fragrances.find(f => f.id === fragId);
        return {
          fragrance: frag?.name || '',
          type: frag?.type || 'FO',
          percent: idx === 0 ? evenPercent + remainder : evenPercent
        };
      });
    }

    setEditingRecipe(null);
    setRecipeForm({
      name: '', // Leave blank for user to fill in
      vibe: aiData?.vibe || '',
      style: aiData?.style || '',
      description: aiData?.description || '',
      wax: 'Golden Brands 464 Soy Wax',
      wick: 'CD-18 Wicks',
      foLoad: 10,
      components,
      dyes: []
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

    // Build fragrance list with names for the prompt
    const fragranceNames = selectedFragrances.map(id => {
      const f = fragrances.find(fr => fr.id === id);
      return f?.name || '';
    }).filter(Boolean);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `You are an expert candle maker and fragrance blender. I'm creating a candle and want to combine these fragrances: ${selectedFragranceDetails.join(', ')}.

Please provide your analysis in this EXACT JSON format (no markdown, pure JSON):
{
  "compatibility": "How well do these scents work together (1-2 sentences)",
  "ratios": [
    { "fragrance": "${fragranceNames[0] || ''}", "percent": 50 },
    { "fragrance": "${fragranceNames[1] || ''}", "percent": 30 }
  ],
  "scentProfile": "What the final blend will smell like (1-2 sentences)",
  "vibe": "3-4 words separated by • describing the mood (e.g., Warm • Cozy • Inviting)",
  "style": "Brief style description (e.g., Holiday comfort, Spa retreat)",
  "description": "2-3 sentence description of this candle blend",
  "season": "Best season/occasion for this blend",
  "nameIdeas": ["Creative Name 1", "Creative Name 2", "Creative Name 3"]
}

IMPORTANT:
- The "ratios" array must include ALL ${fragranceNames.length} fragrances with exact names: ${fragranceNames.join(', ')}
- Percentages must total exactly 100%
- Return ONLY the JSON object, no other text` }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Try to parse as JSON
      let parsedResponse = null;
      try {
        // Try to extract JSON from response (handle markdown code blocks)
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
        parsedResponse = JSON.parse(jsonStr);
      } catch (e) {
        console.log('Failed to parse AI response as JSON, using text format');
      }

      // Store both the parsed data and display text
      if (parsedResponse) {
        // Format for display
        let displayText = `**Compatibility:** ${parsedResponse.compatibility}\n\n`;
        displayText += `**Suggested Ratios:**\n`;
        parsedResponse.ratios?.forEach(r => {
          displayText += `• ${r.fragrance}: ${r.percent}%\n`;
        });
        displayText += `\n**Scent Profile:** ${parsedResponse.scentProfile}\n`;
        displayText += `\n**Vibe:** ${parsedResponse.vibe}\n`;
        displayText += `\n**Style:** ${parsedResponse.style}\n`;
        displayText += `\n**Description:** ${parsedResponse.description}\n`;
        displayText += `\n**Best For:** ${parsedResponse.season}\n`;
        displayText += `\n**Name Ideas:** ${parsedResponse.nameIdeas?.join(', ') || 'N/A'}`;

        setAiResponse(displayText);
        // Store parsed data for recipe creation
        setAiResponse(prev => ({ text: displayText, data: parsedResponse }));
      } else {
        setAiResponse({ text: responseText, data: null });
      }
    } catch (error) {
      console.error("Error getting AI advice:", error);
      setAiResponse({ text: `Error: ${error.message}\n\nPlease check your API key is valid.`, data: null });
    } finally {
      setAiLoading(false);
    }
  };

  // Save API key to localStorage and Supabase
  const saveApiKey = async (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setShowApiKeyInput(false);

    // Sync to Supabase
    try {
      await supabase.from('settings').upsert([{ id: 'app_settings', gemini_api_key: key }], { onConflict: 'id' });
    } catch (error) {
      console.warn('Failed to sync API key to Supabase:', error);
    }
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
        costPerUnit: Math.round((m.packageCost / m.packageSize) * 100) / 100
      })),
      fragrances: fragrances.filter(f => !f.archived).map(f => {
        // Calculate total oz from per-size quantities only (no legacy fallback)
        const quantities = f.quantities || {};
        const totalOz = Object.entries(quantities).reduce((sum, [sz, qty]) => sum + ((qty || 0) * parseFloat(sz)), 0);
        // Include breakdown by size for better AI context
        const stockBySize = Object.entries(quantities)
          .filter(([_, qty]) => qty > 0)
          .map(([sz, qty]) => `${qty}x ${sz}oz`)
          .join(', ') || 'none';
        return { name: f.name, type: f.type, vendor: f.vendor, totalOz: Math.round(totalOz * 10) / 10, stockBySize, maxLoad: f.maxLoad };
      }),
      recipes: recipes.filter(r => !r.archived).map(r => ({
        name: r.name, vibe: r.vibe, foLoad: r.foLoad, components: r.components
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

  // AI Batch Instructions Generator (with conversation history)
  const generateBatchInstructions = async (prompt) => {
    if (!prompt.trim() || instructionsAiLoading) return;

    if (!geminiApiKey) {
      setInstructionsConversation(prev => [...prev,
        { role: 'user', content: prompt },
        { role: 'model', content: "Please set your Google Gemini API key first. Go to the Chat panel and click the key icon." }
      ]);
      setInstructionsAiPrompt('');
      return;
    }

    // Add user message to conversation
    const userMessage = { role: 'user', content: prompt };
    setInstructionsConversation(prev => [...prev, userMessage]);
    setInstructionsAiPrompt('');
    setInstructionsAiLoading(true);

    // Build inventory context for AI
    const inventoryContext = {
      materials: materials.map(m => ({
        name: m.name, category: m.category, qtyOnHand: m.qtyOnHand, unit: m.unit,
        costPerUnit: Math.round((m.packageCost / m.packageSize) * 100) / 100
      })),
      fragrances: fragrances.filter(f => !f.archived).map(f => {
        const quantities = f.quantities || {};
        const totalOz = Object.entries(quantities).reduce((sum, [sz, qty]) => sum + ((qty || 0) * parseFloat(sz)), 0);
        return { name: f.name, type: f.type, vendor: f.vendor, totalOz: Math.round(totalOz * 10) / 10, maxLoad: f.maxLoad };
      }),
      recipes: recipes.filter(r => !r.archived).map(r => ({
        name: r.name, vibe: r.vibe, style: r.style, description: r.description,
        wax: r.wax, wick: r.wick, foLoad: r.foLoad,
        components: r.components
      }))
    };

    const systemPrompt = `You are a master candle maker assistant for "Light By Dawn" candle business. You help with candle making questions, batch instructions, troubleshooting, and general candle business advice.

You have access to their inventory and recipes:
${JSON.stringify(inventoryContext, null, 2)}

IMPORTANT: Recipes define only the fragrance blend (components), wax type, wick type, and fragrance load percentage. They do NOT specify a container or size - the user specifies what size/container they want when requesting batch instructions. Any recipe can be made in any container size.

RESPONSE FORMAT:
- For batch instruction requests (e.g., "How do I make 12 4oz candles" or "make 8 Christmas Orchard 6oz"), respond with a JSON object in the EXACT format shown below
- The user specifies the quantity and size in their request - use those values
- If the user doesn't specify a size, default to 9oz
- For follow-up questions, modifications, or general questions, respond in plain conversational text
- Be helpful, friendly, and knowledgeable about candle making

When providing JSON batch instructions, you MUST use this EXACT format (no markdown, pure JSON):
{
  "title": "12 Coastal Luxe 9oz Candles",
  "recipeName": "Coastal Luxe",
  "recipeVibe": "Fresh ocean breeze with warm undertones",
  "quantity": 12,
  "size": 9,
  "foLoad": 10,
  "ingredients": [
    { "item": "Golden Brands 464 Soy Wax", "amount": "6.8 lbs", "amountOz": 108.0, "amountMl": 3195, "amountGrams": 3062, "notes": "Main wax base" }
  ],
  "fragranceBreakdown": [
    { "name": "Ocean Breeze", "percent": 55, "amountOz": 5.94, "amountMl": 176, "amountGrams": 168 }
  ],
  "supplies": [
    { "item": "9oz Straight Side Jar", "quantity": 12, "notes": "Clean and pre-heat" }
  ],
  "steps": [
    { "step": 1, "title": "Prepare Workspace", "description": "Set up your pouring station with all materials within reach. Ensure containers are clean and at room temperature.", "tips": ["Work in a well-ventilated area", "Cover surfaces to protect from spills"], "duration": "10 minutes" },
    { "step": 2, "title": "Melt Wax", "description": "Add wax to double boiler and heat to 180-185°F. Stir occasionally until fully melted.", "tips": ["Use a thermometer for accuracy", "Never leave wax unattended"], "duration": "20-30 minutes" },
    { "step": 3, "title": "Prepare Containers", "description": "While wax melts, center and secure wicks in each container using wick stickers or hot glue.", "tips": ["Use wick centering tools", "Double-check wick is straight"], "duration": "10 minutes" },
    { "step": 4, "title": "Add Fragrance", "description": "Remove wax from heat at 180-185°F and immediately add fragrance oil. Stir gently for 2 full minutes to ensure proper binding.", "tips": ["Add fragrance while wax is still hot for best scent throw", "Stir thoroughly but gently"], "duration": "5 minutes" },
    { "step": 5, "title": "Pour Candles", "description": "Let wax cool to 135-145°F, then pour slowly into prepared containers, leaving 1/2 inch headspace.", "tips": ["Pour slowly to minimize air bubbles", "Save some wax for top-off"], "duration": "15-20 minutes" },
    { "step": 6, "title": "Cool and Cure", "description": "Let candles cool undisturbed for 24 hours, then cure for 1-2 weeks before burning.", "tips": ["Don't move while cooling", "Patience improves scent throw"], "duration": "24+ hours" }
  ],
  "temperatures": {
    "meltTemp": "180-185°F",
    "addFragrance": "180-185°F",
    "pourTemp": "135-145°F"
  },
  "cureTime": "1-2 weeks",
  "estimatedTime": "1.5-2 hours active, plus cooling",
  "warnings": ["Never leave melting wax unattended", "Keep water away from hot wax", "Work in ventilated area"],
  "proTips": ["Pre-heat jars slightly for better adhesion", "Pour slowly to minimize air bubbles", "Keep detailed batch notes"]
}

CRITICAL: Each step MUST have these exact fields: "step" (number), "title" (short name), "description" (detailed instructions), "tips" (array of strings), "duration" (time estimate).
Calculate all amounts precisely based on batch size. Provide measurements in oz, ml, and grams.`;

    // Build conversation history for Gemini
    const conversationHistory = instructionsConversation.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...conversationHistory, { role: "user", parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Try to parse as JSON for structured batch instructions
      let parsedData = null;

      // First, try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          parsedData = JSON.parse(jsonMatch[1].trim());
        } catch (e) {
          // Failed to parse code block content
        }
      }

      // If no code block, try to find raw JSON object in the response
      if (!parsedData) {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*"title"[\s\S]*"steps"[\s\S]*\}/);
        if (jsonObjectMatch) {
          try {
            parsedData = JSON.parse(jsonObjectMatch[0]);
          } catch (e) {
            // Failed to parse
          }
        }
      }

      // Last resort: try parsing the whole thing after stripping markdown
      if (!parsedData) {
        let cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        try {
          parsedData = JSON.parse(cleanedText);
        } catch (e) {
          // Not JSON, treat as conversational text
        }
      }

      // Add AI response to conversation
      const aiMessage = {
        role: 'model',
        content: responseText,
        data: parsedData // Will be null for text responses
      };
      setInstructionsConversation(prev => [...prev, aiMessage]);

      // Also set the latest structured response for the save button
      if (parsedData) {
        setInstructionsAiResponse({ success: true, data: parsedData, rawPrompt: prompt });
      }
    } catch (error) {
      console.error("Instructions AI error:", error);
      setInstructionsConversation(prev => [...prev, { role: 'model', content: `Error: ${error.message}` }]);
    } finally {
      setInstructionsAiLoading(false);
    }
  };

  // Clear conversation and start fresh
  const clearInstructionsConversation = () => {
    setInstructionsConversation([]);
    setInstructionsAiResponse(null);
    setCurrentChatId(null);
  };

  // Save current chat session
  const saveCurrentChat = () => {
    if (instructionsConversation.length === 0) return;

    // Generate title from first user message
    const firstUserMsg = instructionsConversation.find(m => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '') : 'Untitled Chat';

    if (currentChatId) {
      // Update existing chat
      setSavedChats(prev => prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: instructionsConversation, updatedAt: new Date().toISOString() }
          : chat
      ));
    } else {
      // Create new chat
      const newChat = {
        id: `CHAT-${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: instructionsConversation
      };
      setSavedChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    }
  };

  // Load a saved chat
  const loadChat = (chat) => {
    setInstructionsConversation(chat.messages);
    setCurrentChatId(chat.id);
    setInstructionsAiResponse(null);
  };

  // Delete a saved chat
  const deleteChat = (id) => {
    const item = savedChats.find(c => c.id === id);
    if (!confirm(`Delete chat "${item?.title || 'Untitled'}"? This cannot be undone.`)) return;
    setSavedChats(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  // Save AI-generated instructions
  const saveInstructions = (instructionData, customTitle) => {
    const newInstruction = {
      id: `INS-${Date.now()}`,
      title: customTitle || instructionData.title || 'Untitled Instructions',
      createdAt: new Date().toISOString(),
      prompt: instructionData.rawPrompt || '',
      data: instructionData.data || null,
      text: instructionData.text || null
    };
    setSavedInstructions(prev => [newInstruction, ...prev]);
    setInstructionsAiResponse(null);
    setInstructionsAiPrompt('');
  };

  // Delete saved instructions
  const deleteInstruction = (id) => {
    const item = savedInstructions.find(i => i.id === id);
    if (!confirm(`Delete instruction "${item?.title || 'Untitled'}"? This cannot be undone.`)) return;
    setSavedInstructions(prev => prev.filter(i => i.id !== id));
    if (viewingInstruction?.id === id) {
      setViewingInstruction(null);
    }
  };

  // Print saved instruction
  const printInstruction = (instruction) => {
    const data = instruction.data;
    const printWindow = window.open('', '_blank');

    let ingredientsHtml = '';
    if (data?.ingredients?.length > 0) {
      ingredientsHtml = `
        <h2>Ingredients</h2>
        <table>
          <tr><th>Item</th><th>Amount</th><th>Notes</th></tr>
          ${data.ingredients.map(i => `<tr><td>${i.item}</td><td>${i.amount}</td><td>${i.notes || ''}</td></tr>`).join('')}
        </table>
      `;
    }

    let fragrancesHtml = '';
    if (data?.fragranceBreakdown?.length > 0) {
      fragrancesHtml = `
        <h2>Fragrance Breakdown</h2>
        <table>
          <tr><th>Fragrance</th><th>%</th><th>Amount (oz)</th></tr>
          ${data.fragranceBreakdown.map(f => `<tr><td>${f.name}</td><td>${f.percent}%</td><td>${f.amountOz} oz</td></tr>`).join('')}
        </table>
      `;
    }

    let suppliesHtml = '';
    if (data?.supplies?.length > 0) {
      suppliesHtml = `
        <h2>Supplies</h2>
        <table>
          <tr><th>Item</th><th>Qty</th><th>Notes</th></tr>
          ${data.supplies.map(s => `<tr><td>${s.item}</td><td>${s.quantity}</td><td>${s.notes || ''}</td></tr>`).join('')}
        </table>
      `;
    }

    let stepsHtml = '';
    if (data?.steps?.length > 0) {
      stepsHtml = `
        <h2>Instructions</h2>
        ${data.steps.map(s => `
          <div class="step">
            <div class="step-header">
              <span class="step-num">${s.step}</span>
              <span class="step-title">${s.title}</span>
              <span class="step-duration">${s.duration || ''}</span>
            </div>
            <p>${s.description}</p>
            ${s.tips?.length > 0 ? `<ul class="tips">${s.tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      `;
    }

    let warningsHtml = '';
    if (data?.warnings?.length > 0) {
      warningsHtml = `
        <h2>⚠️ Safety Warnings</h2>
        <ul>${data.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
      `;
    }

    let proTipsHtml = '';
    if (data?.proTips?.length > 0) {
      proTipsHtml = `
        <h2>💡 Pro Tips</h2>
        <ul>${data.proTips.map(t => `<li>${t}</li>`).join('')}</ul>
      `;
    }

    printWindow.document.write(`
      <html>
      <head>
        <title>${instruction.title} - Light By Dawn</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #1a0a1e; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 28px; margin-bottom: 4px; border-bottom: 3px solid #1a0a1e; padding-bottom: 8px; }
          .subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
          h2 { font-size: 18px; margin: 24px 0 12px; border-bottom: 2px solid #ddd; padding-bottom: 4px; }
          .meta { display: flex; gap: 24px; margin-bottom: 20px; padding: 16px; background: #f8f8f8; border-radius: 8px; }
          .meta-item { text-align: center; }
          .meta-label { font-size: 11px; color: #666; text-transform: uppercase; }
          .meta-value { font-size: 24px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; font-size: 12px; text-transform: uppercase; }
          .step { margin: 16px 0; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
          .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
          .step-num { width: 28px; height: 28px; background: #1a0a1e; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
          .step-title { font-weight: 600; font-size: 16px; flex: 1; }
          .step-duration { color: #666; font-size: 13px; }
          .tips { background: #f0f8ff; padding: 12px 12px 12px 28px; border-radius: 6px; margin-top: 8px; }
          .tips li { color: #0066cc; font-size: 13px; margin: 4px 0; }
          .checkbox { width: 14px; height: 14px; border: 2px solid #1a0a1e; display: inline-block; margin-right: 8px; vertical-align: middle; }
          @media print { body { padding: 0; } .step { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>${data?.title || instruction.title}</h1>
        <div class="subtitle">Light By Dawn • ${new Date(instruction.createdAt).toLocaleDateString()} • ${data?.recipeVibe || ''}</div>

        <div class="meta">
          <div class="meta-item">
            <div class="meta-label">Quantity</div>
            <div class="meta-value">${data?.quantity || '-'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Size</div>
            <div class="meta-value">${data?.size || '-'} oz</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">FO Load</div>
            <div class="meta-value">${data?.foLoad || '-'}%</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Est. Time</div>
            <div class="meta-value" style="font-size: 16px;">${data?.estimatedTime || '-'}</div>
          </div>
        </div>

        ${ingredientsHtml}
        ${fragrancesHtml}
        ${suppliesHtml}
        ${stepsHtml}
        ${warningsHtml}
        ${proTipsHtml}

        <div style="margin-top: 32px; padding-top: 16px; border-top: 2px solid #ddd;">
          <h2>Batch Notes</h2>
          <div style="border: 1px solid #ddd; min-height: 120px; border-radius: 8px;"></div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Edit saved instruction - load it back into conversation
  const editInstruction = (instruction) => {
    // Clear current conversation and load the saved instruction as context
    const newConversation = [];

    // Add original prompt if available
    if (instruction.prompt) {
      newConversation.push({ role: 'user', content: instruction.prompt });
    }

    // Add the AI response with the instruction data
    if (instruction.data) {
      newConversation.push({
        role: 'model',
        content: JSON.stringify(instruction.data),
        data: instruction.data
      });
    } else if (instruction.text) {
      newConversation.push({ role: 'model', content: instruction.text });
    }

    setInstructionsConversation(newConversation);
    setViewingInstruction(null);

    // Set the response so UI shows the instruction card
    if (instruction.data) {
      setInstructionsAiResponse({ success: true, data: instruction.data, rawPrompt: instruction.prompt || '' });
    }
  };

  // Unit converter functions
  const convertUnits = (value, fromUnit) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return { oz: '', ml: '', g: '' };

    // Conversion factors (for fragrance oils/wax - approximate)
    // 1 oz = 29.5735 ml, 1 oz fragrance oil ≈ 28.35g (varies by density)
    let oz, ml, g;

    if (fromUnit === 'oz') {
      oz = num;
      ml = num * 29.5735;
      g = num * 28.35; // approximate for fragrance oils
    } else if (fromUnit === 'ml') {
      oz = num / 29.5735;
      ml = num;
      g = num * 0.96; // approximate density for oils
    } else if (fromUnit === 'g') {
      oz = num / 28.35;
      ml = num / 0.96;
      g = num;
    }

    return {
      oz: oz.toFixed(2),
      ml: ml.toFixed(1),
      g: g.toFixed(1)
    };
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
        size: 9,
        maxCanMake: w.maxQty,
        components: w.recipe.components,
        vibe: w.recipe.vibe
      }))
    };

    // Calculate costs and potential profits for each recipe (using 9oz as default)
    const recipeEconomics = recipes.map(recipe => {
      try {
        const defaultSize = 9;
        const batchObj = {
          recipe: recipe.name,
          quantity: 12,
          size: defaultSize,
          foLoad: (recipe.foLoad || 10) / 100,
          waxCostPerOz: 0.206,
          containerCost: 2.00,
          wickCost: 0.13,
          labelCost: 0.03,
          packagingCost: 0.74,
          avgFoCost: 1.97,
          retailPrice: 24.00
        };

        const calc = calculateBatch(batchObj);
        const canMake = whatCanIMake.find(w => w.recipe.name === recipe.name);

        return {
          name: recipe.name,
          size: defaultSize,
          costPerCandle: (calc?.totalCostPerCandle || 0).toFixed(2),
          suggestedPrice: batchObj.retailPrice.toFixed(2),
          profitPerCandle: (calc?.profitPerCandle || 0).toFixed(2),
          profitMargin: batchObj.retailPrice > 0 ? (((calc?.profitPerCandle || 0) / batchObj.retailPrice) * 100).toFixed(1) : '0.0',
          maxCanMake: canMake?.maxQty || 0
        };
      } catch (e) {
        return { name: recipe.name, size: 9, costPerCandle: '0.00', suggestedPrice: '0.00', profitPerCandle: '0.00', profitMargin: '0.0', maxCanMake: 0 };
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

        /* Base responsive utilities */
        .mobile-hide { display: block; }
        .mobile-show { display: none; }
        .desktop-sidebar { display: flex; }

        /* Tablet responsive styles */
        @media (max-width: 1024px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important; }
          .batch-builder-grid { grid-template-columns: 1fr !important; }
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-hide { display: none !important; }
          .mobile-show { display: block !important; }
          .logo-icon { width: 36px !important; height: 36px !important; }
          .logo-icon svg { width: 20px !important; height: 20px !important; }
          .app-title { font-size: 18px !important; }
          .app-subtitle { font-size: 10px !important; letter-spacing: 1px !important; }

          .sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh !important;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 260px !important;
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
          .desktop-sidebar { display: none !important; }
          .main-content { padding: 12px !important; }
          .header-batch-info { display: none !important; }

          /* Header responsive */
          .app-header { padding: 12px 16px !important; }

          /* Page header responsive */
          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
          }
          .page-header-controls {
            flex-wrap: wrap !important;
            width: 100% !important;
            gap: 8px !important;
          }
          .page-header-controls select {
            flex: 1 1 45% !important;
            min-width: 120px !important;
            font-size: 12px !important;
            padding: 8px 10px !important;
          }
          .page-header-controls button {
            flex: 1 1 45% !important;
            justify-content: center !important;
            font-size: 12px !important;
            padding: 8px 12px !important;
          }
          .page-title { font-size: 22px !important; margin-bottom: 4px !important; }
          .page-subtitle { font-size: 13px !important; }

          /* Stats cards responsive */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .stat-card {
            padding: 14px !important;
            border-radius: 12px !important;
          }
          .stat-card svg { width: 20px !important; height: 20px !important; margin-bottom: 8px !important; }
          .stat-value { font-size: 20px !important; }
          .stat-label { font-size: 10px !important; }

          /* Two column grid to single column */
          .two-col-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Batch builder grid */
          .batch-builder-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Widget cards responsive */
          .widget-card { padding: 16px !important; border-radius: 12px !important; }
          .widget-title { font-size: 15px !important; }
          .widget-title svg { width: 18px !important; height: 18px !important; }

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
          .table-wrapper {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            margin: 0 -12px !important;
            padding: 0 12px !important;
          }
          .responsive-table { min-width: 600px !important; }
          .responsive-table th,
          .responsive-table td {
            padding: 10px 12px !important;
            font-size: 12px !important;
          }

          /* Grid cards responsive */
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          /* Recipe/Fragrance cards */
          .card-item {
            padding: 14px !important;
            border-radius: 12px !important;
          }
          .card-title { font-size: 15px !important; }
          .card-subtitle { font-size: 11px !important; }

          /* Form inputs responsive */
          .form-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .form-row { flex-direction: column !important; gap: 12px !important; }
          .form-input { font-size: 14px !important; padding: 10px 12px !important; }
          .form-label { font-size: 12px !important; }

          /* Modal responsive */
          .modal-overlay { padding: 12px !important; }
          .modal-content {
            max-width: 100% !important;
            max-height: 90vh !important;
            border-radius: 16px !important;
            padding: 16px !important;
          }
          .modal-header { font-size: 18px !important; margin-bottom: 16px !important; }

          /* Buttons responsive */
          .btn-group {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .btn-group button {
            flex: 1 1 calc(50% - 4px) !important;
            min-width: 100px !important;
            font-size: 12px !important;
            padding: 10px 12px !important;
          }

          /* Instructions page responsive */
          .instructions-layout {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .instructions-sidebar {
            width: 100% !important;
            max-height: none !important;
            order: 2 !important;
          }
          .instructions-main { order: 1 !important; }
          .ai-chat-container { display: none !important; }
          .chat-input-row { flex-direction: column !important; gap: 8px !important; }
          .chat-input { font-size: 14px !important; }
          .chat-message { padding: 12px !important; font-size: 13px !important; }
          .instruction-card { max-width: 100% !important; overflow-x: hidden !important; }
          .instruction-card-header { flex-direction: column !important; align-items: flex-start !important; }
          .instruction-card-header button { width: 100% !important; justify-content: center !important; }
          .temp-guide { flex-direction: column !important; }
          .temp-guide > div { min-width: auto !important; }
          .warnings-tips-grid { grid-template-columns: 1fr !important; }

          /* Shopping list responsive */
          .shopping-summary {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .shopping-item {
            flex-wrap: wrap !important;
            padding: 10px !important;
          }

          /* Pricing page responsive */
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-card { padding: 16px !important; }

          /* Inventory page responsive */
          .inventory-recipe-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .inventory-recipe-grid > div {
            padding: 16px !important;
          }

          /* AI chat panel responsive */
          .ai-chat-panel {
            width: calc(100% - 24px) !important;
            right: 12px !important;
            bottom: 12px !important;
            max-height: 70vh !important;
          }

          /* Converter section */
          .converter-section { padding: 12px !important; }
          .converter-inputs { flex-direction: column !important; gap: 8px !important; }

          /* Mobile table edit column */
          .mobile-edit-col { display: table-cell !important; }
          .desktop-edit-col { display: none !important; }
          .mobile-edit-th { display: table-cell !important; }
          .desktop-edit-th { display: none !important; }
        }

        /* Desktop: hide mobile edit column, show desktop */
        .mobile-edit-col { display: none; }
        .desktop-edit-col { display: table-cell; }
        .mobile-edit-th { display: none; }
        .desktop-edit-th { display: table-cell; }

        /* Small mobile responsive */
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-card { padding: 12px !important; }
          .stat-value { font-size: 18px !important; }
          .page-title { font-size: 20px !important; }
          .btn-group button { flex: 1 1 100% !important; }
          .page-header-controls select,
          .page-header-controls button { flex: 1 1 100% !important; }
        }
      `}</style>
      
      {/* Header */}
      <header className="app-header" style={{ background: 'linear-gradient(90deg, rgba(255,107,107,0.15) 0%, rgba(254,202,87,0.1) 50%, rgba(255,159,243,0.15) 100%)', borderBottom: '1px solid rgba(255,159,107,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer', padding: '8px' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon" style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(255,107,107,0.3)', flexShrink: 0 }}>
            <Flame size={28} color="#1a0a1e" />
          </div>
          <div>
            <h1 className="app-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Light By Dawn</h1>
            <p className="app-subtitle" style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>Candle Business System</p>
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
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Your candle business at a glance</p>
                </div>
                <button className="mobile-hide" onClick={resetAllData} style={{ ...btnSecondary, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}><RotateCcw size={16} /> Reset All Data</button>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Batches', value: stats.totalBatches, icon: Box, color: '#ff6b6b' },
                  { label: 'Candles Made', value: stats.totalCandles, icon: Flame, color: '#feca57' },
                  { label: 'Investment', value: formatCurrency(stats.totalInvestment), icon: DollarSign, color: '#ff9ff3' },
                  { label: 'Materials Value', value: formatCurrency(materials.reduce((sum, m) => sum + (m.packageCost / m.packageSize * m.qtyOnHand), 0)), icon: Package, color: '#feca57' },
                  { label: 'Fragrance Value', value: formatCurrency(fragranceBottles.filter(b => b.status !== 'archived').reduce((sum, bottle) => { const oz = calculateNetOzRemaining(bottle) || 0; const frag = fragrances.find(f => f.name === bottle.fragranceName); const price = frag ? calculateWeightedPricePerOz(frag.prices, frag.quantities) : (bottle.purchasePriceTotal / bottle.purchaseSizeOz || 0); return sum + (oz * price); }, 0)), icon: Droplets, color: '#74b9ff' },
                  { label: 'Low Stock', value: lowStockItems.length, icon: AlertTriangle, color: lowStockItems.length > 0 ? '#ff6b6b' : '#55efc4' },
                  { label: 'Recipes Ready', value: `${whatCanIMake.filter(w => w.maxQty >= 12).length} / ${whatCanIMake.length}`, icon: CheckCircle, color: '#55efc4' },
                  { label: 'Pending', value: `${stats.pendingBatches} batches`, icon: ShoppingCart, color: '#a29bfe' },
                ].map((stat, i) => (
                  <div className="stat-card" key={i} style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <stat.icon size={22} color={stat.color} style={{ marginBottom: '10px' }} />
                    <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#fce4d6', marginBottom: '4px' }}>{stat.value}</div>
                    <div className="stat-label" style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Low Stock Alert Widget */}
                <div className="widget-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="widget-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} color="#ff6b6b" /> Low Stock Alert
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
                <div className="widget-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="widget-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="#55efc4" /> Ready to Make
                    </h3>
                    <button onClick={() => setActiveTab('inventory')} style={{ fontSize: '12px', color: '#feca57', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {whatCanIMake.slice(0, 5).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: item.maxQty >= 12 ? 'rgba(85,239,196,0.1)' : item.maxQty > 0 ? 'rgba(254,202,87,0.1)' : 'rgba(255,107,107,0.1)', borderRadius: '8px', border: `1px solid ${item.maxQty >= 12 ? 'rgba(85,239,196,0.2)' : item.maxQty > 0 ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)'}` }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.recipe.name}</span>
                          <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginLeft: '8px' }}>9oz</span>
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
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Batch Builder</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Build multiple batches and export to shopping list</p>
                </div>
                <div className="btn-group page-header-controls" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setWizardStep(1); setWizardData({ selectedBottles: [], recipe: null, quantity: 12, size: 9, container: '', wick: '', label: '', packaging: '', foLoad: 0.10, retailPrice: 24.00 }); setShowBatchWizard(true); }} style={{ ...btnSecondary, color: '#ff9ff3', borderColor: 'rgba(255,159,243,0.3)' }}><Scale size={16} /> Batch Wizard</button>
                  <button onClick={resetCurrentBatch} style={btnSecondary}><RotateCcw size={16} /> Reset</button>
                  <button onClick={openLogBatchModal} style={{ ...btnSecondary, color: '#55efc4', borderColor: 'rgba(85,239,196,0.3)' }}><ClipboardList size={16} /> Log Batch</button>
                  <button onClick={() => {
                    // Build prompt from current batch and auto-trigger AI
                    const prompt = `How do I make ${currentBatch.quantity} ${currentBatch.recipe} ${currentBatch.size}oz candles?`;
                    clearInstructionsConversation(); // Start fresh conversation
                    setPendingAutoPrompt(prompt);
                    setActiveTab('instructions');
                  }} style={{ ...btnSecondary, color: '#a29bfe', borderColor: 'rgba(162,155,254,0.3)' }}><ScrollText size={16} /> Send to Instructions</button>
                  {batchList.some(b => b.id === currentBatch.id) ? (
                    <>
                      <button onClick={() => {
                        setBatchList(prev => prev.map(b => b.id === currentBatch.id ? { ...currentBatch } : b));
                        setCurrentBatch({ ...currentBatch, id: `BATCH-${Date.now()}` }); // Reset ID for new batch
                      }} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)' }}><Save size={18} /> Save Changes</button>
                      <button onClick={() => setCurrentBatch({ ...currentBatch, id: `BATCH-${Date.now()}` })} style={btnSecondary}><X size={16} /> Cancel Edit</button>
                    </>
                  ) : (
                    <button onClick={addBatchToList} style={btnPrimary}><Plus size={18} /> Add to List</button>
                  )}
                </div>
              </div>

              <div className="batch-builder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left - Inputs */}
                <div>
                  <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={20} color="#feca57" /> Batch Details</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Recipe</label>
                        <select value={currentBatch.recipe} onChange={e => {
                          const r = recipes.find(rec => rec.name === e.target.value);
                          if (r) {
                            // Calculate avg fragrance cost from recipe components
                            let avgFoCost = 0;
                            if (r.components?.length > 0) {
                              const costs = r.components.map(c => {
                                const frag = fragrances.find(f => f.name === c.fragrance);
                                const pricePerOz = getFragrancePricePerOz(frag);
                                return pricePerOz * (c.percent / 100);
                              });
                              avgFoCost = Math.round(costs.reduce((sum, c) => sum + c, 0) * 100) / 100;
                            }
                            setCurrentBatch({ ...currentBatch, recipe: r.name, foLoad: (r.foLoad || 10) / 100, avgFoCost });
                          }
                        }} style={inputStyle}>
                          {[...recipes].sort((a, b) => a.name.trim().localeCompare(b.name.trim())).map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
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
                          {/* Dye Information */}
                          {selectedRecipe.dyes && selectedRecipe.dyes.length > 0 && (
                            <div style={{ marginTop: '12px', borderTop: '1px solid rgba(162,155,254,0.2)', paddingTop: '12px' }}>
                              <div style={{ color: '#a29bfe', fontSize: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Droplets size={14} /> Color Dyes for {currentBatch.size}oz candles:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedRecipe.dyes.map((dye, i) => {
                                  // Support both old dropsPerOz and new amountPerOz formats
                                  const amount = dye.amountPerOz ?? dye.dropsPerOz ?? 0;
                                  const unit = dye.unit || 'drops';
                                  const amountPerCandle = amount * currentBatch.size;
                                  const totalAmount = amountPerCandle * currentBatch.quantity;
                                  const unitLabel = unit === 'drops' ? 'drops' : unit;
                                  return (
                                    <div key={i} style={{ padding: '8px 12px', background: 'rgba(162,155,254,0.15)', borderRadius: '6px', border: '1px solid rgba(162,155,254,0.2)' }}>
                                      <div style={{ fontWeight: 600, color: '#a29bfe', marginBottom: '4px' }}>{dye.name}</div>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.7)' }}>
                                        {amount} {unitLabel}/oz = <strong>{amountPerCandle.toFixed(1)}</strong> {unitLabel}/candle
                                      </div>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginTop: '2px' }}>
                                        Total for batch: <strong style={{ color: '#55efc4' }}>{totalAmount.toFixed(unit === 'drops' ? 0 : 2)}</strong> {unitLabel}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Material Selectors */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Materials</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Wax</label>
                            <select value={currentBatch.wax} onChange={e => { const m = materials.find(mat => mat.name === e.target.value); setCurrentBatch({ ...currentBatch, wax: e.target.value, waxCostPerOz: m ? Math.round(m.packageCost / m.packageSize / 16 * 100) / 100 : 0 }); }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="">Select wax...</option>
                              {materials.filter(m => m.category === 'Wax').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Container</label>
                            <select value={currentBatch.container} onChange={e => {
                              const m = materials.find(mat => mat.name === e.target.value);
                              // Use fillCapacity if available, otherwise detect from name
                              let detectedSize = currentBatch.size;
                              if (m?.fillCapacity) {
                                detectedSize = m.fillCapacity;
                              } else {
                                const sizeMatch = e.target.value.match(/(\d+(?:\.\d+)?)\s*oz/i);
                                if (sizeMatch) detectedSize = parseFloat(sizeMatch[1]);
                              }
                              setCurrentBatch({
                                ...currentBatch,
                                container: e.target.value,
                                containerCost: m ? Math.round(m.packageCost / m.packageSize * 100) / 100 : 0,
                                size: detectedSize
                              });
                            }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="">Select container...</option>
                              {materials.filter(m => m.category === 'Container').map(m => (
                                <option key={m.id} value={m.name}>
                                  {m.name}{m.fillCapacity ? ` (fills ${m.fillCapacity}oz)` : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Wick</label>
                            <select value={currentBatch.wick} onChange={e => { const m = materials.find(mat => mat.name === e.target.value); setCurrentBatch({ ...currentBatch, wick: e.target.value, wickCost: m ? Math.round(m.packageCost / m.packageSize * 100) / 100 : 0 }); }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="">Select wick...</option>
                              {materials.filter(m => m.category === 'Wick').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Label</label>
                            <select value={currentBatch.label} onChange={e => {
                              if (e.target.value === 'none') {
                                setCurrentBatch({ ...currentBatch, label: 'none', labelCost: 0 });
                              } else if (e.target.value === 'standard-vinyl') {
                                // Standard vinyl label price based on container size (brand + safety label)
                                const size = currentBatch.size || 9;
                                const labelCost = size <= 4 ? 0.08 : size <= 6 ? 0.10 : 0.12;
                                setCurrentBatch({ ...currentBatch, label: 'standard-vinyl', labelCost });
                              } else {
                                const m = materials.find(mat => mat.name === e.target.value);
                                setCurrentBatch({ ...currentBatch, label: e.target.value, labelCost: m ? Math.round(m.packageCost / m.packageSize * 100) / 100 : 0 });
                              }
                            }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="">Select label...</option>
                              <option value="none">No label ($0)</option>
                              <option value="standard-vinyl">Standard Vinyl (brand + safety)</option>
                              {materials.filter(m => m.category === 'Label').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Packaging</label>
                            <select value={currentBatch.packaging} onChange={e => { if (e.target.value === 'none') { setCurrentBatch({ ...currentBatch, packaging: 'none', packagingCost: 0 }); } else { const m = materials.find(mat => mat.name === e.target.value); setCurrentBatch({ ...currentBatch, packaging: e.target.value, packagingCost: m ? Math.round(m.packageCost / m.packageSize * 100) / 100 : 0 }); } }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="">Select packaging...</option>
                              <option value="none">No packaging ($0)</option>
                              {materials.filter(m => m.category === 'Packaging').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Fragrance</label>
                            <select value={currentBatch.fragranceOption} onChange={e => {
                              if (e.target.value === 'modify') {
                                // Copy recipe and open edit modal
                                const recipe = recipes.find(r => r.name === currentBatch.recipe);
                                if (recipe) {
                                  const newRecipe = { ...recipe, id: `RCP-${Date.now()}`, name: `${recipe.name} (Custom)` };
                                  setRecipeForm(newRecipe);
                                  setEditingRecipe(null);
                                  setShowRecipeModal(true);
                                }
                              } else {
                                setCurrentBatch({ ...currentBatch, fragranceOption: e.target.value });
                              }
                            }} style={{ ...inputStyle, padding: '8px', fontSize: '12px' }}>
                              <option value="recipe">Use Recipe</option>
                              <option value="modify">Modify Recipe...</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Stock Check - Full Breakdown */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${currentBatchStock.canMake ? 'rgba(85,239,196,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          {currentBatchStock.canMake ? <CheckCircle size={16} color="#55efc4" /> : <AlertTriangle size={16} color="#ff6b6b" />}
                          <span style={{ fontSize: '12px', fontWeight: 600, color: currentBatchStock.canMake ? '#55efc4' : '#ff6b6b' }}>
                            {currentBatchStock.canMake ? 'All materials in stock' : `${currentBatchStock.shortages.length} item(s) need ordering`}
                          </span>
                        </div>

                        {/* Shortages - Need to Order */}
                        {currentBatchStock.shortages.length > 0 && (
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '10px', color: '#ff6b6b', textTransform: 'uppercase', marginBottom: '6px' }}>Need to Order</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {currentBatchStock.shortages.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 8px', background: 'rgba(255,107,107,0.1)', borderRadius: '4px' }}>
                                  <span style={{ color: '#fce4d6' }}>{item.name}</span>
                                  <span style={{ color: '#ff6b6b' }}>Need {item.needed} {item.unit} (have {item.have}, order {item.toOrder})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* In Stock */}
                        {currentBatchStock.inStock.length > 0 && (
                          <div>
                            <div style={{ fontSize: '10px', color: '#55efc4', textTransform: 'uppercase', marginBottom: '6px' }}>In Stock</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {currentBatchStock.inStock.map((item, i) => (
                                <span key={i} style={{ fontSize: '10px', padding: '3px 6px', background: 'rgba(85,239,196,0.1)', borderRadius: '4px', color: 'rgba(252,228,214,0.7)' }}>
                                  {item.name}: {item.needed} {item.unit}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Quantity</label>
                          <input type="number" value={currentBatch.quantity} onChange={e => setCurrentBatch({ ...currentBatch, quantity: parseInt(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Fill Amount (oz)</label>
                          <input type="number" step="0.1" value={currentBatch.size} onChange={e => setCurrentBatch({ ...currentBatch, size: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Fragrance Load: {(currentBatch.foLoad * 100).toFixed(0)}%</label>
                        <input type="range" min="0.04" max="0.12" step="0.01" value={currentBatch.foLoad} onChange={e => setCurrentBatch({ ...currentBatch, foLoad: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#feca57' }} />
                      </div>

                      {/* Fill Breakdown - Gross vs Net */}
                      <div style={{ background: 'rgba(254,202,87,0.1)', border: '1px solid rgba(254,202,87,0.2)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Fill Breakdown (per candle)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12px' }}>
                          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ color: 'rgba(252,228,214,0.5)', fontSize: '10px' }}>Fill Amount</div>
                            <div style={{ fontWeight: 600, color: '#feca57' }}>{currentBatch.size} oz</div>
                          </div>
                          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ color: 'rgba(252,228,214,0.5)', fontSize: '10px' }}>Wax</div>
                            <div style={{ fontWeight: 600 }}>{(currentBatch.size * (1 - currentBatch.foLoad)).toFixed(2)} oz</div>
                          </div>
                          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ color: 'rgba(252,228,214,0.5)', fontSize: '10px' }}>Fragrance</div>
                            <div style={{ fontWeight: 600, color: '#ff9ff3' }}>{(currentBatch.size * currentBatch.foLoad).toFixed(2)} oz</div>
                          </div>
                        </div>
                        {/* Container info */}
                        {currentBatch.container && (() => {
                          const m = materials.find(mat => mat.name === currentBatch.container);
                          const containerSizeMatch = currentBatch.container.match(/(\d+(?:\.\d+)?)\s*oz/i);
                          const labelSize = containerSizeMatch ? parseFloat(containerSizeMatch[1]) : null;
                          if (m?.fillCapacity && labelSize) {
                            return (
                              <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(116,185,255,0.1)', borderRadius: '6px', fontSize: '11px', color: '#74b9ff' }}>
                                Container labeled {labelSize}oz, actual fill capacity: {m.fillCapacity}oz
                              </div>
                            );
                          }
                          return null;
                        })()}
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
                          <input type="number" step="0.01" value={Math.round(currentBatch[item.key] * 100) / 100} onChange={e => setCurrentBatch({ ...currentBatch, [item.key]: parseFloat(e.target.value) || 0 })} style={{ ...inputStyle, padding: '8px 12px', fontSize: '13px' }} />
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
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#55efc4' }}>Pricing & Margins</h3>

                    {/* Retail Price Input */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Retail Price</label>
                      <input type="number" step="0.01" value={currentBatch.retailPrice} onChange={e => setCurrentBatch({ ...currentBatch, retailPrice: parseFloat(e.target.value) || 0 })} style={{ ...inputStyle, padding: '12px', fontSize: '18px', fontWeight: 600, textAlign: 'center' }} />
                    </div>

                    {/* Quick Margin Buttons */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>Set by Target Margin</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[50, 60, 65, 70].map(margin => {
                          const targetPrice = Math.round(currentCalc.totalCostPerCandle / (1 - margin / 100) * 100) / 100;
                          const isSelected = Math.abs(currentBatch.retailPrice - targetPrice) < 0.01;
                          return (
                            <button key={margin} onClick={() => setCurrentBatch({ ...currentBatch, retailPrice: targetPrice })} style={{ flex: 1, padding: '8px 4px', background: isSelected ? 'rgba(85,239,196,0.3)' : 'rgba(0,0,0,0.3)', border: `1px solid ${isSelected ? 'rgba(85,239,196,0.6)' : 'rgba(85,239,196,0.3)'}`, borderRadius: '8px', color: isSelected ? '#55efc4' : '#fce4d6', cursor: 'pointer', fontSize: '12px' }}>
                              <div style={{ fontWeight: 600 }}>{margin}%</div>
                              <div style={{ fontSize: '10px', color: isSelected ? '#55efc4' : 'rgba(252,228,214,0.5)' }}>{formatCurrency(targetPrice)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Profit Display */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(85,239,196,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Profit per Candle</span>
                        <span style={{ fontWeight: 600, color: currentCalc.profitPerCandle > 0 ? '#55efc4' : '#ff6b6b' }}>{formatCurrency(currentCalc.profitPerCandle)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Profit Margin</span>
                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, background: currentCalc.profitMargin > 0.6 ? 'rgba(85,239,196,0.3)' : currentCalc.profitMargin > 0.4 ? 'rgba(254,202,87,0.3)' : 'rgba(255,107,107,0.3)', color: currentCalc.profitMargin > 0.6 ? '#55efc4' : currentCalc.profitMargin > 0.4 ? '#feca57' : '#ff6b6b' }}>{formatPercent(currentCalc.profitMargin)}</span>
                      </div>
                    </div>

                    {/* Suggested Wholesale Tiers */}
                    {currentCalc.totalCostPerCandle > 0 && (
                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(85,239,196,0.2)' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '8px', textTransform: 'uppercase' }}>Suggested Tier Pricing</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                          <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ color: 'rgba(252,228,214,0.5)' }}>Wholesale (10+)</div>
                            <div style={{ fontWeight: 600 }}>{formatCurrency(currentCalc.totalCostPerCandle / 0.50)}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>50% margin</div>
                          </div>
                          <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                            <div style={{ color: 'rgba(252,228,214,0.5)' }}>Bulk (50+)</div>
                            <div style={{ fontWeight: 600 }}>{formatCurrency(currentCalc.totalCostPerCandle / 0.65)}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>35% margin</div>
                          </div>
                        </div>
                      </div>
                    )}
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
                          {['Recipe', 'Qty', 'Size', 'Cost/Each', 'Batch Cost', 'Batch Profit', 'Actions'].map(h => (
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
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => {
                                    // Open batch instructions modal
                                    const recipe = recipes.find(r => r.name === b.recipe);
                                    const calc = calculateBatch(b);
                                    setBatchInstructions({ ...b, recipe: recipe, calc });
                                    setShowBatchInstructionsModal(true);
                                  }} style={{ background: 'rgba(85,239,196,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#55efc4', cursor: 'pointer' }} title="Print Instructions"><Printer size={14} /></button>
                                  <button onClick={() => {
                                    // Load batch into currentBatch for editing
                                    setCurrentBatch({ ...b });
                                    // Scroll to top of batch details
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#feca57', cursor: 'pointer' }} title="Edit"><Edit2 size={14} /></button>
                                  <button onClick={() => openQuickLogModal(b)} style={{ background: 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#a29bfe', cursor: 'pointer' }} title="Log Batch"><CheckCircle size={14} /></button>
                                  <button onClick={() => removeBatchFromList(b.id)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#ff6b6b', cursor: 'pointer' }} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Batch List Summary - Combined Materials */}
                  <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(254,202,87,0.1) 0%, rgba(255,159,107,0.05) 100%)', border: `2px solid ${batchListSummary.canMakeAll ? 'rgba(85,239,196,0.4)' : 'rgba(255,107,107,0.4)'}`, borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClipboardList size={18} color="#feca57" />
                        Combined Materials Summary
                      </h4>
                      <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '12px', background: batchListSummary.canMakeAll ? 'rgba(85,239,196,0.2)' : 'rgba(255,107,107,0.2)', color: batchListSummary.canMakeAll ? '#55efc4' : '#ff6b6b', fontWeight: 600 }}>
                        {batchListSummary.canMakeAll ? 'All In Stock' : `${batchListSummary.shortages.length} Items to Order`}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Need to Order */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#ff6b6b', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>Need to Order ({batchListSummary.shortages.length})</div>
                        {batchListSummary.shortages.length === 0 ? (
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', fontStyle: 'italic' }}>Everything in stock!</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                            {batchListSummary.shortages.map((item, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,107,107,0.1)', borderRadius: '6px', fontSize: '12px' }}>
                                <span style={{ color: '#fce4d6', fontWeight: 500 }}>{item.name}</span>
                                <span style={{ color: '#ff6b6b', fontSize: '11px' }}>
                                  Order {item.toOrder} {item.unit}
                                  <span style={{ color: 'rgba(252,228,214,0.4)', marginLeft: '4px' }}>(need {item.needed}, have {item.have})</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* In Stock */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#55efc4', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>In Stock ({batchListSummary.inStock.length})</div>
                        {batchListSummary.inStock.length === 0 ? (
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', fontStyle: 'italic' }}>No items in stock</div>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                            {batchListSummary.inStock.map((item, i) => (
                              <span key={i} style={{ padding: '6px 10px', background: 'rgba(85,239,196,0.1)', borderRadius: '6px', fontSize: '11px', color: 'rgba(252,228,214,0.8)' }}>
                                {item.name}: {item.needed} {item.unit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {batchListSummary.shortages.length > 0 && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,159,107,0.2)', display: 'flex', gap: '12px' }}>
                        <button onClick={() => {
                          // Copy shortages to clipboard
                          const text = batchListSummary.shortages.map(item => `${item.name}: Order ${item.toOrder} ${item.unit}`).join('\n');
                          navigator.clipboard.writeText(text);
                          alert('Shopping list copied to clipboard!');
                        }} style={{ ...btnSecondary, flex: 1 }}><Copy size={16} /> Copy Shortages</button>
                        <button onClick={() => setActiveTab('shopping')} style={{ ...btnPrimary, flex: 1 }}><ShoppingCart size={16} /> View Shopping List</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions Page */}
          {activeTab === 'instructions' && (
            <div style={{ overflow: 'hidden', maxWidth: '100%' }}>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Batch Instructions</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Ask the AI how to make candles and save detailed instructions</p>
                </div>
              </div>

              <div className="instructions-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* AI Conversation Section */}
                  <div className="ai-chat-container" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '500px', maxHeight: '70vh' }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px', background: 'rgba(255,159,107,0.1)', borderBottom: '1px solid rgba(255,159,107,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20} color="#a29bfe" />
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>AI Candle Making Assistant</h3>
                      </div>
                      {instructionsConversation.length > 0 && (
                        <button onClick={clearInstructionsConversation} style={{ ...btnSecondary, padding: '6px 12px', fontSize: '12px' }}>
                          <RotateCcw size={14} /> New Chat
                        </button>
                      )}
                    </div>

                    {/* Conversation Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {instructionsConversation.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(252,228,214,0.5)' }}>
                          <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                          <p style={{ fontSize: '14px', marginBottom: '8px' }}>Ask me how to make candles!</p>
                          <p style={{ fontSize: '12px' }}>I know your recipes, inventory, and candle-making best practices.</p>
                          {/* Quick prompts */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
                            {recipes.filter(r => !r.archived).slice(0, 4).map(r => (
                              <button
                                key={r.id}
                                onClick={() => setInstructionsAiPrompt(`How do I make 12 ${r.name} candles?`)}
                                style={{ padding: '8px 14px', background: 'rgba(162,155,254,0.15)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '20px', color: '#a29bfe', fontSize: '12px', cursor: 'pointer' }}
                              >
                                {r.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        instructionsConversation.map((msg, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            {msg.role === 'user' ? (
                              <div style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', color: '#1a0a1e', fontWeight: 500 }}>
                                {msg.content}
                              </div>
                            ) : msg.data ? (
                              // Structured batch instructions - full width card
                              <div className="instruction-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,159,107,0.2)', borderRadius: '16px', width: '100%', overflow: 'hidden' }}>
                                <div className="instruction-card-header" style={{ padding: '16px 20px', background: 'rgba(255,159,107,0.1)', borderBottom: '1px solid rgba(255,159,107,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                  <div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{msg.data.title}</h4>
                                    {msg.data.recipeVibe && <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>{msg.data.recipeVibe}</p>}
                                  </div>
                                  <button onClick={() => saveInstructions({ data: msg.data, rawPrompt: '' }, msg.data.title)} style={{ ...btnPrimary, padding: '8px 16px', fontSize: '13px' }}>
                                    <Save size={16} /> Save Instructions
                                  </button>
                                </div>
                                <div style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                                  {/* Quick Stats */}
                                  <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(255,159,107,0.08)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Quantity</div>
                                      <div style={{ fontSize: '24px', fontWeight: 700 }}>{msg.data.quantity}</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,159,107,0.08)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Size</div>
                                      <div style={{ fontSize: '24px', fontWeight: 700 }}>{msg.data.size}oz</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,159,107,0.08)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>FO Load</div>
                                      <div style={{ fontSize: '24px', fontWeight: 700 }}>{msg.data.foLoad}%</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,159,107,0.08)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Cure Time</div>
                                      <div style={{ fontSize: '16px', fontWeight: 600 }}>{msg.data.cureTime}</div>
                                    </div>
                                  </div>

                                  {/* Ingredients */}
                                  {msg.data.ingredients && (
                                    <div style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#feca57', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={16} /> Ingredients
                                      </div>
                                      {msg.data.ingredients.map((ing, j) => (
                                        <div key={j} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '3px solid rgba(254,202,87,0.4)', background: 'rgba(254,202,87,0.05)', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
                                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fce4d6', marginBottom: '6px' }}>{ing.item}</div>
                                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '13px', background: 'rgba(254,202,87,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#feca57', fontWeight: 600 }}>{ing.amountOz || ing.amount} oz</span>
                                            <span style={{ fontSize: '13px', background: 'rgba(116,185,255,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#74b9ff', fontWeight: 600 }}>{ing.amountMl} ml</span>
                                            <span style={{ fontSize: '13px', background: 'rgba(85,239,196,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#55efc4', fontWeight: 600 }}>{ing.amountGrams} g</span>
                                          </div>
                                          {ing.notes && <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginTop: '6px' }}>{ing.notes}</div>}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Fragrance breakdown */}
                                  {msg.data.fragranceBreakdown && msg.data.fragranceBreakdown.length > 0 && (
                                    <div style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#ff9ff3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Droplets size={16} /> Fragrance Blend
                                      </div>
                                      {msg.data.fragranceBreakdown.map((f, j) => (
                                        <div key={j} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '3px solid rgba(255,159,243,0.4)', background: 'rgba(255,159,243,0.05)', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fce4d6' }}>{f.name}</span>
                                            <span style={{ fontSize: '12px', background: 'rgba(255,159,243,0.2)', padding: '2px 8px', borderRadius: '10px', color: '#ff9ff3' }}>{f.percent}%</span>
                                          </div>
                                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '13px', background: 'rgba(254,202,87,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#feca57', fontWeight: 600 }}>{f.amountOz} oz</span>
                                            <span style={{ fontSize: '13px', background: 'rgba(116,185,255,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#74b9ff', fontWeight: 600 }}>{f.amountMl} ml</span>
                                            <span style={{ fontSize: '13px', background: 'rgba(85,239,196,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#55efc4', fontWeight: 600 }}>{f.amountGrams} g</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Temperature Guide */}
                                  {msg.data.temperatures && (
                                    <div className="temp-guide" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                      <div style={{ flex: 1, minWidth: '120px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Melt Wax</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#ff6b6b' }}>{msg.data.temperatures.meltTemp}</div>
                                      </div>
                                      <div style={{ flex: 1, minWidth: '120px', background: 'rgba(254,202,87,0.1)', border: '1px solid rgba(254,202,87,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Add Fragrance</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#feca57' }}>{msg.data.temperatures.addFragrance}</div>
                                      </div>
                                      <div style={{ flex: 1, minWidth: '120px', background: 'rgba(85,239,196,0.1)', border: '1px solid rgba(85,239,196,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Pour</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#55efc4' }}>{msg.data.temperatures.pourTemp}</div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Steps - Full display */}
                                  {msg.data.steps && (
                                    <div style={{ marginBottom: '20px' }}>
                                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#a29bfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ClipboardList size={16} /> Step-by-Step Instructions
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {msg.data.steps.map((s, j) => (
                                          <div key={j} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px', borderLeft: '3px solid #a29bfe' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#1a0a1e' }}>{s.step}</span>
                                                <span style={{ fontSize: '15px', fontWeight: 600 }}>{s.title}</span>
                                              </div>
                                              {s.duration && <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '10px' }}>{s.duration}</span>}
                                            </div>
                                            <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.8)', lineHeight: '1.5', margin: '0 0 0 36px' }}>{s.description}</p>
                                            {s.tips && s.tips.length > 0 && (
                                              <div style={{ marginTop: '8px', marginLeft: '36px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {s.tips.map((tip, ti) => (
                                                  <span key={ti} style={{ fontSize: '11px', color: '#55efc4', background: 'rgba(85,239,196,0.1)', padding: '3px 8px', borderRadius: '4px' }}>💡 {tip}</span>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Warnings & Pro Tips */}
                                  <div className="warnings-tips-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {msg.data.warnings && msg.data.warnings.length > 0 && (
                                      <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', padding: '14px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ff6b6b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <AlertTriangle size={14} /> Safety Warnings
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'rgba(252,228,214,0.8)', lineHeight: '1.6' }}>
                                          {msg.data.warnings.map((w, wi) => <li key={wi}>{w}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                    {msg.data.proTips && msg.data.proTips.length > 0 && (
                                      <div style={{ background: 'rgba(85,239,196,0.1)', border: '1px solid rgba(85,239,196,0.2)', borderRadius: '12px', padding: '14px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#55efc4', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <Sparkles size={14} /> Pro Tips
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'rgba(252,228,214,0.8)', lineHeight: '1.6' }}>
                                          {msg.data.proTips.map((t, ti) => <li key={ti}>{t}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Text response
                              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '85%', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>
                                {msg.content}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      {instructionsAiLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(252,228,214,0.5)' }}>
                          <RotateCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                          <span style={{ fontSize: '13px' }}>Thinking...</span>
                        </div>
                      )}
                      {/* Auto-scroll anchor */}
                      <div ref={conversationEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,159,107,0.15)', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          value={instructionsAiPrompt}
                          onChange={(e) => setInstructionsAiPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && generateBatchInstructions(instructionsAiPrompt)}
                          placeholder={instructionsConversation.length === 0 ? "How do I make 12 Coastal Luxe candles?" : "Ask a follow-up question..."}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {instructionsConversation.length > 0 && (
                          <button
                            onClick={saveCurrentChat}
                            style={{ ...btnSecondary, padding: '12px' }}
                            title={currentChatId ? "Update saved chat" : "Save chat"}
                          >
                            <Save size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => generateBatchInstructions(instructionsAiPrompt)}
                          disabled={instructionsAiLoading || !instructionsAiPrompt.trim()}
                          style={{ ...btnPrimary, opacity: instructionsAiLoading || !instructionsAiPrompt.trim() ? 0.5 : 1 }}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Viewing Saved Instruction */}
                  {viewingInstruction && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{ padding: '20px 24px', background: 'rgba(255,159,107,0.1)', borderBottom: '1px solid rgba(255,159,107,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{viewingInstruction.title}</h3>
                          <p style={{ color: 'rgba(252,228,214,0.5)', fontSize: '12px' }}>Saved on {new Date(viewingInstruction.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => {
                            const content = viewingInstruction.data ? JSON.stringify(viewingInstruction.data, null, 2) : viewingInstruction.text;
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`<html><head><title>${viewingInstruction.title}</title><style>body{font-family:Arial,sans-serif;padding:20px;}</style></head><body><h1>${viewingInstruction.title}</h1><pre>${content}</pre></body></html>`);
                            printWindow.document.close();
                            printWindow.print();
                          }} style={{ ...btnSecondary, padding: '8px 16px' }}><Printer size={16} /> Print</button>
                          <button onClick={() => setViewingInstruction(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', color: '#fce4d6', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                      </div>
                      <div style={{ padding: '24px' }}>
                        {viewingInstruction.data ? (
                          // Same rendering as AI response
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                              <div style={{ background: 'rgba(255,159,107,0.08)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase' }}>Quantity</div>
                                <div style={{ fontSize: '24px', fontWeight: 700 }}>{viewingInstruction.data.quantity}</div>
                              </div>
                              <div style={{ background: 'rgba(255,159,107,0.08)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase' }}>Size</div>
                                <div style={{ fontSize: '24px', fontWeight: 700 }}>{viewingInstruction.data.size} oz</div>
                              </div>
                              <div style={{ background: 'rgba(255,159,107,0.08)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase' }}>FO Load</div>
                                <div style={{ fontSize: '24px', fontWeight: 700 }}>{viewingInstruction.data.foLoad}%</div>
                              </div>
                              <div style={{ background: 'rgba(255,159,107,0.08)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase' }}>Cure Time</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{viewingInstruction.data.cureTime}</div>
                              </div>
                            </div>
                            {/* Steps summary */}
                            {viewingInstruction.data.steps && (
                              <div>
                                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Steps</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {viewingInstruction.data.steps.map((step, i) => (
                                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '12px' }}>
                                      <span style={{ background: '#a29bfe', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#1a0a1e', flexShrink: 0 }}>{step.step}</span>
                                      <div>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{step.title}</div>
                                        <div style={{ fontSize: '13px', color: 'rgba(252,228,214,0.7)' }}>{step.description}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>{viewingInstruction.text}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="instructions-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Unit Converter */}
                  <div className="converter-section" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <Scale size={18} color="#74b9ff" />
                      <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Unit Converter</h3>
                    </div>
                    <div className="converter-inputs" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="number"
                        value={converterValue}
                        onChange={(e) => setConverterValue(e.target.value)}
                        placeholder="Enter value"
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <select value={converterUnit} onChange={(e) => setConverterUnit(e.target.value)} style={{ ...inputStyle, width: '80px' }}>
                        <option value="oz">oz</option>
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                    {converterValue && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(convertUnits(converterValue, converterUnit)).map(([unit, val]) => (
                          <div key={unit} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: unit === converterUnit ? 'rgba(116,185,255,0.15)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: unit === converterUnit ? '1px solid rgba(116,185,255,0.3)' : '1px solid transparent' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{unit}</span>
                            <span style={{ fontWeight: 600, color: unit === converterUnit ? '#74b9ff' : '#fce4d6' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '12px' }}>
                      * Approximate for fragrance oils/wax (density ≈ 0.96 g/ml)
                    </p>
                  </div>

                  {/* Saved Chats */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={20} color="#a29bfe" />
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Saved Chats</h3>
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{savedChats.length}</span>
                    </div>
                    {savedChats.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(252,228,214,0.4)' }}>
                        <MessageSquare size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
                        <p style={{ fontSize: '12px' }}>No saved chats yet</p>
                        <p style={{ fontSize: '11px', marginTop: '4px' }}>Click the save icon to save a conversation</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                        {savedChats.map(chat => (
                          <div
                            key={chat.id}
                            style={{
                              background: currentChatId === chat.id ? 'rgba(162,155,254,0.15)' : 'rgba(255,255,255,0.03)',
                              border: currentChatId === chat.id ? '1px solid rgba(162,155,254,0.3)' : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '10px',
                              padding: '10px 12px',
                              cursor: 'pointer'
                            }}
                            onClick={() => loadChat(chat)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 500, fontSize: '13px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>
                                  {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Delete this chat?')) deleteChat(chat.id);
                                }}
                                style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '5px', padding: '4px', color: '#ff6b6b', cursor: 'pointer', flexShrink: 0 }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saved Instructions */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#feca57" />
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Saved Instructions</h3>
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{savedInstructions.length}</span>
                    </div>
                    {savedInstructions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(252,228,214,0.4)' }}>
                        <ScrollText size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p style={{ fontSize: '13px' }}>No saved instructions yet</p>
                        <p style={{ fontSize: '12px', marginTop: '4px' }}>Generate instructions with AI and save them here</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                        {savedInstructions.map(ins => (
                          <div
                            key={ins.id}
                            style={{
                              background: viewingInstruction?.id === ins.id ? 'rgba(254,202,87,0.15)' : 'rgba(255,255,255,0.03)',
                              border: viewingInstruction?.id === ins.id ? '1px solid rgba(254,202,87,0.3)' : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '10px',
                              padding: '12px',
                              cursor: 'pointer'
                            }}
                            onClick={() => setViewingInstruction(ins)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{ins.title}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)' }}>
                                  {new Date(ins.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    printInstruction(ins);
                                  }}
                                  style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}
                                  title="Print"
                                >
                                  <Printer size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editInstruction(ins);
                                  }}
                                  style={{ background: 'rgba(85,239,196,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#55efc4', cursor: 'pointer' }}
                                  title="Edit in chat"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmModal({ type: 'instruction', id: ins.id, title: ins.title });
                                  }}
                                  style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#74b9ff' }}>{formatCurrency(
                    fragranceBottles.filter(b => b.status !== 'archived').reduce((sum, bottle) => {
                      const oz = calculateNetOzRemaining(bottle) || 0;
                      const frag = fragrances.find(f => f.name === bottle.fragranceName);
                      const price = frag ? calculateWeightedPricePerOz(frag.prices, frag.quantities) : (bottle.purchasePriceTotal / bottle.purchaseSizeOz || 0);
                      return sum + (oz * price);
                    }, 0)
                  )}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Low Stock Items</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: lowStockItems.length > 0 ? '#ff6b6b' : '#55efc4' }}>{lowStockItems.length}</div>
                </div>
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Recipes Ready</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#55efc4' }}>{whatCanIMake.filter(w => w.maxQty >= 12).length} / {whatCanIMake.length}</div>
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
              
              <div className="inventory-recipe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                {whatCanIMake.map((item, i) => {
                  const statusColor = item.maxQty >= 24 ? '#55efc4' : item.maxQty >= 12 ? '#feca57' : item.maxQty > 0 ? '#ff9f6b' : '#ff6b6b';
                  const statusBg = item.maxQty >= 24 ? 'rgba(85,239,196,0.1)' : item.maxQty >= 12 ? 'rgba(254,202,87,0.1)' : item.maxQty > 0 ? 'rgba(255,159,107,0.1)' : 'rgba(255,107,107,0.1)';
                  const statusBorder = item.maxQty >= 24 ? 'rgba(85,239,196,0.3)' : item.maxQty >= 12 ? 'rgba(254,202,87,0.3)' : item.maxQty > 0 ? 'rgba(255,159,107,0.3)' : 'rgba(255,107,107,0.3)';
                  
                  return (
                    <div key={i} style={{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{item.recipe.name}</h4>
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{item.recipe.vibe}</span>
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
                        <button onClick={() => { setCurrentBatch({ ...currentBatch, recipe: item.recipe.name, size: 9, foLoad: item.recipe.foLoad / 100, quantity: 12 }); setActiveTab('calculator'); }} style={{ ...btnSecondary, width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '12px' }}>
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
                    <option value="id">Sort: ID</option>
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
                  <button onClick={() => { setUrlImportType('material'); setShowUrlImportModal(true); }} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}><ExternalLink size={16} /> Import URL</button>
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
                          <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Vendor:</span> <VendorLink vendor={m.vendor} /></div>
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
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}><VendorLink vendor={m.vendor} style={{ fontSize: '12px' }} /> • {m.packageSize} {m.unit} • {formatCurrency(m.packageCost)}</span>
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
                <div className="table-wrapper" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'auto' }}>
                  <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                        {/* Mobile-only Edit column header - shows first on mobile */}
                        <th className="mobile-edit-th" style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)', position: 'sticky', left: 0, background: 'rgba(255,159,107,0.1)', zIndex: 1 }}>Edit</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', width: '40px' }}>
                          <div onClick={() => selectedMaterials.length === filteredMaterials.length ? clearMaterialSelection() : selectAllMaterials()} style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 ? '#feca57' : 'rgba(255,159,107,0.3)'}`, background: selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 ? '#feca57' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            {selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0 && <Check size={12} color="#1a0a1e" />}
                          </div>
                        </th>
                        {['ID', 'Category', 'Name', 'Vendor', 'Pkg Size', 'Pkg Cost', '$/Unit', 'On Hand', 'Reorder'].map(h => (
                          <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>
                        ))}
                        {/* Desktop-only Edit column header */}
                        <th className="desktop-edit-th" style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials.map(m => {
                        const isSelected = selectedMaterials.includes(m.id);
                        const isLowStock = m.qtyOnHand < m.reorderPoint;
                        return (
                          <tr key={m.id} onClick={() => toggleMaterialSelection(m.id)} style={{ borderTop: '1px solid rgba(255,159,107,0.1)', background: isSelected ? 'rgba(254,202,87,0.1)' : isLowStock ? 'rgba(255,107,107,0.05)' : 'transparent', cursor: 'pointer' }}>
                            {/* Mobile-only Edit column - sticky on left */}
                            <td className="mobile-edit-col" style={{ padding: '10px 8px', position: 'sticky', left: 0, background: isSelected ? 'rgba(254,202,87,0.15)' : isLowStock ? 'rgba(255,107,107,0.1)' : 'rgba(26,10,30,0.95)', zIndex: 1 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => openEditMaterial(m)} style={{ background: 'rgba(254,202,87,0.3)', border: 'none', borderRadius: '6px', padding: '8px', color: '#feca57', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={16} /></button>
                            </td>
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
                            <td style={{ padding: '14px 16px' }}><VendorLink vendor={m.vendor} /></td>
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
                            {/* Desktop-only Edit/Delete column */}
                            <td className="desktop-edit-col" style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
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
                  <button onClick={() => { setUrlImportType('fragrance'); setShowUrlImportModal(true); }} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}><ExternalLink size={16} /> Import URL</button>
                  <button onClick={openAddFragrance} style={btnPrimary}><Plus size={18} /> Add Fragrance</button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div className="stat-label" style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Fragrances</div>
                  <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#feca57' }}>{fragrances.filter(f => !f.archived).length}</div>
                </div>
                <div className="stat-card" style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div className="stat-label" style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Stock</div>
                  <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#55efc4' }}>{fragranceBottles.filter(b => b.status !== 'archived').reduce((sum, b) => sum + (calculateNetOzRemaining(b) || 0), 0).toFixed(1)} oz</div>
                </div>
                <div className="stat-card" style={{ background: 'rgba(162,155,254,0.08)', border: '1px solid rgba(162,155,254,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div className="stat-label" style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Bottles Tracked</div>
                  <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#a29bfe' }}>{fragranceBottles.filter(b => b.status !== 'archived').length}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '2px' }}>{[...new Set(fragranceBottles.filter(b => b.status !== 'archived').map(b => b.fragranceName))].length} fragrances</div>
                </div>
                <div className="stat-card" style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div className="stat-label" style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Total Value</div>
                  <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#74b9ff' }}>{formatCurrency(
                    fragranceBottles.filter(b => b.status !== 'archived').reduce((sum, bottle) => {
                      const ozRemaining = calculateNetOzRemaining(bottle) || 0;
                      const frag = fragrances.find(f => f.name === bottle.fragranceName);
                      const avgPricePerOz = frag ? calculateWeightedPricePerOz(frag.prices, frag.quantities) : (bottle.purchasePriceTotal / bottle.purchaseSizeOz || 0);
                      return sum + (ozRemaining * avgPricePerOz);
                    }, 0)
                  )}</div>
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
                        const bottlesForFragrance = fragranceBottles.filter(b => b.fragranceName === f.name && b.status !== 'archived');
                        const hasBottles = bottlesForFragrance.length > 0;
                        const stockFromBottles = bottlesForFragrance.reduce((sum, b) => sum + (calculateNetOzRemaining(b) || 0), 0);
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
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: f.type === 'FO' ? 'rgba(254,202,87,0.2)' : 'rgba(85,239,196,0.2)', color: f.type === 'FO' ? '#feca57' : '#55efc4' }}>{f.type === 'FO' ? 'Fragrance Oil' : 'Essential Oil'}</span>
                                  {hasBottles && (
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: 'rgba(162,155,254,0.2)', color: '#a29bfe', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Scale size={10} /> {bottlesForFragrance.length} bottle{bottlesForFragrance.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                <button onClick={() => { setBottleForm({ fragranceId: f.id, fragranceName: f.name, vendor: f.vendor || '', purchaseDate: new Date().toISOString().split('T')[0], purchaseSizeOz: f.packageSize || 16, purchasePriceTotal: f.packageCost || 0, grossWeightGrams: null, tareWeightGrams: null, currentWeightGrams: null, notes: '' }); setShowAddBottleModal(true); }} style={{ background: hasBottles ? 'rgba(162,155,254,0.3)' : 'rgba(162,155,254,0.15)', border: 'none', borderRadius: '6px', padding: '6px', color: '#a29bfe', cursor: 'pointer' }} title="Track bottles by weight"><Scale size={12} /></button>
                                <button onClick={() => openEditFragrance(f)} style={{ background: 'rgba(254,202,87,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#feca57', cursor: 'pointer' }}><Edit2 size={12} /></button>
                                <button onClick={() => window.open(`https://www.amazon.com/s?k=fragrance+oil+${encodeURIComponent(f.name)}`, '_blank')} style={{ background: 'rgba(255,159,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff9f6b', cursor: 'pointer' }} title="Search on Amazon"><ExternalLink size={12} /></button>
                                <button onClick={(e) => archiveFragrance(f.id, e)} style={{ background: f.archived ? 'rgba(85,239,196,0.2)' : 'rgba(162,155,254,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: f.archived ? '#55efc4' : '#a29bfe', cursor: 'pointer' }} title={f.archived ? 'Unarchive' : 'Archive'}><Archive size={12} /></button>
                                <button onClick={(e) => deleteFragrance(f.id, e)} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={12} /></button>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                              <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Vendor:</span> <VendorLink vendor={f.vendor} /></div>
                              <div>
                                <span style={{ color: 'rgba(252,228,214,0.5)' }}>Stock:</span>{' '}
                                <span style={{ color: hasBottles ? '#55efc4' : 'rgba(252,228,214,0.4)', fontWeight: 600 }}>{stockFromBottles.toFixed(1)} oz</span>
                                {!hasBottles && <span style={{ fontSize: '10px', color: 'rgba(252,228,214,0.3)', marginLeft: '4px' }}>(no bottles)</span>}
                              </div>
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
                        const bottlesForFragrance = fragranceBottles.filter(b => b.fragranceName === f.name && b.status !== 'archived');
                        const hasBottles = bottlesForFragrance.length > 0;
                        const stockFromBottles = bottlesForFragrance.reduce((sum, b) => sum + (calculateNetOzRemaining(b) || 0), 0);
                        return (
                          <div key={f.id} className="list-item" onClick={() => toggleFragranceSelection(f.id)} style={{ background: isSelected ? 'rgba(162,155,254,0.15)' : 'rgba(255,159,107,0.08)', border: `2px solid ${isSelected ? 'rgba(162,155,254,0.5)' : 'rgba(255,159,107,0.15)'}`, borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="item-checkbox" style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${isSelected ? '#a29bfe' : 'rgba(255,159,107,0.3)'}`, background: isSelected ? '#a29bfe' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isSelected && <Check size={14} color="#1a0a1e" />}
                            </div>
                            <div className="item-info" style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{f.name}</h4>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: f.type === 'FO' ? 'rgba(254,202,87,0.2)' : 'rgba(85,239,196,0.2)', color: f.type === 'FO' ? '#feca57' : '#55efc4' }}>{f.type}</span>
                                {hasBottles && (
                                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: 'rgba(162,155,254,0.2)', color: '#a29bfe', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Scale size={9} /> {bottlesForFragrance.length}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>
                                <VendorLink vendor={f.vendor} style={{ fontSize: '12px' }} /> •{' '}
                                <span style={{ color: hasBottles ? '#55efc4' : 'rgba(252,228,214,0.4)' }}>{stockFromBottles.toFixed(1)} oz</span>
                                {!hasBottles && <span style={{ color: 'rgba(252,228,214,0.3)', marginLeft: '2px' }}>(no bottles)</span>}
                              </div>
                            </div>
                            <div className="item-price" style={{ textAlign: 'right', marginRight: '12px' }}>
                              <div style={{ fontSize: '16px', fontWeight: 600, color: '#feca57' }}>{(() => { const prices = f.prices || {}; const valid = Object.entries(prices).filter(([s, p]) => p > 0).map(([s, p]) => p / parseFloat(s)); return valid.length > 0 ? formatCurrency(valid.reduce((a, b) => a + b, 0) / valid.length) : (f.packageCost > 0 ? formatCurrency(f.packageCost / f.packageSize) : '$0.00'); })()}/oz</div>
                              <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>Max {f.maxLoad}%</div>
                            </div>
                            <div className="item-actions" style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setBottleForm({ fragranceId: f.id, fragranceName: f.name, vendor: f.vendor || '', purchaseDate: new Date().toISOString().split('T')[0], purchaseSizeOz: f.packageSize || 16, purchasePriceTotal: f.packageCost || 0, grossWeightGrams: null, tareWeightGrams: null, currentWeightGrams: null, notes: '' }); setShowAddBottleModal(true); }} style={{ background: hasBottles ? 'rgba(162,155,254,0.3)' : 'rgba(162,155,254,0.15)', border: 'none', borderRadius: '6px', padding: '8px', color: '#a29bfe', cursor: 'pointer' }} title="Track bottles by weight"><Scale size={14} /></button>
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
                                <td style={{ padding: '14px 16px' }}><VendorLink vendor={f.vendor} /></td>
                                <td style={{ padding: '14px 16px', color: '#55efc4', fontWeight: 600 }}>{Object.entries(f.quantities || {}).reduce((sum, [sz, qty]) => sum + (qty * parseFloat(sz)), 0).toFixed(1)} oz</td>
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
                          {(aiResponse.text || aiResponse).split('\n').map((line, i) => {
                            if (line.startsWith('**') && line.includes(':**')) {
                              const [label, ...rest] = line.split(':**');
                              return <p key={i} style={{ marginBottom: '8px' }}><strong style={{ color: '#a29bfe' }}>{label.replace(/\*\*/g, '')}:</strong> {rest.join(':**').replace(/\*\*/g, '')}</p>;
                            }
                            if (line.startsWith('•')) {
                              return <p key={i} style={{ marginBottom: '4px', paddingLeft: '8px' }}>{line}</p>;
                            }
                            if (line.match(/^\d+\.\s\*\*/)) {
                              return <h4 key={i} style={{ fontSize: '14px', fontWeight: 600, color: '#a29bfe', marginTop: '16px', marginBottom: '8px' }}>{line.replace(/\*\*/g, '')}</h4>;
                            }
                            return line ? <p key={i} style={{ marginBottom: '8px' }}>{line}</p> : null;
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
                    <option value="canMake">Sort: Can Make (Most)</option>
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
                        <p style={{ color: 'rgba(252,228,214,0.5)', fontSize: '12px', marginBottom: '12px' }}>{r.foLoad}% FO • {r.components.length} notes</p>
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
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{r.foLoad}% FO • {r.components.length} fragrance notes</div>
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
                <div className="table-wrapper" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,159,107,0.1)' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Recipe</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>FO Load</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase' }}>Fragrances</th>
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
                            <td style={{ padding: '14px 16px', fontSize: '14px' }}>{r.foLoad}%</td>
                            <td style={{ padding: '14px 16px', fontSize: '13px' }}>{r.components.length} notes</td>
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
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing Engine</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Set your pricing tiers and analyze margins</p>
                </div>
                <button onClick={() => { setCurrentBatch(prev => ({ ...prev, recipe: pricingRecipe, foLoad: (pricingRecipeData?.foLoad || 10) / 100 })); setActiveTab('calculator'); }} style={btnPrimary}><Calculator size={18} /> Build Batch</button>
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
                        <option key={r.id} value={r.name}>{r.name}</option>
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

              <div className="pricing-grid two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div className="pricing-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', background: 'rgba(255,159,107,0.1)', borderBottom: '1px solid rgba(255,159,107,0.15)' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pricing Tiers</h3>
                    </div>
                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
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
                </div>

                <div>
                  <div className="pricing-card" style={{ background: 'linear-gradient(135deg, rgba(85,239,196,0.15) 0%, rgba(85,239,196,0.05) 100%)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#55efc4' }}>Target Pricing Guide</h3>
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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
                  
                  <div className="pricing-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Break-Even Analysis</h3>
                    <div style={{ fontSize: '13px', color: 'rgba(252,228,214,0.7)', marginBottom: '12px' }}>
                      Assuming $200/month fixed costs
                    </div>
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shopping List</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>{batchList.length > 0 ? `${batchList.length} batch${batchList.length > 1 ? 'es' : ''} • ${shoppingList.totals.totalCandles} total candles` : 'Add batches from Batch Builder to generate shopping list'}</p>
                </div>
                {batchList.length > 0 && (
                  <div className="btn-group" style={{ display: 'flex', gap: '12px' }}>
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
                  {/* Stock Status - What You Need to Order */}
                  <div className="shopping-summary two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    {/* Need to Order */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(255,107,107,0.05) 100%)', border: '2px solid rgba(255,107,107,0.4)', borderRadius: '16px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,107,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingCart size={20} color="#ff6b6b" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#ff6b6b' }}>Need to Order</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{batchListSummary.shortages.length} items</p>
                        </div>
                      </div>
                      {batchListSummary.shortages.length === 0 ? (
                        <div style={{ padding: '20px', background: 'rgba(85,239,196,0.1)', borderRadius: '10px', textAlign: 'center' }}>
                          <CheckCircle size={24} color="#55efc4" style={{ marginBottom: '8px' }} />
                          <div style={{ color: '#55efc4', fontWeight: 600 }}>Everything in stock!</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                          {batchListSummary.shortages.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{item.category}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, color: '#ff6b6b', fontSize: '16px' }}>{item.toOrder} {item.unit}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)' }}>need {item.needed} / have {item.have}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {batchListSummary.shortages.length > 0 && (
                        <button onClick={() => {
                          const text = batchListSummary.shortages.map(item => `${item.name} (${item.category}): ${item.toOrder} ${item.unit}`).join('\n');
                          navigator.clipboard.writeText(text);
                          alert('Order list copied to clipboard!');
                        }} style={{ ...btnSecondary, width: '100%', marginTop: '16px', justifyContent: 'center' }}><Copy size={16} /> Copy Order List</button>
                      )}
                    </div>

                    {/* In Stock */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(85,239,196,0.15) 0%, rgba(85,239,196,0.05) 100%)', border: '2px solid rgba(85,239,196,0.4)', borderRadius: '16px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(85,239,196,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={20} color="#55efc4" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#55efc4' }}>In Stock</h4>
                          <p style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{batchListSummary.inStock.length} items ready</p>
                        </div>
                      </div>
                      {batchListSummary.inStock.length === 0 ? (
                        <div style={{ padding: '20px', background: 'rgba(255,107,107,0.1)', borderRadius: '10px', textAlign: 'center', color: 'rgba(252,228,214,0.6)' }}>
                          No items in stock
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                          {batchListSummary.inStock.map((item, i) => (
                            <div key={i} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '12px' }}>
                              <span style={{ fontWeight: 500 }}>{item.name}</span>
                              <span style={{ color: '#55efc4', marginLeft: '8px' }}>{item.needed} {item.unit}</span>
                              <span style={{ color: 'rgba(252,228,214,0.4)', marginLeft: '4px' }}>({item.have} avail)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

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
                      <thead><tr style={{ background: 'rgba(255,159,107,0.1)' }}>{['Date', 'Recipe', 'Qty', 'Size', 'Cost/Each', 'Batch Cost', 'Status', 'Notes', 'Actions'].map(h => (<th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(252,228,214,0.6)' }}>{h}</th>))}</tr></thead>
                      <tbody>
                        {batchHistory.map(b => {
                          // Support both old format (qty, date, cost) and new format (quantity, loggedAt, calculated cost)
                          const qty = b.quantity || b.qty || 0;
                          const date = b.loggedAt ? new Date(b.loggedAt).toLocaleDateString() : b.date || '-';
                          const calc = b.waxCostPerOz !== undefined ? calculateBatch(b) : null;
                          const costPerCandle = calc ? calc.totalCostPerCandle : (b.cost / qty) || 0;
                          const batchCost = calc ? calc.totalBatchCost : b.cost || 0;
                          const status = b.status || 'Curing';
                          return (
                            <tr key={b.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                              <td style={{ padding: '14px 12px', color: 'rgba(252,228,214,0.7)' }}>{date}</td>
                              <td style={{ padding: '14px 12px', fontWeight: 500 }}>{b.recipe}</td>
                              <td style={{ padding: '14px 12px' }}>{qty}</td>
                              <td style={{ padding: '14px 12px' }}>{b.size} oz</td>
                              <td style={{ padding: '14px 12px' }}>{formatCurrency(costPerCandle)}</td>
                              <td style={{ padding: '14px 12px' }}>{formatCurrency(batchCost)}</td>
                              <td style={{ padding: '14px 12px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: status === 'completed' ? 'rgba(85,239,196,0.2)' : status === 'Ready' ? 'rgba(85,239,196,0.2)' : 'rgba(254,202,87,0.2)', color: status === 'completed' ? '#55efc4' : status === 'Ready' ? '#55efc4' : '#feca57' }}>{status === 'completed' ? 'Completed' : status}</span></td>
                              <td style={{ padding: '14px 12px', color: 'rgba(252,228,214,0.6)', fontSize: '12px', maxWidth: '200px' }}>{b.notes || '-'}</td>
                              <td style={{ padding: '14px 12px' }}>
                                <button onClick={() => {
                                  if (confirm('Delete this batch from history?')) {
                                    setBatchHistory(batchHistory.filter(h => h.id !== b.id));
                                  }
                                }} style={{ background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#ff6b6b', cursor: 'pointer' }} title="Delete"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          );
                        })}
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

          {/* Admin Page */}
          {activeTab === 'admin' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Settings</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Configure default values and preferences</p>
                </div>
                <button onClick={() => { if (confirm('Reset all settings to factory defaults?')) setAppDefaults(defaultAppSettings); }} style={btnSecondary}><RotateCcw size={16} /> Reset to Defaults</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

                {/* Batch Builder Defaults */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#feca57' }}><Calculator size={20} /> Batch Builder Defaults</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Candle Size (oz)</label>
                        <input type="number" value={appDefaults.defaultCandleSize} onChange={e => setAppDefaults({ ...appDefaults, defaultCandleSize: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Quantity</label>
                        <input type="number" value={appDefaults.defaultQuantity} onChange={e => setAppDefaults({ ...appDefaults, defaultQuantity: parseInt(e.target.value) || 0 })} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default FO Load (%)</label>
                      <input type="number" value={appDefaults.defaultFoLoad} onChange={e => setAppDefaults({ ...appDefaults, defaultFoLoad: parseFloat(e.target.value) || 0 })} step="0.5" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Wax</label>
                      <select value={appDefaults.defaultWax} onChange={e => setAppDefaults({ ...appDefaults, defaultWax: e.target.value })} style={inputStyle}>
                        <option value="">None selected</option>
                        {materials.filter(m => m.category === 'Wax').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Container</label>
                      <select value={appDefaults.defaultContainer} onChange={e => setAppDefaults({ ...appDefaults, defaultContainer: e.target.value })} style={inputStyle}>
                        <option value="">None selected</option>
                        {materials.filter(m => m.category === 'Container').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Wick</label>
                      <select value={appDefaults.defaultWick} onChange={e => setAppDefaults({ ...appDefaults, defaultWick: e.target.value })} style={inputStyle}>
                        <option value="">None selected</option>
                        {materials.filter(m => m.category === 'Wick').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Label</label>
                        <select value={appDefaults.defaultLabel} onChange={e => setAppDefaults({ ...appDefaults, defaultLabel: e.target.value })} style={inputStyle}>
                          <option value="">None selected</option>
                          <option value="none">No label</option>
                          <option value="standard-vinyl">Standard Vinyl</option>
                          {materials.filter(m => m.category === 'Label').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Packaging</label>
                        <select value={appDefaults.defaultPackaging} onChange={e => setAppDefaults({ ...appDefaults, defaultPackaging: e.target.value })} style={inputStyle}>
                          <option value="">None selected</option>
                          <option value="none">No packaging</option>
                          {materials.filter(m => m.category === 'Packaging').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Defaults */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#55efc4' }}><DollarSign size={20} /> Pricing Defaults</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Overhead per Candle ($)</label>
                      <input type="number" step="0.01" value={appDefaults.defaultOverheadPerCandle} onChange={e => setAppDefaults({ ...appDefaults, defaultOverheadPerCandle: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                      <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>Electricity, workspace, etc.</span>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Labor Cost per Candle ($)</label>
                      <input type="number" step="0.01" value={appDefaults.defaultLaborCostPerCandle} onChange={e => setAppDefaults({ ...appDefaults, defaultLaborCostPerCandle: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Profit Margin Target (%)</label>
                      <input type="number" value={appDefaults.defaultProfitMarginTarget} onChange={e => setAppDefaults({ ...appDefaults, defaultProfitMarginTarget: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,159,107,0.2)', paddingTop: '16px', marginTop: '8px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(252,228,214,0.8)', marginBottom: '12px' }}>Standard Vinyl Label Pricing</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Small (≤4oz)</label>
                          <input type="number" step="0.01" value={appDefaults.smallLabelCost} onChange={e => setAppDefaults({ ...appDefaults, smallLabelCost: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Medium (5-6oz)</label>
                          <input type="number" step="0.01" value={appDefaults.mediumLabelCost} onChange={e => setAppDefaults({ ...appDefaults, mediumLabelCost: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Large (7oz+)</label>
                          <input type="number" step="0.01" value={appDefaults.largeLabelCost} onChange={e => setAppDefaults({ ...appDefaults, largeLabelCost: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Defaults */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a29bfe' }}><BookOpen size={20} /> Recipe Defaults</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default FO Load for New Recipes (%)</label>
                      <input type="number" value={appDefaults.defaultRecipeFoLoad} onChange={e => setAppDefaults({ ...appDefaults, defaultRecipeFoLoad: parseFloat(e.target.value) || 0 })} step="0.5" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Dye Unit</label>
                      <select value={appDefaults.defaultDyeUnit} onChange={e => setAppDefaults({ ...appDefaults, defaultDyeUnit: e.target.value })} style={inputStyle}>
                        <option value="drops">Drops</option>
                        <option value="ml">Milliliters (ml)</option>
                        <option value="g">Grams (g)</option>
                        <option value="oz">Ounces (oz)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Display Preferences */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#74b9ff' }}><Grid size={20} /> Display Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Recipe View</label>
                      <select value={appDefaults.defaultRecipeView} onChange={e => setAppDefaults({ ...appDefaults, defaultRecipeView: e.target.value })} style={inputStyle}>
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="table">Table</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default Fragrance View</label>
                      <select value={appDefaults.defaultFragranceView} onChange={e => setAppDefaults({ ...appDefaults, defaultFragranceView: e.target.value })} style={inputStyle}>
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="table">Table</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" id="showArchived" checked={appDefaults.showArchivedByDefault} onChange={e => setAppDefaults({ ...appDefaults, showArchivedByDefault: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#feca57' }} />
                      <label htmlFor="showArchived" style={{ fontSize: '13px', color: 'rgba(252,228,214,0.8)', cursor: 'pointer' }}>Show archived items by default</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" id="returnToFragrances" checked={appDefaults.returnToFragrancesOnRecipeCancel} onChange={e => setAppDefaults({ ...appDefaults, returnToFragrancesOnRecipeCancel: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#feca57' }} />
                      <label htmlFor="returnToFragrances" style={{ fontSize: '13px', color: 'rgba(252,228,214,0.8)', cursor: 'pointer' }}>Return to Fragrances when canceling recipe creation</label>
                    </div>
                  </div>
                </div>

                {/* Business Settings */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fd79a8' }}><Flame size={20} /> Business Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Business Name</label>
                      <input type="text" value={appDefaults.businessName} onChange={e => setAppDefaults({ ...appDefaults, businessName: e.target.value })} style={inputStyle} />
                      <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px', display: 'block' }}>Used on printed instructions</span>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Currency Symbol</label>
                      <input type="text" value={appDefaults.currencySymbol} onChange={e => setAppDefaults({ ...appDefaults, currencySymbol: e.target.value })} maxLength={3} style={{ ...inputStyle, width: '80px' }} />
                    </div>
                  </div>
                </div>

                {/* Data Backup & Restore */}
                <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#74b9ff' }}><Download size={20} /> Data Backup & Restore</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '12px' }}>Export all your data (materials, fragrances, recipes, etc.) to a backup file.</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            const backup = {
                              version: 1,
                              exportDate: new Date().toISOString(),
                              data: { materials, fragrances, recipes, batchHistory, batchList, savedInstructions, savedChats, appDefaults }
                            };
                            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `light-by-dawn-backup-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          style={{ ...btnPrimary, background: 'linear-gradient(135deg, #74b9ff 0%, #55efc4 100%)' }}
                        >
                          <Download size={16} /> JSON
                        </button>
                        <button
                          onClick={() => {
                            // Generate Excel-compatible HTML
                            const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            const tableStyle = 'border-collapse: collapse; width: 100%; margin-bottom: 20px;';
                            const thStyle = 'border: 1px solid #000; padding: 8px; background: #f0f0f0; font-weight: bold; text-align: left;';
                            const tdStyle = 'border: 1px solid #000; padding: 8px;';

                            let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
                              <head><meta charset="UTF-8"><style>table { ${tableStyle} } th { ${thStyle} } td { ${tdStyle} }</style></head><body>`;

                            // Materials
                            html += '<h2>Materials</h2><table><tr><th>ID</th><th>Category</th><th>Name</th><th>Vendor</th><th>Unit</th><th>Pkg Size</th><th>Pkg Cost</th><th>Qty On Hand</th><th>Reorder Pt</th></tr>';
                            materials.forEach(m => {
                              html += `<tr><td>${escapeHtml(m.id)}</td><td>${escapeHtml(m.category)}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.vendor)}</td><td>${escapeHtml(m.unit)}</td><td>${m.packageSize || ''}</td><td>${m.packageCost || ''}</td><td>${m.qtyOnHand || ''}</td><td>${m.reorderPoint || ''}</td></tr>`;
                            });
                            html += '</table>';

                            // Fragrances
                            html += '<h2>Fragrances</h2><table><tr><th>ID</th><th>Name</th><th>Type</th><th>Vendor</th><th>Size (oz)</th><th>Cost</th><th>Qty On Hand</th><th>Notes</th></tr>';
                            fragrances.forEach(f => {
                              html += `<tr><td>${escapeHtml(f.id)}</td><td>${escapeHtml(f.name)}</td><td>${escapeHtml(f.type)}</td><td>${escapeHtml(f.vendor)}</td><td>${f.size || ''}</td><td>${f.cost || ''}</td><td>${f.qtyOnHand || ''}</td><td>${escapeHtml(f.notes)}</td></tr>`;
                            });
                            html += '</table>';

                            // Recipes
                            html += '<h2>Recipes</h2><table><tr><th>ID</th><th>Name</th><th>Vibe</th><th>FO Load %</th><th>Components</th><th>Description</th></tr>';
                            recipes.forEach(r => {
                              const comps = (r.components || []).map(c => `${c.fragrance} (${c.percent}%)`).join(', ');
                              html += `<tr><td>${escapeHtml(r.id)}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.vibe)}</td><td>${r.foLoad || ''}</td><td>${escapeHtml(comps)}</td><td>${escapeHtml(r.description)}</td></tr>`;
                            });
                            html += '</table>';

                            // Batch History
                            html += '<h2>Batch History</h2><table><tr><th>ID</th><th>Date</th><th>Recipe</th><th>Qty</th><th>Size</th><th>Notes</th></tr>';
                            batchHistory.forEach(b => {
                              html += `<tr><td>${escapeHtml(b.id)}</td><td>${escapeHtml(b.date)}</td><td>${escapeHtml(b.recipeName || b.recipe)}</td><td>${b.quantity || b.qty || ''}</td><td>${b.size || ''}</td><td>${escapeHtml(b.notes)}</td></tr>`;
                            });
                            html += '</table></body></html>';

                            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `light-by-dawn-${new Date().toISOString().split('T')[0]}.xls`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          style={{ ...btnSecondary }}
                        >
                          <Table size={16} /> Excel
                        </button>
                        <button
                          onClick={() => {
                            // Generate PDF-ready HTML
                            const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            const printWindow = window.open('', '_blank');
                            let html = `<!DOCTYPE html><html><head><title>Light By Dawn - Inventory Report</title>
                              <style>
                                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                                h1 { color: #1a0a1e; border-bottom: 2px solid #1a0a1e; padding-bottom: 8px; }
                                h2 { color: #444; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
                                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; font-size: 12px; }
                                th { border: 1px solid #333; padding: 8px; background: #f5f5f5; text-align: left; }
                                td { border: 1px solid #ddd; padding: 6px; }
                                .summary { background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                                .summary span { margin-right: 20px; }
                                @media print { body { padding: 0; } h1 { font-size: 18px; } h2 { font-size: 14px; } }
                              </style>
                            </head><body>`;

                            html += `<h1>Light By Dawn - Inventory Report</h1>`;
                            html += `<p>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>`;
                            html += `<div class="summary"><strong>Summary:</strong> <span>${materials.length} Materials</span><span>${fragrances.length} Fragrances</span><span>${recipes.length} Recipes</span><span>${batchHistory.length} Batches</span></div>`;

                            // Materials
                            html += '<h2>Materials</h2><table><tr><th>ID</th><th>Category</th><th>Name</th><th>Vendor</th><th>Unit</th><th>Pkg Size</th><th>Cost</th><th>On Hand</th><th>Reorder</th></tr>';
                            materials.forEach(m => {
                              html += `<tr><td>${escapeHtml(m.id)}</td><td>${escapeHtml(m.category)}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.vendor)}</td><td>${escapeHtml(m.unit)}</td><td>${m.packageSize || '-'}</td><td>${(m.packageCost || 0).toFixed(2)}</td><td>${m.qtyOnHand || 0}</td><td>${m.reorderPoint || '-'}</td></tr>`;
                            });
                            html += '</table>';

                            // Fragrances
                            html += '<h2>Fragrances</h2><table><tr><th>ID</th><th>Name</th><th>Type</th><th>Vendor</th><th>Size</th><th>Cost</th><th>On Hand (oz)</th></tr>';
                            fragrances.forEach(f => {
                              html += `<tr><td>${escapeHtml(f.id)}</td><td>${escapeHtml(f.name)}</td><td>${escapeHtml(f.type)}</td><td>${escapeHtml(f.vendor)}</td><td>${f.size || '-'} oz</td><td>${(f.cost || 0).toFixed(2)}</td><td>${(f.qtyOnHand || 0).toFixed(1)}</td></tr>`;
                            });
                            html += '</table>';

                            // Recipes
                            html += '<h2>Recipes</h2><table><tr><th>ID</th><th>Name</th><th>Vibe</th><th>FO %</th><th>Components</th></tr>';
                            recipes.filter(r => !r.archived).forEach(r => {
                              const comps = (r.components || []).map(c => `${c.fragrance} (${c.percent}%)`).join(', ');
                              html += `<tr><td>${escapeHtml(r.id)}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.vibe)}</td><td>${r.foLoad || '-'}%</td><td style="font-size:11px">${escapeHtml(comps)}</td></tr>`;
                            });
                            html += '</table>';

                            html += '</body></html>';

                            printWindow.document.write(html);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          style={{ ...btnSecondary }}
                        >
                          <Printer size={16} /> PDF
                        </button>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,159,107,0.15)', paddingTop: '16px' }}>
                      <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '12px' }}>Export individual categories:</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Materials', data: materials, filename: 'materials' },
                          { label: 'Fragrances', data: fragrances, filename: 'fragrances' },
                          { label: 'Recipes', data: recipes, filename: 'recipes' },
                          { label: 'Batch History', data: batchHistory, filename: 'batch-history' },
                          { label: 'Instructions', data: savedInstructions, filename: 'instructions' },
                          { label: 'AI Chats', data: savedChats, filename: 'chats' },
                        ].map(({ label, data, filename }) => (
                          <button
                            key={filename}
                            onClick={() => {
                              const exportData = { exportDate: new Date().toISOString(), [filename.replace('-', '')]: data };
                              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `light-by-dawn-${filename}-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fce4d6', cursor: 'pointer', fontSize: '12px' }}
                          >
                            {label} ({data.length})
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,159,107,0.15)', paddingTop: '16px' }}>
                      <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '12px' }}>Restore data from a backup file. This will merge with existing data (new items added, existing items updated).</p>
                      <input
                        type="file"
                        id="backup-import"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const backup = JSON.parse(event.target.result);
                              if (!backup.data) {
                                alert('Invalid backup file format');
                                return;
                              }
                              const d = backup.data;
                              // Merge function: add new items, update existing by ID
                              const mergeArrays = (existing, imported) => {
                                const map = new Map(existing.map(item => [item.id, item]));
                                imported.forEach(item => map.set(item.id, item));
                                return Array.from(map.values());
                              };
                              if (d.materials) setMaterials(mergeArrays(materials, d.materials));
                              if (d.fragrances) setFragrances(mergeArrays(fragrances, d.fragrances));
                              if (d.recipes) setRecipes(mergeArrays(recipes, d.recipes));
                              if (d.batchHistory) setBatchHistory(mergeArrays(batchHistory, d.batchHistory));
                              if (d.batchList) setBatchList(mergeArrays(batchList, d.batchList));
                              if (d.savedInstructions) setSavedInstructions(mergeArrays(savedInstructions, d.savedInstructions));
                              if (d.savedChats) setSavedChats(mergeArrays(savedChats, d.savedChats));
                              if (d.appDefaults) setAppDefaults({ ...appDefaults, ...d.appDefaults });
                              alert(`Backup restored successfully!\nImported: ${d.materials?.length || 0} materials, ${d.fragrances?.length || 0} fragrances, ${d.recipes?.length || 0} recipes`);
                            } catch (err) {
                              alert('Error reading backup file: ' + err.message);
                            }
                          };
                          reader.readAsText(file);
                          e.target.value = ''; // Reset input
                        }}
                      />
                      <button
                        onClick={() => document.getElementById('backup-import').click()}
                        style={{ ...btnSecondary }}
                      >
                        <FileText size={16} /> Import Backup
                      </button>
                    </div>
                    <div style={{ background: 'rgba(255,107,107,0.1)', borderRadius: '8px', padding: '12px', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} /> Tip: Export a backup before making major changes or syncing across devices.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Sales Page - Shopify Integration */}
          {activeTab === 'sales' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="page-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '8px', background: 'linear-gradient(135deg, #55efc4 0%, #74b9ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sales Dashboard</h2>
                  <p className="page-subtitle" style={{ color: 'rgba(252,228,214,0.6)' }}>Shopify orders and sales data</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {shopifyLastSync && (
                    <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>
                      Last synced: {new Date(shopifyLastSync).toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={fetchShopifyData}
                    disabled={shopifyLoading}
                    style={{
                      ...btnPrimary,
                      opacity: shopifyLoading ? 0.7 : 1,
                      background: 'linear-gradient(135deg, #55efc4 0%, #74b9ff 100%)'
                    }}
                  >
                    <RefreshCw size={16} className={shopifyLoading ? 'animate-spin' : ''} />
                    {shopifyLoading ? 'Syncing...' : 'Sync Shopify'}
                  </button>
                </div>
              </div>

              {shopifyError && (
                <div style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={20} style={{ color: '#ff6b6b' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#ff6b6b' }}>Connection Error</div>
                    <div style={{ fontSize: '13px', color: 'rgba(252,228,214,0.7)' }}>{shopifyError}</div>
                  </div>
                </div>
              )}

              {!shopifyLoading && shopifyOrders.length === 0 && !shopifyError && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Store size={64} style={{ color: 'rgba(252,228,214,0.2)', marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>No Orders Yet</h3>
                  <p style={{ color: 'rgba(252,228,214,0.6)', marginBottom: '24px' }}>Click "Sync Shopify" to fetch your orders</p>
                  <button onClick={fetchShopifyData} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #55efc4 0%, #74b9ff 100%)' }}>
                    <RefreshCw size={16} /> Sync Now
                  </button>
                </div>
              )}

              {shopifyOrders.length > 0 && (
                <>
                  {/* Stats Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {(() => {
                      const totalRevenue = shopifyOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
                      const paidOrders = shopifyOrders.filter(o => o.financial_status === 'paid');
                      const pendingOrders = shopifyOrders.filter(o => o.fulfillment_status !== 'fulfilled' && o.financial_status === 'paid');
                      const thisMonth = shopifyOrders.filter(o => {
                        const orderDate = new Date(o.created_at);
                        const now = new Date();
                        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                      });
                      const monthlyRevenue = thisMonth.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

                      return [
                        { label: 'Total Orders', value: shopifyOrders.length, color: '#74b9ff' },
                        { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#55efc4' },
                        { label: 'This Month', value: formatCurrency(monthlyRevenue), color: '#feca57' },
                        { label: 'Pending Fulfillment', value: pendingOrders.length, color: '#ff9ff3' }
                      ].map((stat, i) => (
                        <div key={i} style={{ background: `rgba(${stat.color === '#74b9ff' ? '116,185,255' : stat.color === '#55efc4' ? '85,239,196' : stat.color === '#feca57' ? '254,202,87' : '255,159,243'},0.1)`, border: `1px solid rgba(${stat.color === '#74b9ff' ? '116,185,255' : stat.color === '#55efc4' ? '85,239,196' : stat.color === '#feca57' ? '254,202,87' : '255,159,243'},0.2)`, borderRadius: '12px', padding: '20px' }}>
                          <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Orders Table */}
                  <div style={{ background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,159,107,0.15)' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingCart size={18} /> Recent Orders
                      </h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(0,0,0,0.2)', fontSize: '12px', color: 'rgba(252,228,214,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Order</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Customer</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Items</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Payment</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center' }}>Fulfillment</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shopifyOrders.slice(0, 50).map(order => (
                            <tr key={order.id} style={{ borderTop: '1px solid rgba(255,159,107,0.1)' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontWeight: 600, color: '#74b9ff' }}>#{order.order_number}</span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div>{order.customer?.first_name} {order.customer?.last_name}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{order.customer?.email}</div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {order.line_items?.slice(0, 3).map((item, i) => (
                                    <span key={i} style={{ fontSize: '11px', background: 'rgba(162,155,254,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                                      {item.quantity}x {item.title?.substring(0, 20)}{item.title?.length > 20 ? '...' : ''}
                                    </span>
                                  ))}
                                  {order.line_items?.length > 3 && (
                                    <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>+{order.line_items.length - 3} more</span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#55efc4' }}>
                                {formatCurrency(parseFloat(order.total_price))}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  background: order.financial_status === 'paid' ? 'rgba(85,239,196,0.2)' : order.financial_status === 'pending' ? 'rgba(254,202,87,0.2)' : 'rgba(255,107,107,0.2)',
                                  color: order.financial_status === 'paid' ? '#55efc4' : order.financial_status === 'pending' ? '#feca57' : '#ff6b6b'
                                }}>
                                  {order.financial_status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  background: order.fulfillment_status === 'fulfilled' ? 'rgba(85,239,196,0.2)' : 'rgba(255,159,243,0.2)',
                                  color: order.fulfillment_status === 'fulfilled' ? '#55efc4' : '#ff9ff3'
                                }}>
                                  {order.fulfillment_status || 'unfulfilled'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(252,228,214,0.7)' }}>
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Products Section */}
                  {shopifyProducts.length > 0 && (
                    <div style={{ marginTop: '32px', background: 'rgba(255,159,107,0.08)', border: '1px solid rgba(255,159,107,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,159,107,0.15)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Package size={18} /> Shopify Products ({shopifyProducts.length})
                        </h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', padding: '20px' }}>
                        {shopifyProducts.map(product => (
                          <div key={product.id} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                            {product.image?.src && (
                              <img src={product.image.src} alt={product.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                            )}
                            <div style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{product.title}</div>
                              <div style={{ fontSize: '12px', color: '#55efc4' }}>
                                {product.variants?.[0]?.price ? formatCurrency(parseFloat(product.variants[0].price)) : 'No price'}
                              </div>
                              <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginTop: '4px' }}>
                                {product.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0)} in stock
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* URL Import Modal */}
      {showUrlImportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Import {urlImportType === 'fragrance' ? 'Fragrance' : 'Material'} from URL</h2>
              <button onClick={() => { setShowUrlImportModal(false); setUrlImportInput(''); }} style={{ background: 'none', border: 'none', color: 'rgba(252,228,214,0.6)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <p style={{ color: 'rgba(252,228,214,0.7)', fontSize: '14px', marginBottom: '16px' }}>
              Paste a {urlImportType === 'fragrance' ? 'fragrance oil' : 'product'} URL from CandleScience. AI will extract the details automatically.
            </p>
            <input
              type="text"
              value={urlImportInput}
              onChange={(e) => setUrlImportInput(e.target.value)}
              placeholder={urlImportType === 'fragrance' ? 'https://www.candlescience.com/fragrance/...' : 'https://www.candlescience.com/wax/...'}
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '10px', color: '#fce4d6', fontSize: '14px', marginBottom: '20px' }}
              onKeyDown={(e) => e.key === 'Enter' && !urlImportLoading && (urlImportType === 'fragrance' ? importFragranceFromUrl() : importMaterialFromUrl())}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowUrlImportModal(false); setUrlImportInput(''); }} style={{ padding: '12px 24px', background: 'rgba(255,159,107,0.1)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={urlImportType === 'fragrance' ? importFragranceFromUrl : importMaterialFromUrl} disabled={urlImportLoading} style={{ padding: '12px 24px', background: urlImportLoading ? 'rgba(255,159,107,0.3)' : 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', border: 'none', borderRadius: '10px', color: urlImportLoading ? 'rgba(252,228,214,0.5)' : '#1a0a1e', cursor: urlImportLoading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {urlImportLoading ? (
                  <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Importing...</>
                ) : (
                  <><Sparkles size={16} /> Import with AI</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(255,159,107,0.3)', borderRadius: '20px', padding: '32px', width: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{editingMaterial ? 'Edit Material' : 'Add Material'}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {editingMaterial && (
                  <button
                    onClick={() => {
                      const newId = generateMaterialId(materialForm.category);
                      setMaterialForm({ ...materialForm, id: newId, name: materialForm.name + ' (Copy)' });
                      setEditingMaterial(null);
                    }}
                    style={{ padding: '8px 12px', background: 'rgba(162,155,254,0.2)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '8px', color: '#a29bfe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                    title="Duplicate this material"
                  >
                    <Copy size={16} /> Duplicate
                  </button>
                )}
                <button onClick={() => setShowMaterialModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
              </div>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={materialForm.vendor} onChange={e => setMaterialForm({ ...materialForm, vendor: e.target.value })} placeholder="e.g., CandleScience or https://..." style={{ ...inputStyle, flex: 1 }} />
                  {materialForm.vendor && (
                    <>
                      {(materialForm.vendor.startsWith('http') || materialForm.vendor.includes('amazon.com') || materialForm.vendor.includes('.com/')) && materialForm.vendor.length > 50 && !materialForm.vendor.includes('is.gd') && (
                        <button
                          type="button"
                          onClick={async () => {
                            let url = materialForm.vendor;
                            if (!url.startsWith('http')) url = 'https://' + url;
                            const short = await shortenUrl(url);
                            if (short !== url) {
                              setMaterialForm({ ...materialForm, vendor: short });
                            }
                          }}
                          style={{ padding: '10px 12px', background: 'rgba(162,155,254,0.2)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '8px', color: '#a29bfe', cursor: 'pointer' }}
                          title="Shorten URL"
                        >
                          <Link size={18} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const vendor = materialForm.vendor.trim();
                          if (vendor.startsWith('http://') || vendor.startsWith('https://')) {
                            window.open(vendor, '_blank');
                          } else {
                            window.open(`https://www.google.com/search?q=${encodeURIComponent(vendor)}`, '_blank');
                          }
                        }}
                        style={{ padding: '10px 12px', background: 'rgba(116,185,255,0.2)', border: '1px solid rgba(116,185,255,0.3)', borderRadius: '8px', color: '#74b9ff', cursor: 'pointer' }}
                        title={materialForm.vendor.startsWith('http') ? 'Open link' : 'Search vendor'}
                      >
                        <ExternalLink size={18} />
                      </button>
                    </>
                  )}
                </div>
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

              {/* Fill Capacity - Container only */}
              {materialForm.category === 'Container' && (
                <div style={{ background: 'rgba(116,185,255,0.1)', border: '1px solid rgba(116,185,255,0.2)', borderRadius: '10px', padding: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#74b9ff', marginBottom: '6px', fontWeight: 600 }}>Actual Fill Capacity (oz)</label>
                  <input type="number" step="0.1" value={materialForm.fillCapacity || ''} onChange={e => setMaterialForm({ ...materialForm, fillCapacity: parseFloat(e.target.value) || 0 })} placeholder="e.g., 8.2" style={inputStyle} />
                  <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginTop: '4px', display: 'block' }}>How much liquid the container actually holds (accounting for lid clearance and wick)</span>
                </div>
              )}

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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={fragranceForm.vendor} onChange={e => setFragranceForm({ ...fragranceForm, vendor: e.target.value })} placeholder="e.g., CandleScience or https://..." style={{ ...inputStyle, flex: 1 }} />
                    {fragranceForm.vendor && (
                      <>
                        {(fragranceForm.vendor.startsWith('http') || fragranceForm.vendor.includes('amazon.com') || fragranceForm.vendor.includes('.com/')) && fragranceForm.vendor.length > 50 && !fragranceForm.vendor.includes('is.gd') && (
                          <button
                            type="button"
                            onClick={async () => {
                              let url = fragranceForm.vendor;
                              if (!url.startsWith('http')) url = 'https://' + url;
                              const short = await shortenUrl(url);
                              if (short !== url) {
                                setFragranceForm({ ...fragranceForm, vendor: short });
                              }
                            }}
                            style={{ padding: '10px 12px', background: 'rgba(162,155,254,0.2)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '8px', color: '#a29bfe', cursor: 'pointer' }}
                            title="Shorten URL"
                          >
                            <Link size={18} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const vendor = fragranceForm.vendor.trim();
                            if (vendor.startsWith('http://') || vendor.startsWith('https://')) {
                              window.open(vendor, '_blank');
                            } else {
                              window.open(`https://www.google.com/search?q=${encodeURIComponent(vendor)}`, '_blank');
                            }
                          }}
                          style={{ padding: '10px 12px', background: 'rgba(116,185,255,0.2)', border: '1px solid rgba(116,185,255,0.3)', borderRadius: '8px', color: '#74b9ff', cursor: 'pointer' }}
                          title={fragranceForm.vendor.startsWith('http') ? 'Open link' : 'Search vendor'}
                        >
                          <ExternalLink size={18} />
                        </button>
                      </>
                    )}
                  </div>
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
              {/* Total On Hand - calculated from tracked bottles */}
              {(() => {
                // Get bottle-based inventory (source of truth)
                const bottlesForThisFragrance = fragranceBottles.filter(b =>
                  b.fragranceName === fragranceForm.name && b.status !== 'archived'
                );
                const totalOzFromBottles = getTotalOzForFragrance(fragranceForm.name, fragranceBottles);
                const hasBottles = bottlesForThisFragrance.length > 0;

                // Pricing info from price chart
                const weightedAvg = calculateWeightedPricePerOz(fragranceForm.prices, fragranceForm.quantities);

                return (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '8px' }}>
                      Total On Hand {hasBottles && <span style={{ fontSize: '10px', color: '#55efc4' }}>(from {bottlesForThisFragrance.length} bottle{bottlesForThisFragrance.length !== 1 ? 's' : ''})</span>}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: hasBottles ? 'rgba(85,239,196,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hasBottles ? 'rgba(85,239,196,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: hasBottles ? '#55efc4' : 'rgba(252,228,214,0.4)' }}>{totalOzFromBottles.toFixed(1)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>oz</div>
                      </div>
                      <div style={{ background: hasBottles ? 'rgba(116,185,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hasBottles ? 'rgba(116,185,255,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: hasBottles ? '#74b9ff' : 'rgba(252,228,214,0.4)' }}>{ozToMl(totalOzFromBottles)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>ml</div>
                      </div>
                      <div style={{ background: hasBottles ? 'rgba(162,155,254,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hasBottles ? 'rgba(162,155,254,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: hasBottles ? '#a29bfe' : 'rgba(252,228,214,0.4)' }}>{ozToGrams(totalOzFromBottles)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>grams</div>
                      </div>
                    </div>
                    {!hasBottles && (
                      <div style={{ padding: '8px 12px', background: 'rgba(255,159,107,0.1)', borderRadius: '6px', fontSize: '11px', color: '#ff9f6b', textAlign: 'center' }}>
                        Add bottles below to track inventory by weight
                      </div>
                    )}
                    {weightedAvg > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '8px 12px', background: 'rgba(254,202,87,0.1)', borderRadius: '6px', fontSize: '12px', marginTop: hasBottles ? '0' : '8px' }}>
                        <span style={{ color: 'rgba(252,228,214,0.6)' }}>Avg Price: <span style={{ color: '#feca57', fontWeight: 600 }}>${weightedAvg.toFixed(2)}/oz</span></span>
                        {hasBottles && (
                          <span style={{ color: 'rgba(252,228,214,0.6)' }}>Total Value: <span style={{ color: '#55efc4', fontWeight: 600 }}>${(totalOzFromBottles * weightedAvg).toFixed(2)}</span></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Price Chart - for pricing reference only */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '4px' }}>Price Reference</label>
                <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)', marginBottom: '8px' }}>Record prices for cost calculations (inventory tracked via bottles below)</div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 90px 70px', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', fontSize: '10px', color: 'rgba(252,228,214,0.5)' }}>
                    <span>Size</span><span>Price per Bottle</span><span>$/oz</span>
                  </div>
                  {[0.5, 1, 2, 4, 8, 16].map(size => {
                    const price = fragranceForm.prices?.[size] || 0;
                    const pricePerOz = price > 0 ? price / size : 0;
                    return (
                      <div key={size} style={{ display: 'grid', gridTemplateColumns: '60px 90px 70px', gap: '6px', padding: '6px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#fce4d6' }}>{size} oz</span>
                        <input type="number" step="0.01" min="0" value={price || ''} onChange={e => setFragranceForm({ ...fragranceForm, prices: { ...fragranceForm.prices, [size]: parseFloat(e.target.value) || 0 } })} style={{ ...inputStyle, padding: '4px 6px', fontSize: '12px', width: '100%' }} placeholder="$0.00" />
                        <span style={{ fontSize: '11px', color: pricePerOz > 0 ? '#feca57' : 'rgba(252,228,214,0.4)' }}>{pricePerOz > 0 ? `$${pricePerOz.toFixed(2)}` : '-'}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Visit Vendor Button */}
                {fragranceForm.vendor && (
                  <button
                    type="button"
                    onClick={() => {
                      const vendor = fragranceForm.vendor.trim();
                      if (vendor.startsWith('http://') || vendor.startsWith('https://')) {
                        window.open(vendor, '_blank');
                      } else {
                        const vendorUrls = {
                          'CandleScience': 'https://www.candlescience.com',
                          'Amazon': 'https://www.amazon.com',
                          'Lone Star': 'https://www.lonestarcandlesupply.com',
                          'Plant Therapy': 'https://www.planttherapy.com',
                          'Fillmore': 'https://www.fillmorecontainer.com',
                          'Uline': 'https://www.uline.com',
                          'Aztec': 'https://www.azteccandle.com',
                        };
                        const url = vendorUrls[vendor] || `https://www.google.com/search?q=${encodeURIComponent(vendor)}`;
                        window.open(url, '_blank');
                      }
                    }}
                    style={{ marginTop: '8px', padding: '8px 16px', background: 'rgba(116,185,255,0.2)', border: '1px solid rgba(116,185,255,0.3)', borderRadius: '8px', color: '#74b9ff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
                  >
                    <ExternalLink size={14} /> Visit Vendor
                  </button>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Reorder Point (total oz)</label>
                <input type="number" step="0.5" value={fragranceForm.reorderPoint} onChange={e => setFragranceForm({ ...fragranceForm, reorderPoint: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              </div>

              {/* Tracked Bottles Section */}
              {(() => {
                const bottlesForFragrance = fragranceBottles.filter(b =>
                  b.fragranceName === fragranceForm.name && b.status !== 'archived'
                );
                const totalFromBottles = getTotalOzForFragrance(fragranceForm.name, fragranceBottles);
                const hasBottles = bottlesForFragrance.length > 0;

                return (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Scale size={14} /> Tracked Bottles
                        {hasBottles && (
                          <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(85,239,196,0.2)', borderRadius: '10px', color: '#55efc4' }}>
                            Smart Sync Active
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          // Pre-fill bottle form with this fragrance
                          const fragId = editingFragrance || `FO-${Date.now()}`;
                          setBottleForm({
                            fragranceId: fragId,
                            fragranceName: fragranceForm.name,
                            vendor: fragranceForm.vendor || '',
                            purchaseDate: new Date().toISOString().split('T')[0],
                            purchaseSizeOz: 16,
                            purchasePriceTotal: fragranceForm.prices?.[16] || 0,
                            grossWeightGrams: null,
                            tareWeightGrams: null,
                            currentWeightGrams: null,
                            notes: '',
                            isNewBottle: false,
                          });
                          setShowAddBottleModal(true);
                        }}
                        disabled={!fragranceForm.name}
                        style={{
                          padding: '6px 12px',
                          background: fragranceForm.name ? 'rgba(255,159,107,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${fragranceForm.name ? 'rgba(255,159,107,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '8px',
                          color: fragranceForm.name ? '#ff9f6b' : 'rgba(252,228,214,0.3)',
                          cursor: fragranceForm.name ? 'pointer' : 'not-allowed',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={14} /> Add Bottle
                      </button>
                    </div>

                    {hasBottles ? (
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>{bottlesForFragrance.length} bottle{bottlesForFragrance.length !== 1 ? 's' : ''} tracked</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#55efc4' }}>{totalFromBottles.toFixed(1)} oz total</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                          {bottlesForFragrance.map(bottle => {
                            const ozRemaining = calculateNetOzRemaining(bottle) || 0;
                            const percent = calculatePercentRemaining(bottle) || 0;
                            const hasTare = bottle.tareWeightGrams !== null && bottle.tareWeightGrams !== undefined;
                            return (
                              <div key={bottle.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, percent)}%`, height: '100%', background: percent > 20 ? '#55efc4' : '#ff6b6b', borderRadius: '3px' }} />
                                  </div>
                                  <span style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{Math.round(percent)}%</span>
                                  {hasTare && <span style={{ fontSize: '9px', color: '#55efc4' }} title={`Tare: ${bottle.tareWeightGrams}g`}>✓</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fce4d6' }}>{ozRemaining.toFixed(1)} oz</span>
                                    <span style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)', marginLeft: '6px' }}>({bottle.currentWeightGrams}g)</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newWeight = prompt(
                                        `Update current weight for this ${bottle.purchaseSizeOz}oz bottle:\n\nCurrent: ${bottle.currentWeightGrams || 0}g\n\nEnter new weight in grams:`,
                                        bottle.currentWeightGrams || ''
                                      );
                                      if (newWeight !== null) {
                                        const weight = parseFloat(newWeight) || 0;
                                        setFragranceBottles(prev => prev.map(b =>
                                          b.id === bottle.id ? { ...b, currentWeightGrams: weight, lastWeighedAt: new Date().toISOString() } : b
                                        ));
                                      }
                                    }}
                                    style={{ padding: '4px', background: 'rgba(116,185,255,0.15)', border: '1px solid rgba(116,185,255,0.3)', borderRadius: '4px', color: '#74b9ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title={`Update weight (current: ${bottle.currentWeightGrams}g)`}
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tareWeight = prompt(
                                        `Enter empty bottle weight in grams for this ${bottle.purchaseSizeOz}oz bottle:\n\n(Weigh the empty bottle after finishing it)`,
                                        bottle.tareWeightGrams || ''
                                      );
                                      if (tareWeight !== null) {
                                        const tare = parseFloat(tareWeight) || 0;
                                        setFragranceBottles(prev => prev.map(b =>
                                          b.id === bottle.id ? { ...b, tareWeightGrams: tare } : b
                                        ));
                                      }
                                    }}
                                    style={{ padding: '4px', background: hasTare ? 'rgba(85,239,196,0.15)' : 'rgba(254,202,87,0.15)', border: `1px solid ${hasTare ? 'rgba(85,239,196,0.3)' : 'rgba(254,202,87,0.3)'}`, borderRadius: '4px', color: hasTare ? '#55efc4' : '#feca57', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title={hasTare ? `Empty weight: ${bottle.tareWeightGrams}g (click to edit)` : 'Set empty bottle weight'}
                                  >
                                    <Scale size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteBottle(bottle.id)}
                                    style={{ padding: '4px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '4px', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Delete bottle"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(85,239,196,0.1)', borderRadius: '6px', fontSize: '11px', color: '#55efc4', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={12} /> Total On Hand syncs automatically from bottle weights
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.4)', marginBottom: '4px' }}>No bottles tracked yet</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.3)' }}>Add bottles to track inventory by weight</div>
                      </div>
                    )}
                  </div>
                );
              })()}

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
                <select value={logBatchForm.recipe} onChange={e => { const r = recipes.find(rec => rec.name === e.target.value); if (r) setLogBatchForm({ ...logBatchForm, recipe: r.name }); }} style={inputStyle}>
                  <option value="">Select a recipe...</option>
                  {[...recipes].sort((a, b) => a.name.trim().localeCompare(b.name.trim())).map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
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

      {/* Quick Log Batch Modal (from Batch Builder list) */}
      {showQuickLogModal && quickLogBatch && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)', border: '1px solid rgba(162,155,254,0.3)', borderRadius: '20px', padding: '32px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Log Batch</h2>
              <button onClick={() => setShowQuickLogModal(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* Batch Summary */}
            <div style={{ background: 'rgba(162,155,254,0.1)', border: '1px solid rgba(162,155,254,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{quickLogBatch.recipe}</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'rgba(252,228,214,0.7)' }}>
                <span>{quickLogBatch.quantity} candles</span>
                <span>{quickLogBatch.size} oz</span>
                <span style={{ color: '#55efc4' }}>{formatCurrency(calculateBatch(quickLogBatch).totalBatchCost)} total</span>
              </div>
            </div>

            {/* Notes Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '8px' }}>Notes (optional)</label>
              <textarea
                value={quickLogNotes}
                onChange={e => setQuickLogNotes(e.target.value)}
                rows={3}
                placeholder="Any notes about this batch... (e.g., pour temp, issues, observations)"
                style={{ ...inputStyle, resize: 'vertical' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowQuickLogModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={confirmLogBatch} style={{ ...btnPrimary, flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)' }}><CheckCircle size={18} /> Log Batch</button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Modal - Draggable & Resizable on PC */}
      {showRecipeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000 }} onClick={cancelRecipeModal}>
          <div
            id="recipe-modal"
            className="recipe-modal"
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              ...(recipeModalPos.x !== null ? { left: recipeModalPos.x, top: recipeModalPos.y } : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }),
              width: recipeModalSize.width,
              height: recipeModalSize.height || 'auto',
              maxHeight: recipeModalSize.height ? undefined : '90vh',
              background: 'linear-gradient(135deg, #2d1b3d 0%, #3d1f35 100%)',
              border: '1px solid rgba(255,159,107,0.3)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Draggable Header */}
            <div
              onMouseDown={handleModalDragStart}
              style={{
                padding: '16px 24px',
                background: 'rgba(255,159,107,0.1)',
                borderBottom: '1px solid rgba(255,159,107,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: isDraggingModal ? 'grabbing' : 'grab',
                userSelect: 'none',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Move size={16} color="rgba(252,228,214,0.4)" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{editingRecipe ? 'Edit Recipe' : 'Create Recipe'}</h2>
              </div>
              <button onClick={cancelRecipeModal} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer', padding: '4px' }}><X size={22} /></button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Recipe Name *</label><input type="text" value={recipeForm.name} onChange={e => setRecipeForm({ ...recipeForm, name: e.target.value })} placeholder="e.g., Sunset Dreams" style={inputStyle} /></div>
                <div className="recipe-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Vibe/Theme</label><input type="text" value={recipeForm.vibe} onChange={e => setRecipeForm({ ...recipeForm, vibe: e.target.value })} placeholder="e.g., Tropical • Warm" style={inputStyle} /></div>
                  <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Style</label><input type="text" value={recipeForm.style} onChange={e => setRecipeForm({ ...recipeForm, style: e.target.value })} placeholder="e.g., Beach house luxury" style={inputStyle} /></div>
                </div>
                <div className="recipe-form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Description</label><textarea value={recipeForm.description} onChange={e => setRecipeForm({ ...recipeForm, description: e.target.value })} rows={2} placeholder="Describe the scent profile..." style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', maxHeight: '300px', overflow: 'auto' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Default FO Load %</label><input type="number" value={recipeForm.foLoad} onChange={e => setRecipeForm({ ...recipeForm, foLoad: parseFloat(e.target.value) || 0 })} style={inputStyle} /><div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '4px' }}>Can adjust in Batch Builder</div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#feca57' }}>Fragrance Components (must total 100%)</label>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0) === 100 ? '#55efc4' : '#ff6b6b' }}>Total: {recipeForm.components.reduce((sum, c) => sum + (parseFloat(c.percent) || 0), 0)}%</span>
                  </div>
                  {recipeForm.components.map((comp, idx) => (
                    <div key={idx} className="recipe-component-row" style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 40px', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <select value={comp.fragrance} onChange={e => updateComponent(idx, 'fragrance', e.target.value)} style={inputStyle}><option value="">Select fragrance...</option>{[...fragrances].sort((a, b) => a.name.localeCompare(b.name)).map(f => <option key={f.id} value={f.name}>{f.name} ({f.type})</option>)}</select>
                      <select value={comp.type} onChange={e => updateComponent(idx, 'type', e.target.value)} style={inputStyle}><option value="FO">FO</option><option value="EO">EO</option></select>
                      <input type="number" value={comp.percent} onChange={e => updateComponent(idx, 'percent', e.target.value)} placeholder="%" style={{ ...inputStyle, textAlign: 'center' }} />
                      <button onClick={() => removeComponent(idx)} disabled={recipeForm.components.length <= 1} style={{ padding: '10px', background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '8px', color: '#ff6b6b', cursor: recipeForm.components.length <= 1 ? 'not-allowed' : 'pointer', opacity: recipeForm.components.length <= 1 ? 0.5 : 1 }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={addComponent} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,159,107,0.15)', border: '1px dashed rgba(255,159,107,0.3)', borderRadius: '8px', color: '#feca57', cursor: 'pointer', fontSize: '13px', width: '100%', justifyContent: 'center' }}><Plus size={16} /> Add Component</button>
                </div>

                {/* Color Dye Section */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#a29bfe' }}>Color Dyes</label>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '12px' }}>Configure dye colors and amount per ounce for consistent coloring. The batch builder will calculate totals based on candle size.</div>
                  {(recipeForm.dyes || []).map((dye, idx) => (
                    <div key={idx} className="recipe-dye-row" style={{ display: 'grid', gridTemplateColumns: '2fr 80px 90px 40px', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={dye.name}
                        onChange={e => {
                          const newDyes = [...(recipeForm.dyes || [])];
                          newDyes[idx] = { ...newDyes[idx], name: e.target.value };
                          setRecipeForm({ ...recipeForm, dyes: newDyes });
                        }}
                        placeholder="Dye color name (e.g., Ocean Blue)"
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        value={dye.amountPerOz ?? dye.dropsPerOz ?? ''}
                        onChange={e => {
                          const newDyes = [...(recipeForm.dyes || [])];
                          newDyes[idx] = { ...newDyes[idx], amountPerOz: parseFloat(e.target.value) || 0 };
                          setRecipeForm({ ...recipeForm, dyes: newDyes });
                        }}
                        placeholder="0"
                        step="0.1"
                        style={{ ...inputStyle, textAlign: 'center' }}
                      />
                      <select
                        value={dye.unit || 'drops'}
                        onChange={e => {
                          const newDyes = [...(recipeForm.dyes || [])];
                          newDyes[idx] = { ...newDyes[idx], unit: e.target.value };
                          setRecipeForm({ ...recipeForm, dyes: newDyes });
                        }}
                        style={{ ...inputStyle, padding: '10px 8px', fontSize: '12px' }}
                      >
                        <option value="drops">drops/oz</option>
                        <option value="ml">ml/oz</option>
                        <option value="g">g/oz</option>
                        <option value="oz">oz/oz</option>
                      </select>
                      <button
                        onClick={() => {
                          const newDyes = (recipeForm.dyes || []).filter((_, i) => i !== idx);
                          setRecipeForm({ ...recipeForm, dyes: newDyes });
                        }}
                        style={{ padding: '10px', background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: '8px', color: '#ff6b6b', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setRecipeForm({ ...recipeForm, dyes: [...(recipeForm.dyes || []), { name: '', amountPerOz: 0, unit: appDefaults.defaultDyeUnit || 'drops' }] })}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(162,155,254,0.15)', border: '1px dashed rgba(162,155,254,0.3)', borderRadius: '8px', color: '#a29bfe', cursor: 'pointer', fontSize: '13px', width: '100%', justifyContent: 'center' }}
                  >
                    <Plus size={16} /> Add Dye Color
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={cancelRecipeModal} style={{ flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={saveRecipe} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Save size={18} /> {editingRecipe ? 'Save Changes' : 'Create Recipe'}</button>
                </div>
              </div>
            </div>

            {/* Resize Handle - Bottom Right Corner */}
            <div
              onMouseDown={handleModalResizeStart}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '20px',
                height: '20px',
                cursor: 'se-resize',
                background: 'linear-gradient(135deg, transparent 50%, rgba(255,159,107,0.4) 50%)',
                borderBottomRightRadius: '16px'
              }}
              title="Drag to resize"
            />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2d1f3d 0%, #1a0a1e 100%)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={28} color="#ff6b6b" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#fce4d6' }}>Delete {deleteConfirmModal.type === 'instruction' ? 'Instructions' : 'Chat'}?</h3>
            <p style={{ color: 'rgba(252,228,214,0.7)', fontSize: '14px', marginBottom: '8px', lineHeight: 1.5 }}>
              Are you sure you want to delete
            </p>
            <p style={{ color: '#feca57', fontSize: '15px', fontWeight: 500, marginBottom: '24px' }}>
              "{deleteConfirmModal.title}"
            </p>
            <p style={{ color: 'rgba(252,228,214,0.5)', fontSize: '13px', marginBottom: '24px' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmModal(null)}
                style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmModal.type === 'instruction') {
                    deleteInstruction(deleteConfirmModal.id);
                  }
                  setDeleteConfirmModal(null);
                }}
                style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', border: 'none', borderRadius: '12px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Instructions Modal */}
      {showBatchInstructionsModal && batchInstructions && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div id="batch-instructions-content" style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', color: '#1a0a1e' }}>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '2px solid #1a0a1e', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Batch Instructions</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Light By Dawn • {new Date().toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => {
                  const content = document.getElementById('batch-instructions-content');
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Batch Instructions - ${batchInstructions.recipe?.name || batchInstructions.recipeName}</title>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 20px; color: #1a0a1e; }
                      h1 { font-size: 24px; margin-bottom: 4px; }
                      h2 { font-size: 18px; margin: 20px 0 10px; border-bottom: 2px solid #1a0a1e; padding-bottom: 4px; }
                      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                      .box { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
                      .label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
                      .value { font-size: 16px; font-weight: 600; }
                      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                      th { background: #f5f5f5; font-size: 12px; text-transform: uppercase; }
                      .checkbox { width: 16px; height: 16px; border: 2px solid #1a0a1e; display: inline-block; margin-right: 8px; }
                      .notes { border: 1px solid #ddd; min-height: 100px; margin-top: 8px; padding: 12px; }
                      @media print { body { padding: 0; } }
                    </style>
                    </head><body>${content.innerHTML}</body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }} style={{ padding: '8px 16px', background: '#1a0a1e', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><Printer size={16} /> Print</button>
                <button onClick={() => setShowBatchInstructionsModal(false)} style={{ padding: '8px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><X size={20} /></button>
              </div>
            </div>

            {/* Recipe Info */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{batchInstructions.recipe?.name || batchInstructions.recipeName || 'Recipe'}</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>{batchInstructions.recipe?.vibe || ''} {batchInstructions.recipe?.description ? `• ${batchInstructions.recipe.description}` : ''}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ background: '#f8f8f8', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Quantity</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{batchInstructions.quantity}</div>
                </div>
                <div style={{ background: '#f8f8f8', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Size</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{batchInstructions.size} oz</div>
                </div>
                <div style={{ background: '#f8f8f8', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>FO Load</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{(batchInstructions.foLoad * 100).toFixed(0)}%</div>
                </div>
                <div style={{ background: '#f8f8f8', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Cost/Each</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(batchInstructions.calc?.totalCostPerCandle || 0)}</div>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #1a0a1e', paddingBottom: '4px' }}>Materials Needed</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Wax</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{batchInstructions.wax || 'Not specified'}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{batchInstructions.calc?.totalWaxBatch?.toFixed(1) || 0} oz ({(batchInstructions.calc?.totalWaxBatch / 16)?.toFixed(2) || 0} lbs) • {ozToGrams(batchInstructions.calc?.totalWaxBatch || 0)}g</div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Container</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{batchInstructions.container || 'Not specified'}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{batchInstructions.quantity} units</div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Wick</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{batchInstructions.wick || 'Not specified'}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{batchInstructions.quantity} units</div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Label</div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{batchInstructions.label === 'standard-vinyl' ? 'Standard Vinyl' : batchInstructions.label || 'None'}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{batchInstructions.quantity} units</div>
                </div>
              </div>
            </div>

            {/* Fragrance Breakdown */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #1a0a1e', paddingBottom: '4px' }}>Fragrance Breakdown</h2>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>Total Fragrance: <strong>{batchInstructions.calc?.totalFoBatch?.toFixed(2) || 0} oz</strong> ({ozToMl(batchInstructions.calc?.totalFoBatch || 0)} ml / {ozToGrams(batchInstructions.calc?.totalFoBatch || 0)}g)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' }}>Fragrance</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>%</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', width: '40px' }}>✓</th>
                  </tr>
                </thead>
                <tbody>
                  {(batchInstructions.recipe?.components || []).map((comp, i) => {
                    const totalFo = batchInstructions.size * batchInstructions.foLoad * batchInstructions.quantity;
                    const compOz = totalFo * (comp.percent / 100);
                    return (
                      <tr key={i}>
                        <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 500 }}>{comp.fragrance}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{comp.percent}%</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right', fontWeight: 600 }}>{compOz.toFixed(2)} oz<br/><span style={{ fontSize: '11px', fontWeight: 400, color: '#888' }}>{ozToMl(compOz)} ml / {ozToGrams(compOz)}g</span></td>
                        <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #1a0a1e' }}></span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Production Checklist */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #1a0a1e', paddingBottom: '4px' }}>Production Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Measure and melt wax to 180-185°F',
                  'Prepare containers: clean, center wicks',
                  'Measure fragrance oils (see breakdown above)',
                  'Add fragrance at 135-145°F, stir 2 minutes',
                  `Pour at ___°F (recommended: 135°F)`,
                  'Allow to cool undisturbed',
                  `Cure for 1-2 weeks before testing`,
                  'Apply labels and package'
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8f8f8', borderRadius: '6px' }}>
                    <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #1a0a1e', borderRadius: '3px', flexShrink: 0 }}></span>
                    <span style={{ fontSize: '14px' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #1a0a1e', paddingBottom: '4px' }}>Batch Notes</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Pour Date</div>
                  <div style={{ borderBottom: '1px solid #ccc', minHeight: '24px', marginTop: '4px' }}></div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Pour Temp</div>
                  <div style={{ borderBottom: '1px solid #ccc', minHeight: '24px', marginTop: '4px' }}></div>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Cure Until</div>
                  <div style={{ borderBottom: '1px solid #ccc', minHeight: '24px', marginTop: '4px' }}></div>
                </div>
              </div>
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Notes / Observations</div>
                <div style={{ minHeight: '80px', borderBottom: '1px solid #eee' }}></div>
                <div style={{ minHeight: '30px', borderBottom: '1px solid #eee' }}></div>
                <div style={{ minHeight: '30px' }}></div>
              </div>
            </div>

            {/* Cost Summary */}
            <div style={{ padding: '20px 24px', background: '#f8f8f8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span>Cost per Candle:</span>
                <strong>{formatCurrency(batchInstructions.calc?.totalCostPerCandle || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span>Total Batch Cost:</span>
                <strong>{formatCurrency(batchInstructions.calc?.totalBatchCost || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, paddingTop: '8px', borderTop: '2px solid #1a0a1e' }}>
                <span>Retail Value ({batchInstructions.quantity} × {formatCurrency(batchInstructions.retailPrice || 0)}):</span>
                <span>{formatCurrency((batchInstructions.quantity || 0) * (batchInstructions.retailPrice || 0))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ Batch Wizard Modal ============ */}
      {showBatchWizard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #2d1b3d 0%, #1a0a1e 100%)', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', border: '1px solid rgba(255,159,243,0.3)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,159,243,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff9ff3 0%, #a29bfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={24} color="#1a0a1e" />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', background: 'linear-gradient(135deg, #ff9ff3 0%, #a29bfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Batch Wizard</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>Step {wizardStep} of 5 • Weight-based tracking</p>
                </div>
              </div>
              <button onClick={() => setShowBatchWizard(false)} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer', padding: '8px' }}><X size={24} /></button>
            </div>

            {/* Progress Steps */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,159,243,0.1)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {[
                { num: 1, label: 'Select Bottles', icon: Droplets },
                { num: 2, label: 'Choose Recipe', icon: BookOpen },
                { num: 3, label: 'Configure', icon: Settings },
                { num: 4, label: 'Review', icon: ClipboardList },
                { num: 5, label: 'Weigh-In', icon: Scale },
              ].map(step => (
                <div
                  key={step.num}
                  onClick={() => { if (step.num < wizardStep) setWizardStep(step.num); }}
                  style={{
                    flex: 1, minWidth: '80px', padding: '12px', borderRadius: '10px', textAlign: 'center',
                    background: wizardStep === step.num ? 'linear-gradient(135deg, rgba(255,159,243,0.3) 0%, rgba(162,155,254,0.3) 100%)' : wizardStep > step.num ? 'rgba(85,239,196,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${wizardStep === step.num ? 'rgba(255,159,243,0.5)' : wizardStep > step.num ? 'rgba(85,239,196,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    cursor: step.num < wizardStep ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                >
                  <step.icon size={18} color={wizardStep === step.num ? '#ff9ff3' : wizardStep > step.num ? '#55efc4' : 'rgba(252,228,214,0.4)'} style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '11px', color: wizardStep === step.num ? '#ff9ff3' : wizardStep > step.num ? '#55efc4' : 'rgba(252,228,214,0.4)', fontWeight: wizardStep === step.num ? 600 : 400 }}>{step.label}</div>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Step 1: Select Bottles */}
              {wizardStep === 1 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Select Fragrance Bottles</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)' }}>Choose bottles from your inventory to use in this batch</p>
                    </div>
                    <button onClick={() => { setBottleForm({ fragranceId: '', fragranceName: '', vendor: '', purchaseDate: new Date().toISOString().split('T')[0], purchaseSizeOz: 16, purchasePriceTotal: 0, grossWeightGrams: null, tareWeightGrams: null, currentWeightGrams: null, notes: '' }); setShowAddBottleModal(true); }} style={{ ...btnPrimary, padding: '10px 16px', fontSize: '13px' }}><Plus size={16} /> Add Bottle</button>
                  </div>

                  {fragranceBottles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,159,243,0.3)' }}>
                      <Droplets size={48} color="rgba(255,159,243,0.3)" style={{ marginBottom: '16px' }} />
                      <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>No Bottles Tracked Yet</h4>
                      <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.5)', marginBottom: '16px' }}>Add fragrance bottles to track their weight and inventory</p>
                      <button onClick={() => { setBottleForm({ fragranceId: '', fragranceName: '', vendor: '', purchaseDate: new Date().toISOString().split('T')[0], purchaseSizeOz: 16, purchasePriceTotal: 0, grossWeightGrams: null, tareWeightGrams: null, currentWeightGrams: null, notes: '' }); setShowAddBottleModal(true); }} style={btnPrimary}><Plus size={18} /> Add Your First Bottle</button>
                    </div>
                  ) : (
                    <div>
                      {/* Group bottles by fragrance name */}
                      {Object.entries(fragranceBottles.reduce((acc, b) => {
                        if (!acc[b.fragranceName]) acc[b.fragranceName] = [];
                        acc[b.fragranceName].push(b);
                        return acc;
                      }, {})).sort((a, b) => a[0].localeCompare(b[0])).map(([fragranceName, bottles]) => (
                        <div key={fragranceName} style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#feca57', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Droplets size={16} />
                            {fragranceName}
                            <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(252,228,214,0.5)' }}>({getTotalOzForFragrance(fragranceName, fragranceBottles).toFixed(1)} oz available)</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                            {bottles.filter(b => b.status !== 'archived').map(bottle => {
                              const isSelected = wizardData.selectedBottles.includes(bottle.id);
                              const percentRemaining = calculatePercentRemaining(bottle);
                              const ozRemaining = calculateNetOzRemaining(bottle);
                              const status = getBottleStatus(bottle);
                              return (
                                <div
                                  key={bottle.id}
                                  onClick={() => {
                                    setWizardData(prev => ({
                                      ...prev,
                                      selectedBottles: isSelected
                                        ? prev.selectedBottles.filter(id => id !== bottle.id)
                                        : [...prev.selectedBottles, bottle.id]
                                    }));
                                  }}
                                  style={{
                                    padding: '14px', borderRadius: '12px', cursor: 'pointer',
                                    background: isSelected ? 'rgba(85,239,196,0.15)' : 'rgba(0,0,0,0.2)',
                                    border: `2px solid ${isSelected ? '#55efc4' : status === 'low' ? 'rgba(255,159,107,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{bottle.purchaseSizeOz}oz Bottle</div>
                                    <div style={{
                                      width: '20px', height: '20px', borderRadius: '50%',
                                      background: isSelected ? '#55efc4' : 'rgba(255,255,255,0.1)',
                                      border: `2px solid ${isSelected ? '#55efc4' : 'rgba(255,255,255,0.2)'}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                      {isSelected && <Check size={12} color="#1a0a1e" />}
                                    </div>
                                  </div>

                                  {/* Progress bar */}
                                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
                                    <div style={{
                                      height: '100%', borderRadius: '3px',
                                      width: `${percentRemaining || 0}%`,
                                      background: status === 'low' ? '#ff9f6b' : status === 'empty' ? '#ff6b6b' : '#55efc4'
                                    }} />
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'rgba(252,228,214,0.6)' }}>
                                      {ozRemaining !== null ? `${ozRemaining.toFixed(1)} oz left` : 'Not weighed'}
                                    </span>
                                    <span style={{ color: status === 'low' ? '#ff9f6b' : status === 'empty' ? '#ff6b6b' : '#55efc4', fontWeight: 600 }}>
                                      {percentRemaining !== null ? `${Math.round(percentRemaining)}%` : '-'}
                                    </span>
                                  </div>

                                  {bottle.currentWeightGrams && (
                                    <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.4)', marginTop: '6px' }}>
                                      Current: {bottle.currentWeightGrams}g
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {wizardData.selectedBottles.length > 0 && (
                        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(85,239,196,0.1)', border: '1px solid rgba(85,239,196,0.3)', borderRadius: '12px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#55efc4', marginBottom: '8px' }}>
                            {wizardData.selectedBottles.length} bottle{wizardData.selectedBottles.length !== 1 ? 's' : ''} selected
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.7)' }}>
                            Total available: {wizardData.selectedBottles.reduce((sum, id) => {
                              const b = fragranceBottles.find(fb => fb.id === id);
                              return sum + (calculateNetOzRemaining(b) || 0);
                            }, 0).toFixed(2)} oz
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Choose Recipe */}
              {wizardStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Select Recipe</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '20px' }}>Choose a recipe compatible with your selected bottles</p>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {recipes.filter(r => !r.archived).sort((a, b) => a.name.localeCompare(b.name)).map(recipe => {
                      // Check compatibility with selected bottles
                      const selectedBottleFragrances = [...new Set(wizardData.selectedBottles.map(id => fragranceBottles.find(b => b.id === id)?.fragranceName).filter(Boolean))];
                      const recipeFragrances = recipe.components?.map(c => c.fragrance) || [];
                      const matchingFragrances = recipeFragrances.filter(f => selectedBottleFragrances.includes(f));
                      const isFullyCompatible = recipeFragrances.every(f => selectedBottleFragrances.includes(f));
                      const isPartialMatch = matchingFragrances.length > 0;
                      const isSelected = wizardData.recipe === recipe.name;

                      return (
                        <div
                          key={recipe.id}
                          onClick={() => setWizardData({ ...wizardData, recipe: recipe.name, foLoad: (recipe.foLoad || 10) / 100 })}
                          style={{
                            padding: '16px', borderRadius: '12px', cursor: 'pointer',
                            background: isSelected ? 'rgba(85,239,196,0.15)' : 'rgba(0,0,0,0.2)',
                            border: `2px solid ${isSelected ? '#55efc4' : isFullyCompatible ? 'rgba(85,239,196,0.3)' : isPartialMatch ? 'rgba(255,159,107,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '16px', fontWeight: 600 }}>{recipe.name}</span>
                                {isFullyCompatible && wizardData.selectedBottles.length > 0 && (
                                  <span style={{ padding: '2px 8px', background: 'rgba(85,239,196,0.2)', borderRadius: '10px', fontSize: '10px', color: '#55efc4', fontWeight: 600 }}>COMPATIBLE</span>
                                )}
                                {isPartialMatch && !isFullyCompatible && wizardData.selectedBottles.length > 0 && (
                                  <span style={{ padding: '2px 8px', background: 'rgba(255,159,107,0.2)', borderRadius: '10px', fontSize: '10px', color: '#ff9f6b', fontWeight: 600 }}>PARTIAL</span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#feca57', marginBottom: '8px' }}>{recipe.vibe}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {recipe.components?.map((c, i) => {
                                  const hasBottle = selectedBottleFragrances.includes(c.fragrance);
                                  return (
                                    <span key={i} style={{
                                      padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                                      background: hasBottle ? 'rgba(85,239,196,0.2)' : 'rgba(255,159,107,0.15)',
                                      color: hasBottle ? '#55efc4' : 'rgba(252,228,214,0.7)'
                                    }}>
                                      {c.fragrance} {c.percent}%
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: isSelected ? '#55efc4' : 'rgba(255,255,255,0.1)',
                              border: `2px solid ${isSelected ? '#55efc4' : 'rgba(255,255,255,0.2)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px'
                            }}>
                              {isSelected && <Check size={14} color="#1a0a1e" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Configure Batch */}
              {wizardStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Configure Batch</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '20px' }}>Set quantity, size, and materials</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Quantity</label>
                      <input type="number" value={wizardData.quantity} onChange={e => setWizardData({ ...wizardData, quantity: parseInt(e.target.value) || 1 })} min={1} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Size (oz)</label>
                      <input type="number" value={wizardData.size} onChange={e => setWizardData({ ...wizardData, size: parseFloat(e.target.value) || 1 })} min={1} step={0.5} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Container</label>
                      <select value={wizardData.container} onChange={e => setWizardData({ ...wizardData, container: e.target.value })} style={inputStyle}>
                        <option value="">Select container...</option>
                        {materials.filter(m => m.category === 'Container').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Wick</label>
                      <select value={wizardData.wick} onChange={e => setWizardData({ ...wizardData, wick: e.target.value })} style={inputStyle}>
                        <option value="">Select wick...</option>
                        {materials.filter(m => m.category === 'Wick').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                      {/* Wick suggestion based on container */}
                      {wizardData.container && (
                        <div style={{ fontSize: '11px', color: '#a29bfe', marginTop: '4px' }}>
                          💡 Tip: {wizardData.size <= 4 ? 'CD-10' : wizardData.size <= 8 ? 'CD-14' : 'CD-18'} recommended for {wizardData.size}oz
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Label</label>
                      <select value={wizardData.label} onChange={e => setWizardData({ ...wizardData, label: e.target.value })} style={inputStyle}>
                        <option value="">No label</option>
                        <option value="standard-vinyl">Standard Vinyl</option>
                        {materials.filter(m => m.category === 'Label').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Packaging</label>
                      <select value={wizardData.packaging} onChange={e => setWizardData({ ...wizardData, packaging: e.target.value })} style={inputStyle}>
                        <option value="">No packaging</option>
                        {materials.filter(m => m.category === 'Packaging').map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>FO Load %</label>
                      <input type="number" value={(wizardData.foLoad * 100).toFixed(0)} onChange={e => setWizardData({ ...wizardData, foLoad: (parseFloat(e.target.value) || 10) / 100 })} min={1} max={15} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Retail Price ($)</label>
                      <input type="number" value={wizardData.retailPrice} onChange={e => setWizardData({ ...wizardData, retailPrice: parseFloat(e.target.value) || 0 })} min={0} step={0.50} style={inputStyle} />
                    </div>
                  </div>

                  {/* Materials needed preview */}
                  <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Materials Needed</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'rgba(254,202,87,0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#feca57', textTransform: 'uppercase' }}>Wax</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{(wizardData.size * (1 - wizardData.foLoad) * wizardData.quantity).toFixed(1)} oz</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{((wizardData.size * (1 - wizardData.foLoad) * wizardData.quantity) / 16).toFixed(2)} lbs</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(162,155,254,0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#a29bfe', textTransform: 'uppercase' }}>Fragrance</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{(wizardData.size * wizardData.foLoad * wizardData.quantity).toFixed(1)} oz</div>
                        <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)' }}>{(wizardData.foLoad * 100).toFixed(0)}% load</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(116,185,255,0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#74b9ff', textTransform: 'uppercase' }}>Containers</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{wizardData.quantity}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(255,159,243,0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#ff9ff3', textTransform: 'uppercase' }}>Wicks</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{wizardData.quantity}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {wizardStep === 4 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Review Batch</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '20px' }}>Confirm everything looks correct before starting</p>

                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', background: 'rgba(255,159,243,0.1)', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#ff9ff3' }}>{wizardData.quantity}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>Candles</div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(162,155,254,0.1)', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#a29bfe' }}>{wizardData.size}oz</div>
                      <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>Each</div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(85,239,196,0.1)', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#55efc4' }}>{formatCurrency(wizardData.retailPrice * wizardData.quantity)}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.6)' }}>Retail Value</div>
                    </div>
                  </div>

                  {/* Recipe */}
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Recipe</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#feca57' }}>{wizardData.recipe || 'Not selected'}</div>
                    {wizardData.recipe && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                        {recipes.find(r => r.name === wizardData.recipe)?.components?.map((c, i) => (
                          <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,159,107,0.15)', borderRadius: '6px', fontSize: '12px' }}>{c.fragrance} {c.percent}%</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Materials */}
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Materials</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                      <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Container:</span> <span style={{ fontWeight: 500 }}>{wizardData.container || 'Not selected'}</span></div>
                      <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Wick:</span> <span style={{ fontWeight: 500 }}>{wizardData.wick || 'Not selected'}</span></div>
                      <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Label:</span> <span style={{ fontWeight: 500 }}>{wizardData.label || 'None'}</span></div>
                      <div><span style={{ color: 'rgba(252,228,214,0.5)' }}>Packaging:</span> <span style={{ fontWeight: 500 }}>{wizardData.packaging || 'None'}</span></div>
                    </div>
                  </div>

                  {/* Selected Bottles */}
                  {wizardData.selectedBottles.length > 0 && (
                    <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Selected Bottles ({wizardData.selectedBottles.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {wizardData.selectedBottles.map(id => {
                          const bottle = fragranceBottles.find(b => b.id === id);
                          if (!bottle) return null;
                          return (
                            <div key={id} style={{ padding: '8px 12px', background: 'rgba(85,239,196,0.15)', borderRadius: '8px', fontSize: '12px' }}>
                              <span style={{ fontWeight: 500 }}>{bottle.fragranceName}</span>
                              <span style={{ color: 'rgba(252,228,214,0.5)', marginLeft: '8px' }}>{calculateNetOzRemaining(bottle)?.toFixed(1) || '?'} oz</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Post-Batch Weigh-In */}
              {wizardStep === 5 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Post-Batch Weigh-In</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '20px' }}>Weigh your bottles after the batch to update inventory</p>

                  {wizardData.selectedBottles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                      <Scale size={48} color="rgba(255,159,243,0.3)" style={{ marginBottom: '16px' }} />
                      <p style={{ color: 'rgba(252,228,214,0.6)' }}>No bottles were selected for this batch</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {wizardData.selectedBottles.map(id => {
                        const bottle = fragranceBottles.find(b => b.id === id);
                        if (!bottle) return null;
                        const ozBefore = calculateNetOzRemaining(bottle);
                        const recipe = recipes.find(r => r.name === wizardData.recipe);
                        const component = recipe?.components?.find(c => c.fragrance === bottle.fragranceName);
                        const expectedUsage = component ? (wizardData.size * wizardData.foLoad * wizardData.quantity * (component.percent / 100)) : 0;

                        return (
                          <div key={id} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#feca57' }}>{bottle.fragranceName}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>{bottle.purchaseSizeOz}oz bottle</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: 'rgba(252,228,214,0.5)' }}>Before: {ozBefore?.toFixed(1) || '?'} oz</div>
                                <div style={{ fontSize: '12px', color: '#ff9f6b' }}>Expected use: ~{expectedUsage.toFixed(2)} oz</div>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>New Weight (grams)</label>
                                <input
                                  type="number"
                                  value={wizardData[`newWeight_${id}`] || ''}
                                  onChange={e => setWizardData({ ...wizardData, [`newWeight_${id}`]: parseFloat(e.target.value) || null })}
                                  placeholder="Enter current weight"
                                  style={{ ...inputStyle, padding: '10px' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '20px' }}>
                                  <input
                                    type="checkbox"
                                    checked={wizardData[`empty_${id}`] || false}
                                    onChange={e => setWizardData({ ...wizardData, [`empty_${id}`]: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: '#ff6b6b' }}
                                  />
                                  <span style={{ fontSize: '12px', color: '#ff6b6b' }}>Mark as empty</span>
                                </label>
                              </div>
                            </div>

                            {wizardData[`empty_${id}`] && (
                              <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Tare Weight (empty bottle in grams)</label>
                                <input
                                  type="number"
                                  value={wizardData[`tare_${id}`] || ''}
                                  onChange={e => setWizardData({ ...wizardData, [`tare_${id}`]: parseFloat(e.target.value) || null })}
                                  placeholder="Weigh empty bottle for accurate tracking"
                                  style={{ ...inputStyle, padding: '10px' }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,159,243,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => wizardStep === 1 ? setShowBatchWizard(false) : setWizardStep(wizardStep - 1)}
                style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}
              >
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>

              {wizardStep < 5 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  disabled={
                    (wizardStep === 2 && !wizardData.recipe) ||
                    (wizardStep === 3 && (!wizardData.quantity || !wizardData.size))
                  }
                  style={{
                    ...btnPrimary,
                    opacity: ((wizardStep === 2 && !wizardData.recipe) || (wizardStep === 3 && (!wizardData.quantity || !wizardData.size))) ? 0.5 : 1,
                    cursor: ((wizardStep === 2 && !wizardData.recipe) || (wizardStep === 3 && (!wizardData.quantity || !wizardData.size))) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {wizardStep === 4 ? 'Start Batch' : 'Next'} <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Update bottle weights
                    setFragranceBottles(prev => prev.map(bottle => {
                      if (wizardData.selectedBottles.includes(bottle.id)) {
                        const newWeight = wizardData[`newWeight_${bottle.id}`];
                        const isEmpty = wizardData[`empty_${bottle.id}`];
                        const tareWeight = wizardData[`tare_${bottle.id}`];

                        const recipe = recipes.find(r => r.name === wizardData.recipe);
                        const component = recipe?.components?.find(c => c.fragrance === bottle.fragranceName);
                        const ozUsed = component ? (wizardData.size * wizardData.foLoad * wizardData.quantity * (component.percent / 100)) : 0;

                        return {
                          ...bottle,
                          currentWeightGrams: newWeight || bottle.currentWeightGrams,
                          tareWeightGrams: isEmpty && tareWeight ? tareWeight : bottle.tareWeightGrams,
                          status: isEmpty ? 'empty' : getBottleStatus({ ...bottle, currentWeightGrams: newWeight || bottle.currentWeightGrams }),
                          lastWeighedAt: new Date().toISOString(),
                          usageHistory: [...(bottle.usageHistory || []), {
                            date: new Date().toISOString(),
                            batchId: `BATCH-${Date.now()}`,
                            ozUsed,
                            weightBefore: bottle.currentWeightGrams,
                            weightAfter: newWeight || bottle.currentWeightGrams,
                            recipe: wizardData.recipe,
                            quantity: wizardData.quantity,
                          }]
                        };
                      }
                      return bottle;
                    }));

                    // Log the batch to history
                    const recipe = recipes.find(r => r.name === wizardData.recipe);
                    const newBatch = {
                      id: `BATCH-${Date.now()}`,
                      date: new Date().toISOString().split('T')[0],
                      recipe: wizardData.recipe,
                      quantity: wizardData.quantity,
                      size: wizardData.size,
                      container: wizardData.container,
                      wick: wizardData.wick,
                      label: wizardData.label,
                      packaging: wizardData.packaging,
                      foLoad: wizardData.foLoad,
                      retailPrice: wizardData.retailPrice,
                      notes: `Batch Wizard - Bottles used: ${wizardData.selectedBottles.map(id => fragranceBottles.find(b => b.id === id)?.fragranceName).filter(Boolean).join(', ')}`,
                      method: 'wizard',
                    };
                    setBatchHistory(prev => [newBatch, ...prev]);

                    // Deduct materials (skip fragrances if bottles are selected - Smart Sync handles it)
                    if (recipe) {
                      const hasBottlesSelected = wizardData.selectedBottles.length > 0;
                      deductBatchMaterials(
                        { recipe: wizardData.recipe, quantity: wizardData.quantity, size: wizardData.size },
                        { skipFragrances: hasBottlesSelected }
                      );
                    }

                    // Close wizard
                    setShowBatchWizard(false);
                    setWizardStep(1);
                  }}
                  style={btnPrimary}
                >
                  <CheckCircle size={18} /> Complete Batch
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Bottle Modal - with Quick Add for bulk entry */}
      {showAddBottleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #2d1b3d 0%, #1a0a1e 100%)', borderRadius: '20px', width: '100%', maxWidth: '550px', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(255,159,243,0.3)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,159,243,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', background: 'linear-gradient(135deg, #ff9ff3 0%, #a29bfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Add Fragrance Bottle</h2>
                {quickAddCount > 0 && (
                  <div style={{ fontSize: '12px', color: '#55efc4', marginTop: '4px' }}>
                    ✓ {quickAddCount} bottle{quickAddCount !== 1 ? 's' : ''} added this session
                  </div>
                )}
              </div>
              <button onClick={() => { setShowAddBottleModal(false); setQuickAddCount(0); setLastAddedBottles([]); }} style={{ background: 'none', border: 'none', color: '#fce4d6', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* Recently Added - shown during quick add session */}
            {lastAddedBottles.length > 0 && (
              <div style={{ padding: '12px 24px', background: 'rgba(85,239,196,0.1)', borderBottom: '1px solid rgba(85,239,196,0.2)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(252,228,214,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>Recently Added</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {lastAddedBottles.slice(-5).map((b, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: 'rgba(85,239,196,0.2)', borderRadius: '6px', fontSize: '11px', color: '#55efc4' }}>
                      {b.fragranceName} ({b.currentWeightGrams}g)
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* New vs Existing Toggle */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setBottleForm({ ...bottleForm, isNewBottle: false })}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: !bottleForm.isNewBottle ? 'rgba(255,159,107,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${!bottleForm.isNewBottle ? '#ff9f6b' : 'rgba(255,255,255,0.1)'}`,
                      color: !bottleForm.isNewBottle ? '#ff9f6b' : 'rgba(252,228,214,0.5)',
                      fontWeight: !bottleForm.isNewBottle ? 600 : 400, fontSize: '13px', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>Existing Bottle</div>
                    <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.8 }}>Partially used, estimate oz</div>
                  </button>
                  <button
                    onClick={() => setBottleForm({ ...bottleForm, isNewBottle: true })}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: bottleForm.isNewBottle ? 'rgba(85,239,196,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${bottleForm.isNewBottle ? '#55efc4' : 'rgba(255,255,255,0.1)'}`,
                      color: bottleForm.isNewBottle ? '#55efc4' : 'rgba(252,228,214,0.5)',
                      fontWeight: bottleForm.isNewBottle ? 600 : 400, fontSize: '13px', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>New Bottle</div>
                    <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.8 }}>Full/unopened, exact oz</div>
                  </button>
                </div>

                {/* Fragrance Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '6px' }}>Fragrance *</label>
                  <select
                    value={bottleForm.fragranceId}
                    onChange={e => {
                      const frag = fragrances.find(f => f.id === e.target.value);
                      setBottleForm({
                        ...bottleForm,
                        fragranceId: e.target.value,
                        fragranceName: frag?.name || '',
                        vendor: frag?.vendor || '',
                        purchaseSizeOz: frag?.packageSize || 16,
                        purchasePriceTotal: frag?.packageCost || 0,
                      });
                    }}
                    style={inputStyle}
                  >
                    <option value="">Select fragrance...</option>
                    {[...fragrances].sort((a, b) => a.name.localeCompare(b.name)).map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                    ))}
                  </select>
                </div>

                {/* Streamlined row for size and weight - the key fields for quick add */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Size (oz)</label>
                    <input type="number" value={bottleForm.purchaseSizeOz} onChange={e => setBottleForm({ ...bottleForm, purchaseSizeOz: parseFloat(e.target.value) || 0 })} style={{ ...inputStyle, padding: '10px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Price ($)</label>
                    <input type="number" value={bottleForm.purchasePriceTotal} onChange={e => setBottleForm({ ...bottleForm, purchasePriceTotal: parseFloat(e.target.value) || 0 })} step={0.01} style={{ ...inputStyle, padding: '10px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a29bfe', marginBottom: '4px', fontWeight: 600 }}>Weight (g) *</label>
                    <input
                      type="number"
                      value={bottleForm.currentWeightGrams || ''}
                      onChange={e => {
                        const weight = parseFloat(e.target.value) || null;
                        setBottleForm({ ...bottleForm, grossWeightGrams: bottleForm.isNewBottle ? weight : bottleForm.grossWeightGrams, currentWeightGrams: weight });
                      }}
                      placeholder="Scale reading"
                      style={{ ...inputStyle, padding: '10px', borderColor: 'rgba(162,155,254,0.4)' }}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Collapsible extra fields */}
                <details style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '13px', color: 'rgba(252,228,214,0.6)', marginBottom: '12px' }}>More options (vendor, date, notes)</summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Vendor URL</label>
                      <input
                        type="text"
                        value={bottleForm.vendor}
                        onChange={e => setBottleForm({ ...bottleForm, vendor: e.target.value })}
                        onBlur={async (e) => {
                          const url = e.target.value;
                          if (url && url.startsWith('http')) {
                            const shortened = await shortenUrl(url);
                            if (shortened !== url) {
                              setBottleForm(prev => ({ ...prev, vendor: shortened }));
                            }
                          }
                        }}
                        placeholder="URL (will auto-shorten)"
                        style={{ ...inputStyle, padding: '10px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Purchase Date</label>
                      <input type="date" value={bottleForm.purchaseDate} onChange={e => setBottleForm({ ...bottleForm, purchaseDate: e.target.value })} style={{ ...inputStyle, padding: '10px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(252,228,214,0.5)', marginBottom: '4px' }}>Notes</label>
                      <textarea value={bottleForm.notes} onChange={e => setBottleForm({ ...bottleForm, notes: e.target.value })} rows={2} placeholder="Optional notes..." style={{ ...inputStyle, padding: '10px', resize: 'vertical' }} />
                    </div>
                  </div>
                </details>

                {/* Oz remaining preview - different display for new vs existing */}
                {bottleForm.currentWeightGrams && bottleForm.purchaseSizeOz && (
                  <div style={{ padding: '12px', background: bottleForm.isNewBottle ? 'rgba(85,239,196,0.15)' : 'rgba(255,159,107,0.1)', borderRadius: '8px', border: `1px solid ${bottleForm.isNewBottle ? 'rgba(85,239,196,0.3)' : 'rgba(255,159,107,0.2)'}` }}>
                    {bottleForm.isNewBottle ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: 'rgba(252,228,214,0.7)' }}>Contents:</span>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#55efc4' }}>
                            {bottleForm.purchaseSizeOz} oz <Check size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#55efc4', marginTop: '4px' }}>
                          Full bottle - exact amount known
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(252,228,214,0.4)', marginTop: '2px' }}>
                          Tare weight will be calculated: {(bottleForm.currentWeightGrams - (bottleForm.purchaseSizeOz * GRAMS_PER_OZ)).toFixed(0)}g estimated
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: 'rgba(252,228,214,0.7)' }}>Estimated remaining:</span>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#ff9f6b' }}>
                            ~{((bottleForm.currentWeightGrams * 0.9) / GRAMS_PER_OZ).toFixed(1)} oz
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#ff9f6b', marginTop: '4px' }}>
                          Approximate - based on estimated 10% tare weight
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => { setShowAddBottleModal(false); setQuickAddCount(0); setLastAddedBottles([]); }} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fce4d6', cursor: 'pointer', fontSize: '14px' }}>
                  {quickAddCount > 0 ? 'Done' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    if (!bottleForm.fragranceName) return;
                    const newBottle = {
                      id: generateBottleId(),
                      fragranceId: bottleForm.fragranceId,
                      fragranceName: bottleForm.fragranceName,
                      vendor: bottleForm.vendor,
                      purchaseDate: bottleForm.purchaseDate,
                      purchaseSizeOz: bottleForm.purchaseSizeOz,
                      purchasePriceTotal: bottleForm.purchasePriceTotal,
                      grossWeightGrams: bottleForm.grossWeightGrams,
                      tareWeightGrams: bottleForm.tareWeightGrams,
                      currentWeightGrams: bottleForm.currentWeightGrams,
                      status: 'active',
                      lastWeighedAt: bottleForm.currentWeightGrams ? new Date().toISOString() : null,
                      notes: bottleForm.notes,
                      usageHistory: [],
                      createdAt: new Date().toISOString(),
                    };
                    setFragranceBottles(prev => [...prev, newBottle]);
                    setQuickAddCount(prev => prev + 1);
                    setLastAddedBottles(prev => [...prev, newBottle]);
                    // Reset form but keep fragrance selected for adding multiple of same type
                    setBottleForm(prev => ({
                      ...prev,
                      grossWeightGrams: null,
                      currentWeightGrams: null,
                      notes: '',
                    }));
                  }}
                  disabled={!bottleForm.fragranceName || !bottleForm.currentWeightGrams}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', background: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)', border: 'none', borderRadius: '10px', color: '#1a0a1e', fontWeight: 600, cursor: 'pointer', fontSize: '14px', opacity: (!bottleForm.fragranceName || !bottleForm.currentWeightGrams) ? 0.5 : 1 }}
                >
                  <Zap size={18} /> Quick Add
                </button>
                <button
                  onClick={() => {
                    if (!bottleForm.fragranceName) return;
                    const newBottle = {
                      id: generateBottleId(),
                      fragranceId: bottleForm.fragranceId,
                      fragranceName: bottleForm.fragranceName,
                      vendor: bottleForm.vendor,
                      purchaseDate: bottleForm.purchaseDate,
                      purchaseSizeOz: bottleForm.purchaseSizeOz,
                      purchasePriceTotal: bottleForm.purchasePriceTotal,
                      grossWeightGrams: bottleForm.grossWeightGrams,
                      tareWeightGrams: bottleForm.tareWeightGrams,
                      currentWeightGrams: bottleForm.currentWeightGrams,
                      status: 'active',
                      lastWeighedAt: bottleForm.currentWeightGrams ? new Date().toISOString() : null,
                      notes: bottleForm.notes,
                      usageHistory: [],
                      createdAt: new Date().toISOString(),
                    };
                    setFragranceBottles(prev => [...prev, newBottle]);
                    setShowAddBottleModal(false);
                    setQuickAddCount(0);
                    setLastAddedBottles([]);
                  }}
                  disabled={!bottleForm.fragranceName}
                  style={{ ...btnPrimary, padding: '14px 20px', opacity: !bottleForm.fragranceName ? 0.5 : 1 }}
                >
                  <Plus size={18} /> Add & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Button - Draggable & Sparkly */}
      <button
        onClick={() => {
          // Only toggle if we didn't drag
          if (!fabDragMoved.current) {
            setShowGeneralChat(!showGeneralChat);
          }
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const rect = e.currentTarget.getBoundingClientRect();
          fabDragOffset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          };
          fabDragMoved.current = false;
          setIsFabDragging(true);
        }}
        onTouchMove={(e) => {
          if (!isFabDragging) return;
          fabDragMoved.current = true;
          const touch = e.touches[0];
          const newX = Math.max(0, Math.min(window.innerWidth - 48, touch.clientX - fabDragOffset.current.x));
          const newY = Math.max(0, Math.min(window.innerHeight - 48, touch.clientY - fabDragOffset.current.y));
          setMobileAiFabPos({ x: newX, y: newY });
        }}
        onTouchEnd={() => {
          setIsFabDragging(false);
          setTimeout(() => { fabDragMoved.current = false; }, 100);
        }}
        style={{
          position: 'fixed',
          ...(mobileAiFabPos.x !== null ? {
            left: mobileAiFabPos.x,
            top: mobileAiFabPos.y
          } : {
            bottom: '24px',
            right: '24px'
          }),
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
          border: 'none',
          cursor: 'grab',
          boxShadow: '0 4px 20px rgba(162,155,254,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 900,
          touchAction: 'none',
          transition: 'transform 0.2s ease'
        }}
        title="AI Assistant"
      >
        <Sparkles size={22} color="#fff" />
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
