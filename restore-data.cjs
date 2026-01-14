const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xxtoscqihhiiqwjooaxj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dG9zY3FpaGhpaXF3am9vYXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg3NzUsImV4cCI6MjA4MDIzNDc3NX0.ktojd3daHvwn626h9BhzxLsBoWjBidFlnMYCM60APyU');

const materials = [
  { id: 'W-001', category: 'Wax', name: 'Golden Brands 464 Soy Wax', vendor: 'CandleScience', unit: 'lb', package_size: 10, package_cost: 32.95, qty_on_hand: 45, reorder_point: 20 },
  { id: 'W-002', category: 'Wax', name: 'Coconut Soy Blend', vendor: 'Aztec', unit: 'lb', package_size: 5, package_cost: 18.99, qty_on_hand: 15, reorder_point: 10 },
  { id: 'C-001', category: 'Container', name: '9oz Straight Side Jar', vendor: 'Fillmore', unit: 'case', package_size: 12, package_cost: 24.00, qty_on_hand: 120, reorder_point: 48 },
  { id: 'C-002', category: 'Container', name: '6oz Tin', vendor: 'CandleScience', unit: 'case', package_size: 24, package_cost: 36.00, qty_on_hand: 96, reorder_point: 48 },
  { id: 'C-003', category: 'Container', name: '4oz Small Tin', vendor: 'Amazon', unit: 'case', package_size: 24, package_cost: 28.00, qty_on_hand: 144, reorder_point: 72 },
  { id: 'K-001', category: 'Wick', name: 'CD-10 Wicks', vendor: 'CandleScience', unit: 'pack', package_size: 100, package_cost: 12.99, qty_on_hand: 350, reorder_point: 100 },
  { id: 'K-002', category: 'Wick', name: 'CD-18 Wicks', vendor: 'CandleScience', unit: 'pack', package_size: 100, package_cost: 12.99, qty_on_hand: 280, reorder_point: 100 },
  { id: 'L-001', category: 'Label', name: '2 inch Round Kraft Labels', vendor: 'Amazon', unit: 'roll', package_size: 500, package_cost: 14.99, qty_on_hand: 800, reorder_point: 200 },
  { id: 'P-001', category: 'Packaging', name: 'White Gift Box 4x4x4', vendor: 'Uline', unit: 'case', package_size: 25, package_cost: 18.50, qty_on_hand: 75, reorder_point: 50 },
];

