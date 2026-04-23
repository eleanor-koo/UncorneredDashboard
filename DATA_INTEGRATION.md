# Data Integration Guide

## Overview

This dashboard is designed with **modular, replaceable components** that can integrate with external data sources. All placeholder data can be replaced with real data from Zoho Creator, Zoho Analytics, CSV imports, or API endpoints.

---

## 📌 General Integration Architecture

```
┌─────────────────┐
│ Zoho Creator    │ ← Data Entry (Leads, Catalysts, Check-ins)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Zoho Analytics  │ ← Data Processing & Aggregation
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌────────────────┐   ┌──────────────────┐
│  This Dashboard│   │  External Maps   │
│  (React App)   │   │  (HTML/ArcGIS)   │
└────────────────┘   └──────────────────┘
```

---

## 📊 Data Sources & Schemas

### 1. **Catalysts**

**File:** `src/app/components/pages/CatalystDirectory.tsx`

**Schema:**
```typescript
{
  id: number,
  name: string,
  status: 'active' | 'inactive',
  type: 'Network' | 'Stipend' | 'Volunteer',
  lead: string,              // Lead name
  crew: string,              // Crew name
  phone: string,
  email: string,
  address: string,
  enrolled: string,          // ISO date
  checkIns: number,
  lastContact: string,       // ISO date
  gender: string,
  age: number,
  race: string,
  statusIntervals: [         // Interval-based tracking
    {
      status: 'active' | 'inactive',
      startDate: string,     // ISO date
      endDate: string | null, // null = current interval
      durationDays: number,
      checkIns?: number
    }
  ]
}
```

**Integration Options:**
1. **CSV Import:** Upload `/data/catalysts.csv`
2. **API Endpoint:** `GET /api/catalysts`
3. **Zoho Analytics:** Direct connection via Zoho API SDK

---

### 2. **Leads**

**File:** `src/app/components/pages/LeadDirectory.tsx`

**Schema:**
```typescript
{
  id: number,
  name: string,
  phone: string,
  email: string,
  city: string,
  address: string,
  hireDate: string,          // ISO date
  status: 'active' | 'inactive',
  assignedCrews: string[],   // Array of crew names
  totalCatalysts: number,
  activeCatalysts: number,
  weeklyUploads: number      // Percentage
}
```

**Integration Options:**
1. **CSV Import:** Upload `/data/leads.csv`
2. **API Endpoint:** `GET /api/leads`
3. **Zoho Analytics:** Direct connection

---

### 3. **Crews**

**Used in:** `src/app/components/MapControls.tsx`, `src/app/components/InteractiveMap.tsx`

**Schema:**
```typescript
{
  id: number,
  name: string,
  members: number,           // Total member count
  city: string,
  status: 'active' | 'inactive',
  lead_id: number            // Foreign key to leads
}
```

**Integration Options:**
1. **CSV Import:** Upload `/data/crews.csv`
2. **API Endpoint:** `GET /api/crews?city={city}`

---

### 4. **Map Data**

**File:** `src/app/components/InteractiveMap.tsx`

**Schema (Geolocation):**
```typescript
{
  id: number,
  lat: number,               // Latitude
  lng: number,               // Longitude
  type: 'crew' | 'catalyst' | 'conflict' | 'incident',
  name: string,
  status: 'active' | 'inactive',
  city: string
}
```

**Integration Options:**

#### Option 1: External Map Generation (Recommended)
1. Generate map externally using Python (Folium, Plotly, ArcGIS)
2. Output HTML file to: `/outputs/maps/{city}_map.html`
3. In Zoho Dashboard:
   - Use **HTML Embed Widget**
   - OR use **iframe:** `<iframe src="https://yourdomain.com/outputs/maps/boston_map.html"></iframe>`

#### Option 2: Embedded in React Component
Replace the placeholder map with:
```tsx
<iframe 
  src={`/outputs/maps/${city.toLowerCase()}_map.html`} 
  width="100%" 
  height="100%"
  frameBorder="0"
/>
```

#### Option 3: Zoho Analytics Map Widget
1. Create map in Zoho Analytics using built-in mapping
2. Embed the entire widget into Zoho Dashboard
3. No custom code needed

**Map Auto-Update:**
- **Weekly:** Replace HTML file via scheduled Python script
- **Manual:** Re-run map generation script
- **API:** Zoho API → Python script → Generate map on demand

