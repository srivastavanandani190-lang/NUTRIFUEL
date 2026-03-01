# Food Database Panel - Implementation Documentation

## Overview
A comprehensive food database panel that integrates with multiple APIs to display nutritional information for over 900,000 food items. The system features robust error handling, automatic fallback mechanisms, and a polished user interface.

---

## Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- shadcn/ui component library
- Tailwind CSS for styling
- Framer Motion for animations
- Supabase client for API communication

**Backend:**
- Supabase Edge Functions (Deno runtime)
- API integration:
  - Edamam Food Database API (Primary) - 900,000+ foods
  - Mock data fallback (35+ foods)

**State Management:**
- React Hooks (useState, useEffect, useMemo, useCallback)
- Local component state
- Supabase for search history persistence

---

## API Integration

### 1. Edamam Food Database API (Primary)

**Endpoint:** `https://api.edamam.com/api/food-database/v2/parser`

**Authentication:** Requires APP_ID and APP_KEY

**Features:**
- 900,000+ food items
- Comprehensive nutritional data
- Food images
- Category information

**Configuration:**
```bash
# Set in Supabase Edge Function secrets
EDAMAM_APP_ID=your_app_id_here
EDAMAM_APP_KEY=your_app_key_here
```

**Get API Keys:**
1. Visit https://developer.edamam.com/food-database-api
2. Sign up for free account
3. Create application
4. Copy APP_ID and APP_KEY

### 2. Mock Data Fallback

**Purpose:** Ensures application always works, even without API access

**Features:**
- 35 pre-loaded food items
- Covers all 8 categories
- Accurate nutritional data
- Instant response time

---

## Core Features

### 1. Real-Time Search

**Implementation:**
```typescript
// Debounced search with 500ms delay
useEffect(() => {
  if (searchQuery.length >= 2) {
    const timer = setTimeout(() => {
      searchFoodsFromAPI(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }
}, [searchQuery]);
```

**Features:**
- Searches as user types
- 500ms debounce to reduce API calls
- Minimum 2 characters required
- Visual loading indicator

### 2. Advanced Filtering

**Nutrition Filters:**
- Calories: 0-1000 kcal (slider)
- Protein: 0-100g (slider)
- Carbs: 0-150g (slider)
- Fats: 0-80g (slider)

**Category Filters:**
- 🍎 Fruits
- 🥬 Veggies
- 🥗 Vegetarian
- 🍗 Non-Veg
- 🥜 Snacks
- 🍰 Desserts
- 🥛 Dairy
- 🌾 Grains

**Sort Options:**
- Newest
- Calories: Low to High
- Protein: High to Low

### 3. Error Handling

**Multi-Level Fallback System:**
```
1. Try Edamam API
   ↓ (if fails)
2. Use Mock Data
```

**User Feedback:**
- Visual status indicators (Wifi/WifiOff icons)
- Alert banners for errors
- Toast notifications
- Retry button for failed requests

### 4. Responsive Design

**Desktop (≥1024px):**
- 4-column grid layout
- Sticky filter sidebar
- 3-column food grid

**Tablet (768px-1023px):**
- 2-column food grid
- Bottom sheet filters

**Mobile (<768px):**
- 1-column food grid
- Bottom sheet filters
- Full-width search bar

---

## Component Structure

### FoodExplorer Component

**Location:** `/src/components/dashboard/FoodExplorer.tsx`

**Props:** None (uses context for user data)

**State Variables:**
```typescript
// Search and filter state
searchQuery: string
selectedCategories: FoodCategory[]
calorieRange: [number, number]
proteinRange: [number, number]
carbsRange: [number, number]
fatsRange: [number, number]
sortBy: 'newest' | 'calories-asc' | 'protein-desc'

// Data state
displayedFoods: Food[]
selectedFood: Food | null

// UI state
apiStatus: 'idle' | 'loading' | 'success' | 'error' | 'offline'
dataSource: 'edamam' | 'usda' | 'mock'
filterOpen: boolean
errorMessage: string
```

**Key Methods:**
- `loadInitialData()` - Loads default foods on mount
- `searchFoodsFromAPI()` - Calls Edge Function to search foods
- `handleCategoryToggle()` - Toggles category filter
- `handleClearFilters()` - Resets all filters
- `handleRetry()` - Retries failed API request
- `handleAddToPlanner()` - Adds food to planner and saves history

### Edge Function

**Location:** `/supabase/functions/search-foods/index.ts`

**Endpoint:** `search-foods`

**Parameters:**
- `query` (string) - Search term
- `category` (string, optional) - Category filter
- `limit` (number, optional) - Max results (default: 20)

**Response Format:**
```typescript
{
  foods: Food[],
  total: number,
  source: 'edamam' | 'mock',
  success: boolean,
  message?: string,
  error?: string
}
```

**Key Functions:**
- `searchEdamam()` - Searches Edamam API
- `filterMockData()` - Filters mock data
- `categorizeFood()` - Maps API categories to our 8 categories
- `getDefaultImage()` - Returns category-specific placeholder image

---

## Data Flow

### Search Flow

```
User types in search box
        ↓
500ms debounce timer
        ↓
searchFoodsFromAPI() called
        ↓
Call Supabase Edge Function
        ↓
Edge Function tries Edamam API
        ↓ (if success)
Return Edamam results
        ↓ (if fails)
Return mock data
        ↓
Update component state
        ↓
Apply client-side filters
        ↓
Display results in grid
```

### Filter Flow