const fragrances = [
  { id: 'FO-001', name: 'Ocean Breeze', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.95, flash_point: 200, max_load: 10, qty_on_hand: 24, reorder_point: 8 },
  { id: 'FO-002', name: 'Jamaican Me Crazy', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.50, flash_point: 200, max_load: 10, qty_on_hand: 32, reorder_point: 8 },
  { id: 'FO-003', name: 'Pumpkin Spice', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.95, flash_point: 185, max_load: 10, qty_on_hand: 16, reorder_point: 8 },
  { id: 'FO-004', name: 'Apple Cinnamon', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.50, flash_point: 200, max_load: 10, qty_on_hand: 20, reorder_point: 8 },
  { id: 'FO-005', name: 'Vanilla', type: 'EO', vendor: 'Amazon', package_size: 16, package_cost: 25.99, flash_point: 200, max_load: 10, qty_on_hand: 28, reorder_point: 8 },
  { id: 'FO-006', name: 'Balsam Pine', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 19.99, flash_point: 200, max_load: 10, qty_on_hand: 12, reorder_point: 8 },
  { id: 'FO-007', name: 'Sandalwood', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 29.99, flash_point: 200, max_load: 10, qty_on_hand: 8, reorder_point: 8 },
  { id: 'FO-008', name: 'Eucalyptus Spearmint', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.50, flash_point: 200, max_load: 10, qty_on_hand: 24, reorder_point: 8 },
  { id: 'FO-009', name: 'Sweet Taboo', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 16, reorder_point: 8 },
  { id: 'FO-010', name: 'Butt Naked', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 20, reorder_point: 8 },
  { id: 'FO-011', name: 'Coconut Lime', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.50, flash_point: 200, max_load: 10, qty_on_hand: 18, reorder_point: 8 },
  { id: 'FO-012', name: 'Caramel', type: 'FO', vendor: 'Amazon', package_size: 16, package_cost: 31.95, flash_point: 200, max_load: 10, qty_on_hand: 14, reorder_point: 8 },
  { id: 'FO-013', name: 'Lime', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 12.99, flash_point: 200, max_load: 5, qty_on_hand: 6, reorder_point: 2 },
  { id: 'FO-014', name: 'Petitgrain', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 14.99, flash_point: 200, max_load: 5, qty_on_hand: 4, reorder_point: 2 },
  { id: 'FO-015', name: 'Jasmine', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 24.99, flash_point: 200, max_load: 3, qty_on_hand: 3, reorder_point: 2 },
  { id: 'FO-016', name: 'Very Vanilla', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 22, reorder_point: 8 },
  { id: 'FO-017', name: 'Mountain Meets Ocean', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 31.50, flash_point: 200, max_load: 10, qty_on_hand: 16, reorder_point: 8 },
  { id: 'FO-018', name: 'Sweetest Taboo', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 14, reorder_point: 8 },
  { id: 'FO-019', name: 'Pumpkin Spice Latte', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 31.50, flash_point: 185, max_load: 10, qty_on_hand: 18, reorder_point: 8 },
  { id: 'FO-020', name: 'Orange', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 9.99, flash_point: 200, max_load: 5, qty_on_hand: 5, reorder_point: 2 },
  { id: 'FO-021', name: 'Cedarwood', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 11.99, flash_point: 200, max_load: 5, qty_on_hand: 4, reorder_point: 2 },
  { id: 'FO-022', name: 'Frankincense', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 19.99, flash_point: 200, max_load: 5, qty_on_hand: 3, reorder_point: 2 },
  { id: 'FO-023', name: 'Bergamot', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 14.99, flash_point: 200, max_load: 5, qty_on_hand: 4, reorder_point: 2 },
  { id: 'FO-024', name: 'Cedar', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 11.99, flash_point: 200, max_load: 5, qty_on_hand: 4, reorder_point: 2 },
  { id: 'FO-025', name: 'Black Pepper', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 10, reorder_point: 8 },
  { id: 'FO-026', name: 'Rose', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 29.99, flash_point: 200, max_load: 3, qty_on_hand: 2, reorder_point: 1 },
  { id: 'FO-027', name: 'Eucalyptus', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 9.99, flash_point: 200, max_load: 5, qty_on_hand: 5, reorder_point: 2 },
  { id: 'FO-028', name: 'Rosemary', type: 'EO', vendor: 'Plant Therapy', package_size: 4, package_cost: 11.99, flash_point: 200, max_load: 5, qty_on_hand: 4, reorder_point: 2 },
  { id: 'FO-029', name: 'Pine', type: 'FO', vendor: 'CandleScience', package_size: 16, package_cost: 28.99, flash_point: 200, max_load: 10, qty_on_hand: 16, reorder_point: 8 },
];

