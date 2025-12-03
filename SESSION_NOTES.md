# Light By Dawn - Session Notes

## Session: December 2, 2024

### Critical Fix: Sync Protection
- **Problem:** Data was being wiped when UI changes were made (hot reload)
- **Solution:** Added `loadedCountsRef` and `syncEnabledRef` to prevent syncing empty/stale data
- **How it works:** Tracks how many items were loaded from Supabase, blocks sync if current count < loaded count
- **Tested and verified working**

### Batch Builder Enhancements
- Added material selectors: Wax, Container, Wick, Label, Packaging, Fragrance
- Container auto-detects size from name (e.g., "9oz Jar" → size = 9)
- Added "Standard Vinyl (brand + safety)" label option with size-based pricing
- Added Fill Breakdown box showing: GROSS (total), NET (wax), Fragrance amounts
- Container/size mismatch warning
- Integrated Pricing & Margins section with:
  - Retail price input
  - Quick margin buttons (50%, 60%, 65%, 70%) - now sets exact price shown
  - Profit per candle and margin display
  - Suggested Wholesale (50% margin) and Bulk (35% margin) tier pricing
- Fragrance cost auto-calculates from recipe components using 16oz prices

### Stock Checking
- Shows ALL shortages, not just first one
- Checks fragrance inventory against recipe components
- Displays "Need to Order" and "In Stock" sections with quantities
- Combined Materials Summary for all batches in list
- Running tally aggregates across multiple batches

### Shopping List Improvements
- Added Stock Status section at top with two cards:
  - "Need to Order" (red) - lists each item with amount to order
  - "In Stock" (green) - lists items you have enough of
- Copy Order List button

### Batch List Features
- Edit button on each batch row (yellow pencil)
- Save Changes / Cancel Edit buttons when editing
- Actions column in table header

### Recipe Form Simplified
- Removed Container and Size fields (handled in Batch Builder)
- Recipe now focuses on: Name, Vibe, Style, Description, FO Load %, Fragrance Components

### UI Fixes
- Dark themed dropdown menus (select/option styling)
- Fixed margin buttons to set exact price shown (not ceiling)
- Fixed wholesale/bulk tier pricing (bulk is now cheaper)

### Database Notes
- Reset fragrances SQL:
```sql
UPDATE fragrances
SET prices = '{"0.5": 1.50, "1": 8.95, "4": 12.99, "8": 21.99, "16": 31.50}'::jsonb,
    quantities = '{"0.5": 0, "1": 0, "4": 0, "8": 0, "16": 0}'::jsonb,
    flash_point = 158,
    reorder_point = 0;
```
- **Important:** Always clear localStorage BEFORE making Supabase changes to prevent old data syncing back

### AI Chat Fix
- Removed legacy `qtyOnHand` fallback from inventory context
- Now correctly calculates total oz from per-size quantities

### Known Workflow
1. **Recipes** = Fragrance blend formulas (FO Load % + Components)
2. **Batch Builder** = Production decisions (Container, Wax, Wick, Size, Quantity, Pricing)
3. **Shopping List** = Shows what to order vs what's in stock

---

## Next Session TODO
- [ ] Continue building out inventory
- [ ] Test full workflow: Recipe → Batch Builder → Shopping List
- [ ] Any additional features needed

## GitHub
Repository: https://github.com/Pbbobkanobi67/light-by-dawn
