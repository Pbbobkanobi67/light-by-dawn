# Light By Dawn - Candle Business App

## Feature Roadmap & Suggestions

### 🚀 Quick Wins (Easy to Implement)

#### 1. Search/Filter on Each Page
- Add text search input to Materials, Fragrances, and Recipes pages
- Filter items as user types
- Search by name, vendor, or other relevant fields

#### 2. ~~Duplicate Recipe Button~~ ✅ DONE
- ~~Add "Duplicate" option next to Edit/Delete on recipe cards~~
- ~~Pre-fills recipe modal with copied data~~
- ~~Auto-generates new name like "Copy of [Recipe Name]"~~

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

### 💡 Future Enhancements

#### 10. ~~Data Persistence~~ ✅ DONE
- ~~Add backend API + database~~
- Now using Supabase cloud database
- Data syncs automatically and persists across sessions

#### 11. File Uploads
- Upload fragrance supplier price sheets
- Import materials from CSV/Excel
- Recipe image uploads

#### 12. ~~Cloud Sync~~ ✅ DONE
- ~~Sync across devices~~
- Data stored in Supabase cloud
- Accessible from any device

---

## Current Feature Status ✅

### Completed Features:
- [x] Dashboard with stats & AI Profit Analyzer (Gemini-powered)
- [x] Materials page with CRUD, sorting (7 options), filtering, 3 views
- [x] Fragrances page with CRUD, sorting (6 options), 3 views
- [x] Recipes page with CRUD, sorting (8 options), 3 views, "Can Make" badges
- [x] Batch Calculator with multi-batch builder
- [x] Shopping List with export (copy to clipboard)
- [x] Clear shopping list with confirmation modal
- [x] Batch History with logging
- [x] Pricing Engine with recipe selector
- [x] AI Blend Advisor with "Make Recipe" button (Gemini-powered)
- [x] Inventory tracking with auto-deduct on batch logging
- [x] "What Can I Make?" analysis
- [x] Low stock alerts (items BELOW reorder point)
- [x] Delete functionality working (no confirm dialogs)
- [x] **Supabase cloud database integration** (data persists!)
- [x] **localStorage fallback** for offline use
- [x] **Mobile responsive design** with collapsible sidebar
- [x] **Archive functionality** for fragrances and recipes
- [x] **Copy/duplicate recipe** feature
- [x] **Per-size pricing** for fragrances (0.5, 1, 4, 8, 16 oz)
- [x] **Per-size inventory tracking** for fragrances
- [x] **Amazon search button** on fragrance cards
- [x] **General AI Chat Assistant** (inventory-aware, Gemini-powered)
- [x] **Movable/resizable chat window** with touch support

### AI Features (Powered by Google Gemini - FREE):
- **AI Blend Advisor**: Select 2+ fragrances, get compatibility analysis, suggested ratios, and recipe name ideas
- **AI Profit Analyzer**: Analyzes inventory and recipes to maximize profit
- **AI Chat Assistant**: Ask questions about inventory, get recipe suggestions, business advice

---

## Tech Stack

- **Frontend**: React 19, Vite 7
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash (FREE API)
- **Styling**: Inline styles with CSS-in-JS patterns
- **Fonts**: Outfit (body), Playfair Display (headings)

### Dependencies:
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0",
    "@supabase/supabase-js": "^2.x"
  }
}
```

---

## AI Setup (Google Gemini - FREE)

To enable AI features:

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. In the app:
   - Click the chat bubble (bottom-right corner)
   - Click the key icon in the header
   - Paste your API key and click Save

**Free tier limits**: 250 requests/day, 250K tokens/minute

---

## Database Setup (Supabase)

The app uses Supabase for cloud data persistence.

### Tables:
- `materials` - Wax, containers, wicks, labels, packaging
- `fragrances` - FO/EO with per-size pricing and quantities
- `recipes` - Candle recipes with components
- `batch_history` - Production history
- `batch_list` - Pending batches for shopping list

### Schema:
See `supabase-schema.sql` for the full database schema.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173` (or next available port).

---

## Project Structure

```
light-by-dawn/
├── src/
│   ├── LightByDawn_CandleApp.jsx  # Main application (~3,500 lines)
│   ├── supabaseClient.js          # Supabase configuration
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── supabase-schema.sql            # Database schema
├── index.html
├── package.json
├── vite.config.js
└── FEATURE_ROADMAP.md
```

---

## Notes

- App is ~3,500 lines of React code
- Self-contained single component (could be split in future)
- Theme: Sunset ombre (coral/peach/purple gradient)
- Fully responsive for mobile devices
- Touch support for drag/resize on mobile

---

## GitHub Repository

https://github.com/Pbbobkanobi67/light-by-dawn

Last updated: December 2024