const recipes = [
  { id: 'RCP-001', name: 'Coastal Luxe', vibe: 'Tropical - Clean - Airy', style: 'Fresh, upscale beach house', description: 'A luxury coastal fragrance.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Ocean Breeze', type: 'FO', percent: 55 }, { fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 25 }, { fragrance: 'Lime', type: 'EO', percent: 10 }, { fragrance: 'Petitgrain', type: 'EO', percent: 5 }, { fragrance: 'Jasmine', type: 'EO', percent: 5 }] },
  { id: 'RCP-002', name: 'Sunset Colada', vibe: 'Tropical - Fruity - Smooth', style: 'Vacation sunset cocktail', description: 'Bright tropical fruit with vanilla.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 60 }, { fragrance: 'Vanilla', type: 'EO', percent: 15 }, { fragrance: 'Lime', type: 'EO', percent: 15 }, { fragrance: 'Orange', type: 'EO', percent: 10 }] },
  { id: 'RCP-003', name: 'Harvest Cabin', vibe: 'Warm - Spiced - Comforting', style: 'Cozy fall evening', description: 'Warm apple cinnamon with vanilla.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Apple Cinnamon', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Frankincense', type: 'EO', percent: 5 }] },
  { id: 'RCP-004', name: 'Toes In The Sand', vibe: 'Fresh - Uplifting - Coastal', style: 'Tropical meets coastal', description: 'Tropical fruit with ocean breeze.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-10 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 55 }, { fragrance: 'Coconut Lime', type: 'FO', percent: 20 }, { fragrance: 'Eucalyptus Spearmint', type: 'EO', percent: 20 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 5 }] },
  { id: 'RCP-005', name: 'Alpine Holiday', vibe: 'Fresh - Festive - Cozy', style: 'Christmas tree + citrus', description: 'Fresh pine with vanilla and citrus.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Pine', type: 'FO', percent: 55 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Bergamot', type: 'EO', percent: 10 }, { fragrance: 'Orange', type: 'EO', percent: 10 }, { fragrance: 'Cedar', type: 'EO', percent: 5 }] },
  { id: 'RCP-006', name: 'Fireside Spice Latte', vibe: 'Cozy - Spiced - Sweet', style: 'Warm holiday cafe', description: 'Pumpkin spice with caramel.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Pumpkin Spice Latte', type: 'FO', percent: 50 }, { fragrance: 'Caramel', type: 'FO', percent: 20 }, { fragrance: 'Vanilla', type: 'EO', percent: 20 }, { fragrance: 'Cedarwood', type: 'EO', percent: 5 }, { fragrance: 'Black Pepper', type: 'FO', percent: 5 }] },
  { id: 'RCP-007', name: 'Forbidden Vanilla Kiss', vibe: 'Romantic - Seductive', style: 'Sweet-floral gourmand', description: 'Vanilla with jasmine and rose.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Sweet Taboo', type: 'FO', percent: 48 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 35 }, { fragrance: 'Jasmine', type: 'EO', percent: 10 }, { fragrance: 'Bergamot', type: 'EO', percent: 5 }, { fragrance: 'Rose', type: 'EO', percent: 2 }] },
  { id: 'RCP-008', name: 'Alpine Spa', vibe: 'Clean - Fresh - Cozy', style: 'Winter spa scent', description: 'Evergreens with spa botanicals.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Mountain Meets Ocean', type: 'FO', percent: 40 }, { fragrance: 'Balsam Pine', type: 'EO', percent: 30 }, { fragrance: 'Eucalyptus', type: 'EO', percent: 10 }, { fragrance: 'Rosemary', type: 'EO', percent: 10 }, { fragrance: 'Very Vanilla', type: 'FO', percent: 10 }] },
  { id: 'RCP-009', name: 'Island Bliss', vibe: 'Tropical - Smooth - Playful', style: 'Flirty tropical fruit', description: 'Tropical fruit blend.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Jamaican Me Crazy', type: 'FO', percent: 50 }, { fragrance: 'Butt Naked', type: 'FO', percent: 30 }, { fragrance: 'Sweetest Taboo', type: 'FO', percent: 20 }] },
  { id: 'RCP-010', name: 'Eucalyptus Spa', vibe: 'Clean - Cooling - Refreshing', style: 'Herbal aromatherapy', description: 'Cool eucalyptus and spearmint.', wax: 'Golden Brands 464 Soy Wax', wick: 'CD-18 Wicks', fo_load: 10, archived: false, components: [{ fragrance: 'Eucalyptus Spearmint', type: 'FO', percent: 100 }] },
];

async function restore() {
  console.log('Restoring materials...');
  const { error: e1 } = await supabase.from('materials').insert(materials);
  if (e1) console.error('Materials error:', e1.message);
  else console.log('Materials: OK (' + materials.length + ')');

  console.log('Restoring fragrances...');
  const { error: e2 } = await supabase.from('fragrances').insert(fragrances);
  if (e2) console.error('Fragrances error:', e2.message);
  else console.log('Fragrances: OK (' + fragrances.length + ')');

  console.log('Restoring recipes...');
  const { error: e3 } = await supabase.from('recipes').insert(recipes);
  if (e3) console.error('Recipes error:', e3.message);
  else console.log('Recipes: OK (' + recipes.length + ')');

  console.log('Done!');
}

restore();
