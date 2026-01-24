-- Light By Dawn Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xxtoscqihhiiqwjooaxj/sql

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  vendor TEXT,
  unit TEXT,
  package_size NUMERIC,
  package_cost NUMERIC,
  qty_on_hand NUMERIC DEFAULT 0,
  reorder_point NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fragrances table
CREATE TABLE IF NOT EXISTS fragrances (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT, -- 'FO' or 'EO'
  vendor TEXT,
  package_size NUMERIC,
  package_cost NUMERIC,
  flash_point NUMERIC,
  max_load NUMERIC,
  qty_on_hand NUMERIC DEFAULT 0,
  reorder_point NUMERIC DEFAULT 0,
  prices JSONB DEFAULT '{}',      -- Per-size pricing: { "0.5": 5.99, "1": 9.99, ... }
  quantities JSONB DEFAULT '{}',  -- Per-size inventory: { "0.5": 2, "1": 5, ... }
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes table (components stored as JSONB for simplicity)
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  vibe TEXT,
  style TEXT,
  description TEXT,
  container TEXT,
  wax TEXT,
  wick TEXT,
  size NUMERIC,
  fo_load NUMERIC,
  components JSONB DEFAULT '[]',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batch history table
CREATE TABLE IF NOT EXISTS batch_history (
  id TEXT PRIMARY KEY,
  recipe TEXT NOT NULL,
  quantity NUMERIC,
  size NUMERIC,
  date TIMESTAMPTZ,
  notes TEXT,
  pour_temp NUMERIC,
  cure_date TIMESTAMPTZ,
  cold_throw NUMERIC,
  hot_throw NUMERIC,
  burn_time NUMERIC,
  total_cost NUMERIC,
  cost_per_candle NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Batch list (pending batches)
CREATE TABLE IF NOT EXISTS batch_list (
  id TEXT PRIMARY KEY,
  recipe TEXT NOT NULL,
  quantity NUMERIC,
  size NUMERIC,
  fo_load NUMERIC,
  wax_cost_per_oz NUMERIC,
  fragrance_cost_per_oz NUMERIC,
  container_cost NUMERIC,
  wick_cost NUMERIC,
  label_cost NUMERIC,
  box_cost NUMERIC,
  overhead_per_candle NUMERIC,
  labor_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (allows public read/write for now)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_list ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read" ON materials FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON materials FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON materials FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON fragrances FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON fragrances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON fragrances FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON fragrances FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON recipes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON recipes FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON batch_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON batch_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON batch_history FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON batch_history FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON batch_list FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON batch_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON batch_list FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON batch_list FOR DELETE USING (true);


-- ============================================
-- MIGRATION: Run this if you have existing tables
-- ============================================

-- Add new columns to fragrances table
ALTER TABLE fragrances ADD COLUMN IF NOT EXISTS prices JSONB DEFAULT '{}';
ALTER TABLE fragrances ADD COLUMN IF NOT EXISTS quantities JSONB DEFAULT '{}';
ALTER TABLE fragrances ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Add archived column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- ============================================
-- MIGRATION: Shopify Integration columns for recipes
-- ============================================
-- Old single-link columns (deprecated)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS shopify_variant_id TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS shopify_product_id TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS shopify_inventory_item_id TEXT;

-- New multi-link column (array of linked products)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS shopify_links JSONB DEFAULT '[]';

-- ============================================
-- Saved Instructions table (for AI-generated batch instructions)
-- ============================================

CREATE TABLE IF NOT EXISTS saved_instructions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  prompt TEXT,
  data JSONB,           -- Structured AI response (ingredients, steps, etc.)
  text TEXT             -- Fallback for non-JSON responses
);

-- Enable Row Level Security
ALTER TABLE saved_instructions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read" ON saved_instructions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON saved_instructions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON saved_instructions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON saved_instructions FOR DELETE USING (true);

-- ============================================
-- Saved Chats table (for AI conversation history)
-- ============================================

CREATE TABLE IF NOT EXISTS saved_chats (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  messages JSONB           -- Array of conversation messages
);

-- Enable Row Level Security
ALTER TABLE saved_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read" ON saved_chats FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON saved_chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON saved_chats FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON saved_chats FOR DELETE USING (true);

-- ============================================
-- REALTIME: Enable real-time sync for all tables
-- Run this to enable cross-device sync
-- ============================================

-- Enable realtime for all tables (run in Supabase SQL Editor)
ALTER PUBLICATION supabase_realtime ADD TABLE materials;
ALTER PUBLICATION supabase_realtime ADD TABLE fragrances;
ALTER PUBLICATION supabase_realtime ADD TABLE recipes;
ALTER PUBLICATION supabase_realtime ADD TABLE batch_history;
ALTER PUBLICATION supabase_realtime ADD TABLE batch_list;
ALTER PUBLICATION supabase_realtime ADD TABLE saved_instructions;
ALTER PUBLICATION supabase_realtime ADD TABLE saved_chats;
