# Light By Dawn - Candle Business App

## Feature Roadmap & Suggestions

### 🚀 Quick Wins (Easy to Implement)

#### 1. Search/Filter on Each Page
- Add text search input to Materials, Fragrances, and Recipes pages
- Filter items as user types
- Search by name, vendor, or other relevant fields

#### 2. Duplicate Recipe Button
- Add "Duplicate" option next to Edit/Delete on recipe cards
- Pre-fills recipe modal with copied data
- Auto-generates new name like "Copy of [Recipe Name]"

#### 3. Quick Restock from Dashboard
- Make low stock alert items clickable
- Navigate directly to Materials/Fragrances page with item selected
- Or open edit modal directly

#### 4. Export All Data (JSON Backup)
- Button to export all materials, fragrances, recipes as JSON
- User can save/backup their data
- Future: Import function to restore data

#### 5. Batch Notes in History
- Display notes field in batch history cards
- Expandable/collapsible for longer notes
- Search batch history by notes

---

### 🎯 Medium Effort Features

#### 6. Print-Friendly Views
- Shopping list print stylesheet
- Batch worksheet printable format
- Recipe cards for printing

#### 7. Seasonal/Collection Tags
- Add tags to recipes: "Holiday", "Summer", "Signature", etc.
- Filter recipes by tag/collection
- Color-coded tag chips

#### 8. Cost Tracking Dashboard
- Track actual vs estimated costs over time
- Profit per recipe from logged batches
- Monthly production summary

#### 9. Inventory Alerts Configuration
- Customizable reorder points per item
- Email/notification preferences (if backend added)
- Bulk update reorder points

---

### 💡 Future Enhancements (Requires Backend)

#### 10. Data Persistence
- Currently: Data resets on page refresh (localStorage blocked in artifacts)
- Solution: Add backend API + database (Supabase, Firebase, etc.)
- User authentication for multiple users

#### 11. File Uploads
- Upload fragrance supplier price sheets
- Import materials from CSV/Excel
- Recipe image uploads

#### 12. Cloud Sync
- Sync across devices
- Automatic backup
- Version history

---

## Current Feature Status ✅

### Completed Features:
- [x] Dashboard with stats & AI Profit Analyzer
- [x] Materials page with CRUD, sorting (7 options), filtering, 3 views
- [x] Fragrances page with CRUD, sorting (6 options), 3 views
- [x] Recipes page with CRUD, sorting (8 options), 3 views, "Can Make" badges
- [x] Batch Calculator with multi-batch builder
- [x] Shopping List with export (copy to clipboard)
- [x] Clear shopping list with confirmation modal
- [x] Batch History with logging
- [x] Pricing Engine with recipe selector
- [x] AI Blend Advisor with "Make Recipe" button
- [x] Inventory tracking with auto-deduct on batch logging
- [x] "What Can I Make?" analysis
- [x] Low stock alerts (items BELOW reorder point)
- [x] Delete functionality working (no confirm dialogs)

### Known Limitations:
- Data does not persist (localStorage blocked in Claude artifacts)
- File downloads don't work (using copy-to-clipboard instead)
- window.confirm/alert blocked (using custom modals)

---

## Local Development Setup

### Files to Deploy:
1. `LightByDawn_CandleApp.jsx` - Main React component (2,880+ lines)

### Tech Stack:
- React 18+
- Lucide React (icons)
- Tailwind CSS (optional, currently using inline styles)
- Google Fonts: Playfair Display, Inter

### Dependencies:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  }
}
```

### To Enable Data Persistence:
1. Add localStorage support (works outside Claude artifacts)
2. Or integrate with backend (Supabase, Firebase, custom API)

### To Enable File Downloads:
Replace clipboard copy with actual download:
```javascript
const blob = new Blob([text], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'shopping-list.txt';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
```

---

## Claude Code GitHub Upload

Once you have Claude Code installed:

```bash
# Navigate to your project directory
cd D:\Apps\light-by-dawn

# Initialize git if needed
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Light By Dawn Candle Business App"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/light-by-dawn.git
git push -u origin main
```

Or just tell Claude Code: "Upload this project to GitHub as a new repository called light-by-dawn"

---

## Notes

- App is ~2,880 lines of React code
- Self-contained single component
- Ready for extraction into multiple components if needed
- Theme: Sunset ombré (coral/peach/purple gradient)
- Font: Playfair Display (headings), Inter (body)

Last updated: December 2024
