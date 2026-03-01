# Food Database Panel - Quick Start Guide

## 🚀 Getting Started

The Food Database Panel is now fully functional and ready to use! Here's what you need to know:

---

## ✅ What's Working Right Now

### Without API Keys (Offline Mode)
- ✅ Search through 35+ pre-loaded foods
- ✅ Filter by calories, protein, carbs, fats
- ✅ Filter by 8 categories
- ✅ Sort results
- ✅ Add foods to planner
- ✅ View detailed nutrition information
- ✅ Fully responsive design

### With API Keys (Live Mode)
- ✅ Search through 900,000+ foods (Edamam)
- ✅ Real-time nutritional data
- ✅ Food images
- ✅ Automatic fallback if API fails

---

## 🔑 How to Enable Live Data (Optional)

### Step 1: Get Free API Keys

**Edamam (Recommended):**
1. Go to: https://developer.edamam.com/food-database-api
2. Click "Sign Up" (free tier: 10,000 calls/month)
3. Create account and verify email
4. Dashboard → Applications → Create New Application
5. Select "Food Database API"
6. Copy your `APP_ID` and `APP_KEY`

### Step 2: Configure in Supabase

1. Open your Supabase Dashboard
2. Go to: Project Settings → Edge Functions
3. Click "Add Secret"
4. Add these two secrets:
   - Name: `EDAMAM_APP_ID`, Value: [your APP_ID]
   - Name: `EDAMAM_APP_KEY`, Value: [your APP_KEY]
5. Done! The panel will automatically use live data

---

## 🎯 How to Use the Panel

### Basic Search
1. Type any food name in the search bar (e.g., "chicken", "apple", "rice")
2. Results appear automatically after 500ms
3. Click any food card to see detailed nutrition info

### Advanced Filtering
1. Click the filter icon (mobile) or use the sidebar (desktop)
2. Adjust sliders for:
   - Calories (0-1000 kcal)
   - Protein (0-100g)
   - Carbs (0-150g)
   - Fats (0-80g)
3. Check categories to filter:
   - 🍎 Fruits
   - 🥬 Veggies
   - 🥗 Vegetarian
   - 🍗 Non-Veg
   - 🥜 Snacks
   - 🍰 Desserts
   - 🥛 Dairy
   - 🌾 Grains
4. Select sort order:
   - Newest
   - Calories: Low to High
   - Protein: High to Low

### Adding to Planner
1. Click "Add to Planner" button on any food card
2. Food is saved to your search history
3. Toast notification confirms addition

---

## 🔍 Understanding Status Indicators

### Top-Right Corner of Search Bar:
- **📶 Edamam** = Connected to Edamam API (900K+ foods)
- **📵 Offline** = Using local data (35+ foods)

### Alert Banners:
- **Green Banner** = "Connected to [API] - Live data active"
- **Orange Banner** = "API connection failed. Using offline data."
  - Click "Retry" button to reconnect

### Food Cards:
- **"Live Data" Badge** = Results from real API
- **No Badge** = Results from offline data

---

## 🐛 Troubleshooting

### Problem: No results showing
**Solution:**
1. Check if search term is at least 2 characters
2. Try clearing filters (click "Clear All Filters")
3. Try common foods: "chicken", "apple", "rice"
4. Check browser console for errors

### Problem: Showing "Offline" mode
**Possible Causes:**
1. API keys not configured (this is normal!)
2. Network connectivity issues
3. API rate limit reached

**Solutions:**
1. Configure API keys (see above)
2. Check internet connection
3. Wait a few minutes and retry
4. Offline mode still works perfectly!

### Problem: Slow search
**This is normal!**
- First search may take 2-3 seconds
- Subsequent searches are faster
- Debounce delay is 500ms (intentional)

---

## 📊 Technical Details

### APIs Used:
1. **Edamam Food Database** (Primary)
   - 900,000+ foods
   - Comprehensive nutrition data
   - Food images
   - Free tier: 10,000 calls/month

2. **Mock Data** (Fallback)
   - 35+ foods
   - Always available
   - Instant response

### Automatic Fallback System:
```
Try Edamam → If fails → Use Mock Data
```

### Performance:
- Search debounce: 500ms
- Results limit: 20 foods per search
- Client-side filtering: Instant
- Image lazy loading: On-demand

---

## 📱 Responsive Design

### Desktop (≥1024px):
- 3-column food grid
- Sticky filter sidebar
- Full-width search bar

### Tablet (768px-1023px):
- 2-column food grid
- Bottom sheet filters
- Optimized touch targets

### Mobile (<768px):
- 1-column food grid
- Bottom sheet filters
- Full-screen experience

---

## 🎨 Features Highlight

### ✨ Smart Search
- Real-time results as you type
- Searches food names and descriptions
- Minimum 2 characters required
- 500ms debounce to reduce API calls

### 🎯 Advanced Filters
- Nutrition range sliders
- Multi-category selection
- Multiple sort options
- Clear all with one click

### 💪 Robust Error Handling
- Multi-API fallback system
- Always-working offline mode
- User-friendly error messages
- Retry mechanism

### 🎭 Beautiful UI
- Glassmorphism design
- Smooth animations
- Hover effects
- Loading states
- Empty states

### 📝 Search History
- Automatically saves searches
- Tracks calories
- Stores food selections
- View in Profile tab

---

## 🚀 Next Steps

1. **Try it out!** Search for your favorite foods
2. **Configure API keys** for access to 900K+ foods (optional)
3. **Explore filters** to find foods matching your nutrition goals
4. **Add foods to planner** to build your meal plan
5. **Check your profile** to see search history

---

## 📚 Full Documentation

For complete technical documentation, see:
- `FOOD_PANEL_DOCUMENTATION.md` - Comprehensive technical guide
- Includes architecture, API details, troubleshooting, and more

---

## ✅ Summary

**The Food Database Panel is fully functional right now!**

- Works perfectly in offline mode (no setup required)
- Optional API keys unlock 900K+ foods
- Robust error handling ensures it always works
- Beautiful, responsive design
- Comprehensive filtering and sorting
- Search history tracking

**Just start searching and enjoy! 🎉**