```
User adjusts filter slider
        ↓
State updated immediately
        ↓
useMemo recalculates filteredFoods
        ↓
Grid re-renders with filtered results
```

---

## Error Handling

### Network Errors

**Scenario:** API request fails due to network issues

**Handling:**
1. Catch error in `searchFoodsFromAPI()`
2. Set `apiStatus` to 'error'
3. Display error alert banner
4. Fallback to mock data
5. Show retry button

### API Errors

**Scenario:** API returns error response

**Handling:**
1. Check response status in Edge Function
2. Log error details
3. Return mock data if API fails
4. Include error message in response

### Invalid Data

**Scenario:** API returns unexpected data format

**Handling:**
1. Validate response structure
2. Use optional chaining (?.) for nested properties
3. Provide default values
4. Transform data to expected format

### Missing API Keys

**Scenario:** Environment variables not configured

**Handling:**
1. Check for API keys in Edge Function
2. Skip API if keys missing
3. Log warning message
4. Use mock data
5. Inform user via toast notification

---

## Performance Optimizations

### 1. Debounced Search
- 500ms delay prevents excessive API calls
- Cancels previous timer on new input

### 2. Memoized Filtering
- `useMemo` prevents unnecessary recalculations
- Only recalculates when dependencies change

### 3. Lazy Loading
- Images load on-demand
- Error fallback for failed images

### 4. Optimized Animations
- Staggered entrance animations (20ms delay per item)
- GPU-accelerated transforms
- AnimatePresence for smooth exits

---

## User Interface

### Search Bar
- Full-width input with icon
- Real-time status indicator
- Loading spinner during search
- Data source badge (Edamam/Offline)

### Filter Panel
- Collapsible on mobile (bottom sheet)
- Sticky on desktop (sidebar)
- Visual sliders for nutrition ranges
- Checkboxes for categories
- Dropdown for sort options
- Clear all button

### Food Cards
- Glassmorphism design
- Hover scale effect
- Category badge
- Calorie badge
- Nutrition breakdown
- Add to planner button
- Click to view details

### Status Indicators
- Success: Green checkmark + "Live Data" badge
- Error: Orange alert + retry button
- Loading: Spinner + "Searching..." text
- Offline: WifiOff icon + "Offline" label

---

## Testing

### Manual Testing Checklist

**Search Functionality:**
- [ ] Search with 1 character (should not trigger)
- [ ] Search with 2+ characters (should trigger after 500ms)
- [ ] Search for common foods (apple, chicken, rice)
- [ ] Search for uncommon foods
- [ ] Search with special characters
- [ ] Clear search (should reset to initial data)

**Filters:**
- [ ] Adjust calorie slider
- [ ] Adjust protein slider
- [ ] Adjust carbs slider
- [ ] Adjust fats slider
- [ ] Select single category
- [ ] Select multiple categories
- [ ] Change sort order
- [ ] Clear all filters

**Error Handling:**
- [ ] Disconnect internet (should show offline mode)
- [ ] Invalid API keys (should fallback to mock)
- [ ] Search with no results (should show empty state)
- [ ] Retry after error (should attempt reconnection)

**Responsive Design:**
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test filter panel on mobile
- [ ] Test food grid layout on all sizes

---

## Troubleshooting

### Issue: No results showing

**Possible Causes:**
1. API keys not configured
2. Network connectivity issues
3. Invalid search query
4. Filters too restrictive

**Solutions:**
1. Check Supabase Edge Function secrets
2. Check browser console for errors
3. Try different search terms
4. Clear all filters

### Issue: Slow search

**Possible Causes:**
1. API rate limiting
2. Large result set
3. Network latency

**Solutions:**
1. Reduce search frequency
2. Implement pagination
3. Use caching

### Issue: Images not loading

**Possible Causes:**
1. Invalid image URLs
2. CORS issues
3. Network errors

**Solutions:**
1. Image error handler provides fallback
2. Check browser console for CORS errors
3. Use default category images

---

## Future Enhancements

### Planned Features
1. **Pagination** - Load more results on scroll
2. **Caching** - Store recent searches locally
3. **Favorites** - Save favorite foods
4. **Barcode Scanner** - Scan product barcodes
5. **Meal Builder** - Combine foods into meals
6. **Export** - Export food data as CSV/PDF
7. **Comparison** - Compare multiple foods side-by-side
8. **Recipes** - Link foods to recipes

### Performance Improvements
1. Implement virtual scrolling for large lists
2. Add service worker for offline support
3. Optimize image loading with lazy loading
4. Add request caching with TTL

---

## API Configuration Guide

### Step 1: Get Edamam API Keys

1. Visit https://developer.edamam.com/food-database-api
2. Click "Sign Up" (free tier available)
3. Create account and verify email
4. Go to Dashboard → Applications
5. Click "Create New Application"
6. Select "Food Database API"
7. Copy your APP_ID and APP_KEY

### Step 2: Configure Supabase Secrets

1. Open Supabase Dashboard
2. Go to Project Settings → Edge Functions
3. Click "Add Secret"
4. Add `EDAMAM_APP_ID` with your APP_ID
5. Add `EDAMAM_APP_KEY` with your APP_KEY
6. Redeploy Edge Function

### Step 3: Test Integration

1. Open Food Explorer
2. Search for "chicken"
3. Check for "Live Data" badge
4. Verify results are from Edamam

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase Edge Function logs
3. Verify API keys are configured
4. Test with mock data (should always work)

---

## License

This implementation is part of the Food Recommendation Dashboard application.