---

## 🔄 Data Pipeline Examples

### CSV Import Pipeline

```bash
# Step 1: Export from Zoho Creator
# Go to Zoho Creator → Export Data → catalysts.csv

# Step 2: Place CSV in /data directory
/data/
  ├── catalysts.csv
  ├── leads.csv
  ├── crews.csv
  └── geolocation.csv

# Step 3: Import in React (example)
import catalystsData from '/data/catalysts.csv';
```

### API Endpoint Pipeline

```typescript
// Example: Fetch catalysts from API
const fetchCatalysts = async () => {
  const response = await fetch('/api/catalysts', {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN'
    }
  });
  const data = await response.json();
  return data;
};
```

### Zoho Analytics Direct Connection

```typescript
// Example: Using Zoho Analytics API SDK
import { ZohoAnalytics } from 'zoho-analytics-sdk';

const client = new ZohoAnalytics({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  refreshToken: 'YOUR_REFRESH_TOKEN'
});

const catalysts = await client.data.getReportData({
  workspace: 'catalyst-tracking',
  table: 'catalysts'
});
```

---

## 🗺️ Map Integration Details

### Map Generation Script (Python Example)

```python
import folium
import pandas as pd

# Load data
df = pd.read_csv('data/geolocation.csv')

# Create map
m = folium.Map(location=[42.3601, -71.0589], zoom_start=12)

# Add markers
for idx, row in df.iterrows():
    folium.Marker(
        location=[row['lat'], row['lng']],
        popup=row['name'],
        icon=folium.Icon(color='blue' if row['status'] == 'active' else 'gray')
    ).add_to(m)

# Save map
m.save('outputs/maps/boston_map.html')
```

### Zoho Embed Code

```html
<!-- In Zoho Dashboard, use HTML Embed Widget -->
<iframe 
  src="https://yourdomain.com/outputs/maps/boston_map.html" 
  width="100%" 
  height="600px"
  frameborder="0"
></iframe>
```

---

## 📅 Status Intervals System

Catalysts have **interval-based status tracking**:

- **Enrollment Date** → Active (interval 1)
- **Active** → Inactive (interval 1 ends, interval 2 starts)
- **Inactive** → Active (interval 2 ends, interval 3 starts)

Each interval is tracked separately with:
- Start date
- End date (null = current interval)
- Duration in days
- Check-ins during that interval

**Database Schema for Intervals:**

```sql
CREATE TABLE catalyst_status_intervals (
  id INT PRIMARY KEY,
  catalyst_id INT,
  status ENUM('active', 'inactive'),
  start_date DATE,
  end_date DATE,              -- NULL for current interval
  duration_days INT,
  check_ins INT,
  FOREIGN KEY (catalyst_id) REFERENCES catalysts(id)
);
```

---

## 🔧 How to Replace Placeholder Data

### Step 1: Identify Component
Find the component with placeholder data (look for `PLACEHOLDER DATA` comments).

### Step 2: Replace Data Source
```typescript
// Before (placeholder)
const catalysts = [
  { id: 1, name: 'Jackson, Terrell', ... },
];

// After (real data)
const [catalysts, setCatalysts] = useState([]);

useEffect(() => {
  fetchCatalysts().then(data => setCatalysts(data));
}, []);
```

### Step 3: Update Schema (if needed)
Ensure your real data matches the expected schema. Update TypeScript interfaces if necessary.

---

## 🚀 Deployment Checklist

- [ ] Replace all placeholder data with real data sources
- [ ] Test CSV imports or API connections
- [ ] Generate external maps (if using Option 1)
- [ ] Configure Zoho Analytics connections
- [ ] Set up scheduled data updates (weekly/daily)
- [ ] Test map layer toggles and filters
- [ ] Verify time range filtering works with real data
- [ ] Test Lead Directory with real lead data
- [ ] Verify Catalyst Directory shows correct status intervals

---

## 📞 Support

For integration questions, refer to:
- **Zoho Creator Docs:** https://www.zoho.com/creator/help/
- **Zoho Analytics API:** https://www.zoho.com/analytics/api/
- **Python Map Generation:** Folium (https://python-visualization.github.io/folium/)

---

**All components are modular and replaceable. Integration is designed to be as flexible as possible.**
