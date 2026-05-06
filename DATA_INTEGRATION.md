# Violence Intervention Dashboard - Data Integration Guide

**Complete Documentation for Easy Integration with External Data Sources**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Application Architecture](#application-architecture)
3. [Data Schemas](#data-schemas)
4. [Integration Options](#integration-options)
5. [Map Integration](#map-integration)
6. [Status Intervals System](#status-intervals-system)
7. [Step-by-Step Integration](#step-by-step-integration)
8. [API Examples](#api-examples)
9. [Deployment Checklist](#deployment-checklist)

---

## Overview

This dashboard is designed as a **modular, data-agnostic system** that displays violence intervention data. All components are built to accept data from multiple sources:

- **Zoho Creator** (data entry)
- **Zoho Analytics** (aggregation and analytics)
- **CSV files** (manual imports)
- **REST APIs** (real-time integration)
- **External map embeds** (Python-generated HTML maps)

**Key Design Principle:** Every component accepts data via props and can be replaced or modified without affecting other parts of the system.

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UNCORNERED.LIVE DASHBOARD                 │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌──────▼────────┐
        │   Header     │ │  Stats │ │ Navigation    │
        │ City Selector│ │Overview│ │    Cards      │
        └──────────────┘ └────────┘ └───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Interactive Map  │
                    │  (External HTML)  │
                    └───────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
  ┌─────▼──────┐    ┌────────▼────────┐   ┌───────▼────────┐
  │ Catalyst   │    │   Lead          │   │  Weekly        │
  │ Directory  │    │   Directory     │   │  Check-ins     │
  └────────────┘    └─────────────────┘   └────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Influence Network │
                    │   Catalyst Logs   │
                    └───────────────────┘
```

### File Structure

```
src/
├── app/
│   ├── App.tsx                    # Main app with routing
│   └── components/
│       ├── Header.tsx             # City selector + branding
│       ├── StatsOverview.tsx      # Top-line metrics
│       ├── InteractiveMap.tsx     # Map iframe embed
│       ├── NavigationCards.tsx    # Page navigation
│       ├── MapControls.tsx        # Map filters (future use)
│       └── pages/
│           ├── CatalystDirectory.tsx   # Catalyst list + profiles
│           ├── LeadDirectory.tsx       # Lead management
│           ├── WeeklyCheckIns.tsx      # Check-in tracking
│           ├── InfluenceNetwork.tsx    # Network analysis
│           └── CatalystLogs.tsx        # Activity logs
```

---

## Data Schemas

### 1. **City Stats** (StatsOverview.tsx)

**Location:** `src/app/components/StatsOverview.tsx`

**Purpose:** Display high-level metrics for each city

**Schema:**
```typescript
{
  city: string;                    // "Boston", "Kansas City", "Providence"
  stats: {
    total: number;                 // Total catalysts
    active: number;                // Currently active
    inactive: number;              // Currently inactive
    recentActivity: number;        // Activity in last 7 days
  };
  demographics: {
    gender: {
      male: number;
      female: number;
      other: number;
    };
    age: {
      "18-24": number;
      "25-34": number;
      "35-44": number;
      "45+": number;
    };
    race: {
      black: number;
      hispanic: number;
      white: number;
      other: number;
    };
  };
}
```

**Integration Points:**
- **CSV:** `/data/city_stats.csv`
- **API:** `GET /api/stats?city={city}`
- **Zoho Analytics:** Dashboard query with aggregates

---

### 2. **Catalysts** (CatalystDirectory.tsx)

**Location:** `src/app/components/pages/CatalystDirectory.tsx`

**Purpose:** Full catalyst directory with profiles and interval tracking

**Schema:**
```typescript
{
  id: number;
  name: string;                    // "Last, First" format
  status: "active" | "inactive";   // Current status
  type: "Network" | "Stipend" | "Volunteer";
  lead: string;                    // Lead name (foreign key)
  crew: string;                    // Crew name
  phone: string;                   // "(617) 555-0142"
  email: string;
  address: string;                 // "Neighborhood, City"
  enrolled: string;                // ISO date: "2025-08-15"
  checkIns: number;                // Total check-ins
  lastContact: string;             // ISO date: "2026-04-20"
  gender: string;                  // "Male", "Female", "Other"
  age: number;
  race: string;                    // "Black", "Hispanic", "White", "Other"
  statusIntervals: [               // ⚠️ CRITICAL: Interval-based tracking
    {
      status: "active" | "inactive";
      startDate: string;           // ISO date
      endDate: string | null;      // null = current interval
      durationDays: number;        // Calculated duration
      checkIns?: number;           // Check-ins in this interval
    }
  ];
}
```

**Status Intervals Explained:**

Catalysts can move between active/inactive status multiple times. Each status change creates a new interval:

```
Timeline Example:
┌─────────────┬──────────────┬─────────────┐
│   Active    │  Inactive    │   Active    │
│ 250 days    │   36 days    │  45 days    │
│ 34 check-ins│   0 check-ins│  8 check-ins│
└─────────────┴──────────────┴─────────────┘
   Interval 1     Interval 2    Interval 3
```

**Integration Points:**
- **CSV:** `/data/catalysts.csv` with nested intervals (see CSV format below)
- **API:** `GET /api/catalysts` with `statusIntervals` array
- **Zoho:** Use related table: `catalysts` ← `status_intervals` (one-to-many)

**CSV Format with Intervals:**
```csv
id,name,status,type,lead,crew,phone,email,address,enrolled,checkIns,lastContact,gender,age,race,intervals_json
1,"Jackson, Terrell","active","Network","Marcus Johnson","Dorchester Crew","(617) 555-0142","terrell.j@example.com","Dorchester, Boston","2025-08-15",34,"2026-04-20","Male",24,"Black","[{\"status\":\"active\",\"startDate\":\"2025-08-15\",\"endDate\":null,\"durationDays\":250,\"checkIns\":34}]"
```

---

### 3. **Leads** (LeadDirectory.tsx)

**Location:** `src/app/components/pages/LeadDirectory.tsx`

**Purpose:** Lead staff management and tracking

**Schema:**
```typescript
{
  id: number;
  name: string;                    // "Last, First" format
  phone: string;
  email: string;
  city: string;                    // "Boston", "Kansas City", etc.
  address: string;
  hireDate: string;                // ISO date: "2024-03-15"
  status: "active" | "inactive";
  assignedCrews: string[];         // Array of crew names
  totalCatalysts: number;          // Total assigned catalysts
  activeCatalysts: number;         // Currently active catalysts
  weeklyUploads: number;           // Upload completion % (0-100)
}
```

**Integration Points:**
- **CSV:** `/data/leads.csv`
- **API:** `GET /api/leads?city={city}`
- **Zoho:** Direct table query with crew relationships

---

### 4. **Map Data** (InteractiveMap.tsx)

**Location:** `src/app/components/InteractiveMap.tsx`

**Purpose:** Embed externally generated geographic maps

**Current Implementation:**
```typescript
const MAP_URLS: Record<string, string> = {
  Boston: 'https://Columbia-IEOR.github.io/uncornered/outputs/maps/boston_crew_network_dashboard.html',
  'Kansas City': 'https://Columbia-IEOR.github.io/uncornered/outputs/maps/kc_crew_network_map.html',
  // Add more cities as needed
};
```

**How It Works:**
1. Python script generates HTML map using **Folium**, **Plotly**, or **ArcGIS**
2. Map is saved to a stable URL (GitHub Pages, web server, Zoho file storage)
3. React component embeds map in iframe
4. Map updates by replacing the file at the same URL

**Map Layer Parameters (for future use):**
```typescript
layers: {
  crews: boolean;          // Show crew territories
  catalysts: boolean;      // Show catalyst locations
  conflicts: boolean;      // Show conflict zones
  incidents: boolean;      // Show incident markers
  networks: boolean;       // Show network connections
}
```

**Note:** Current maps don't respond to layer toggles. To implement:
- Generate separate HTML files per layer combination, OR
- Use JavaScript in map HTML to read URL parameters

---

### 5. **Weekly Check-ins** (WeeklyCheckIns.tsx)

**Schema:**
```typescript
{
  week: string;                    // "Week of Apr 14, 2026"
  catalysts: [
    {
      id: number;
      name: string;
      status: "complete" | "partial" | "missed";
      checkInDate: string | null;  // ISO date or null
      contactMethod: string;       // "Phone", "In-person", "Text"
      notes: string;
      lead: string;
    }
  ];
  completionRate: number;          // 0-100 percentage
}
```

---

### 6. **Influence Network** (InfluenceNetwork.tsx)

**Schema:**
```typescript
{
  catalyst: {
    id: number;
    name: string;
    influenceScore: number;        // 1-10 scale
    networkSize: number;           // Number of connections
    reachability: number;          // Network centrality metric
    conflictHistory: number;       // Historical conflict involvement
  };
  connections: [
    {
      fromId: number;
      toId: number;
      strength: number;            // 1-10 relationship strength
      type: "ally" | "conflict" | "neutral";
    }
  ];
}
```

---

### 7. **Catalyst Logs** (CatalystLogs.tsx)

**Schema:**
```typescript
{
  id: number;
  catalystId: number;
  catalystName: string;
  date: string;                    // ISO date
  type: "peace" | "disruption" | "neutral";
  description: string;             // Activity description
  location: string;
  witnesses: string[];
  lead: string;                    // Recording lead name
  verificationStatus: "verified" | "pending" | "disputed";
}
```

---

## Integration Options

### Option 1: CSV Import (Simplest)

**Best for:** Testing, small datasets, manual updates

**Steps:**
1. Export data from Zoho Creator as CSV
2. Place files in `/data/` directory
3. Import in component:

```typescript
import { useState, useEffect } from 'react';

function CatalystDirectory() {
  const [catalysts, setCatalysts] = useState([]);

  useEffect(() => {
    // Load CSV via Vite's static import or fetch
    fetch('/data/catalysts.csv')
      .then(res => res.text())
      .then(csvText => {
        const parsed = parseCSV(csvText);
        setCatalysts(parsed);
      });
  }, []);

  // ... rest of component
}
```

**CSV Parser Library:** Use `papaparse` or `csv-parse`
```bash
pnpm add papaparse
```

---

### Option 2: REST API (Recommended for Production)

**Best for:** Real-time data, automated updates, scalability

**Steps:**

1. **Create API endpoints** (Zoho Creator, custom backend, or serverless function)

Example endpoints:
```
GET /api/stats?city={city}           # City statistics
GET /api/catalysts?city={city}       # All catalysts
GET /api/catalysts/{id}              # Single catalyst
GET /api/leads?city={city}           # All leads
GET /api/checkins?week={date}        # Weekly check-ins
```

2. **Update components to fetch from API:**

```typescript
// src/app/components/StatsOverview.tsx
import { useState, useEffect } from 'react';

export function StatsOverview({ city }: { city: string }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?city=${city}`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No data available</div>;

  // ... render stats
}
```

3. **Set up API authentication:**

Create `.env` file:
```env
VITE_API_URL=https://your-api.com
VITE_API_TOKEN=your_secret_token
```

Use in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

fetch(`${API_URL}/catalysts`, {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
})
```

---

### Option 3: Zoho Analytics Direct Connection

**Best for:** Full Zoho ecosystem integration

**Steps:**

1. **Install Zoho Analytics SDK:**
```bash
pnpm add zoho-analytics-sdk
```

2. **Set up Zoho OAuth:**

Create Zoho OAuth app at: https://api-console.zoho.com/

Get credentials:
- Client ID
- Client Secret
- Refresh Token

3. **Create Zoho client:**

```typescript
// src/lib/zoho-client.ts
import { ZohoAnalytics } from 'zoho-analytics-sdk';

export const zohoClient = new ZohoAnalytics({
  clientId: import.meta.env.VITE_ZOHO_CLIENT_ID,
  clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
  refreshToken: import.meta.env.VITE_ZOHO_REFRESH_TOKEN,
  region: 'US' // or 'EU', 'IN', 'AU'
});
```

4. **Fetch data in components:**

```typescript
import { zohoClient } from '../lib/zoho-client';

export function CatalystDirectory() {
  const [catalysts, setCatalysts] = useState([]);

  useEffect(() => {
    zohoClient.data.getReportData({
      workspace: 'catalyst-tracking',
      table: 'catalysts',
      filters: {
        city: 'Boston'
      }
    }).then(data => {
      setCatalysts(data.rows);
    });
  }, []);

  // ... rest of component
}
```

---

## Map Integration

### Current Setup

The dashboard embeds **externally generated HTML maps** using iframes. This approach:
- ✅ Supports any mapping library (Folium, Plotly, ArcGIS, Mapbox)
- ✅ Keeps maps independent from React app
- ✅ Allows non-technical users to update maps without touching code
- ✅ Works seamlessly with Zoho Dashboard embeds

### Map Generation Workflow

```
┌────────────────┐
│ Zoho Creator   │  → Data entry (catalysts, crews, incidents)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Zoho Analytics │  → Data aggregation + geolocation
└───────┬────────┘
        │ Export CSV or API
        ▼
┌────────────────┐
│ Python Script  │  → Generate map HTML (Folium/Plotly)
│ (Weekly Cron)  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  GitHub Pages  │  → Host map HTML at stable URL
│  or Web Server │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Dashboard     │  → Embed map in iframe
│  (This App)    │
└────────────────┘
```

### Python Map Generation Example

**Using Folium:**

```python
import folium
import pandas as pd
from datetime import datetime

# Load data from Zoho Analytics or CSV
df = pd.read_csv('catalyst_locations.csv')

# Create map centered on Boston
m = folium.Map(
    location=[42.3601, -71.0589],
    zoom_start=12,
    tiles='CartoDB dark_matter'
)

# Add crew territories as choropleth
folium.Choropleth(
    geo_data='boston_neighborhoods.geojson',
    name='Crew Territories',
    data=df,
    columns=['neighborhood', 'incident_count'],
    key_on='feature.properties.name',
    fill_color='YlOrRd',
    fill_opacity=0.6,
    line_opacity=0.2,
    legend_name='Incident Count'
).add_to(m)

# Add catalyst markers
for idx, row in df[df['type'] == 'catalyst'].iterrows():
    color = 'green' if row['status'] == 'active' else 'gray'
    folium.CircleMarker(
        location=[row['lat'], row['lng']],
        radius=8,
        popup=f"{row['name']}<br>{row['crew']}",
        color=color,
        fill=True,
        fillColor=color,
        fillOpacity=0.7
    ).add_to(m)

# Add crew network connections
for idx, row in df[df['type'] == 'connection'].iterrows():
    folium.PolyLine(
        locations=[[row['lat1'], row['lng1']], [row['lat2'], row['lng2']]],
        color='#E8782A',
        weight=2,
        opacity=0.5,
        dash_array='4'
    ).add_to(m)

# Add title and metadata
title_html = '''
<div style="position: fixed; 
     top: 10px; left: 50%; transform: translateX(-50%);
     width: auto; z-index: 9999;
     background: rgba(255,255,255,0.94);
     padding: 8px 20px; border-radius: 4px;
     font-family: system-ui; font-size: 14px;
     font-weight: 600; color: #222;
     box-shadow: 0 1px 4px rgba(0,0,0,0.12);
     border: 1px solid #ddd;">
    Boston Crew Network Map
    <span style="color: #888; font-weight: 400;">&nbsp;·&nbsp;{date}</span>
</div>
'''.format(date=datetime.now().strftime('%b %d, %Y'))

m.get_root().html.add_child(folium.Element(title_html))

# Save map
m.save('outputs/maps/boston_crew_network_dashboard.html')
print('✅ Map generated: boston_crew_network_dashboard.html')
```

### Hosting Maps

**Option A: GitHub Pages (Free, recommended)**

1. Create GitHub repository
2. Enable GitHub Pages in Settings
3. Upload map HTML to `outputs/maps/` directory
4. Access at: `https://USERNAME.github.io/REPO/outputs/maps/boston_map.html`

**Current Example:**
```
https://Columbia-IEOR.github.io/uncornered/outputs/maps/boston_crew_network_dashboard.html
```

**Option B: Web Server**

Upload to any web server and use the URL in `MAP_URLS` constant.

**Option C: Zoho File Storage**

1. Upload map HTML to Zoho Files
2. Get public share link
3. Use link in dashboard

### Updating Dashboard Map URLs

Edit `src/app/components/InteractiveMap.tsx`:

```typescript
const MAP_URLS: Record<string, string> = {
  Boston: 'https://your-maps.com/boston.html',
  'Kansas City': 'https://your-maps.com/kc.html',
  Providence: 'https://your-maps.com/providence.html',
};
```

### Automated Map Updates

**Weekly Cron Job (Linux/Mac):**

```bash
# crontab -e
0 2 * * 1 cd /path/to/project && python generate_maps.py
```

**GitHub Actions (Automated):**

Create `.github/workflows/update-maps.yml`:

```yaml
name: Update Maps Weekly

on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2am
  workflow_dispatch:       # Manual trigger

jobs:
  update-maps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install folium pandas requests
      
      - name: Generate maps
        env:
          ZOHO_API_KEY: ${{ secrets.ZOHO_API_KEY }}
        run: python scripts/generate_maps.py
      
      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add outputs/maps/*.html
          git commit -m "Update maps - $(date)"
          git push
```

---

## Status Intervals System

### Concept

Catalysts don't have a simple "active/inactive" flag. They have a **history of status changes**, where each period is tracked independently.

### Why Intervals Matter

Traditional approach (WRONG):
```
Status: Active
Enrolled: 2025-08-15
Total Days Active: 250
```

**Problem:** What if they were inactive for 36 days in the middle? Traditional tracking loses that information.

**Interval-based approach (CORRECT):**
```
Interval 1: Active   | 2025-08-15 → 2026-01-10 | 148 days | 20 check-ins
Interval 2: Inactive | 2026-01-10 → 2026-02-15 |  36 days |  0 check-ins
Interval 3: Active   | 2026-02-15 → present    |  66 days | 14 check-ins
```

### Database Schema

**Option 1: Nested JSON (CSV/Document DB)**

```sql
CREATE TABLE catalysts (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  current_status ENUM('active', 'inactive'),
  status_intervals JSON  -- Array of interval objects
);
```

Example data:
```json
{
  "id": 1,
  "name": "Jackson, Terrell",
  "current_status": "active",
  "status_intervals": [
    {
      "status": "active",
      "startDate": "2025-08-15",
      "endDate": "2026-01-10",
      "durationDays": 148,
      "checkIns": 20
    },
    {
      "status": "inactive",
      "startDate": "2026-01-10",
      "endDate": "2026-02-15",
      "durationDays": 36,
      "checkIns": 0
    },
    {
      "status": "active",
      "startDate": "2026-02-15",
      "endDate": null,
      "durationDays": 66,
      "checkIns": 14
    }
  ]
}
```

**Option 2: Relational Tables (SQL)**

```sql
CREATE TABLE catalysts (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  current_status ENUM('active', 'inactive')
);

CREATE TABLE catalyst_status_intervals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  catalyst_id INT,
  status ENUM('active', 'inactive'),
  start_date DATE,
  end_date DATE,              -- NULL for current interval
  duration_days INT,
  check_ins INT DEFAULT 0,
  FOREIGN KEY (catalyst_id) REFERENCES catalysts(id)
);
```

### Zoho Creator Implementation

**Form 1: Catalysts**
- Name
- Current Status (dropdown: Active/Inactive)
- Type, Lead, Crew, etc.

**Form 2: Status Changes**
- Catalyst (lookup to Catalysts)
- New Status (dropdown)
- Change Date
- Reason (text)

**Deluge Script (Auto-create intervals):**
```deluge
// On status change in Catalysts form
if (input.Status != input.Old_Status) {
  // Close previous interval
  for each interval in Catalyst_Status_Intervals[Catalyst_ID == input.ID && End_Date == null] {
    interval.End_Date = today;
    interval.Duration_Days = days360(interval.Start_Date, today);
  }
  
  // Create new interval
  insert into Catalyst_Status_Intervals
  (
    Catalyst_ID: input.ID,
    Status: input.Status,
    Start_Date: today,
    End_Date: null,
    Duration_Days: 0,
    Check_Ins: 0
  );
}
```

---

## Step-by-Step Integration

### Phase 1: Replace Static Data with CSV

**Estimated Time:** 2-4 hours

1. **Export data from Zoho Creator**
   - Go to each form
   - Click "Export" → CSV
   - Save to `/data/` directory

2. **Install CSV parser**
   ```bash
   pnpm add papaparse
   ```

3. **Update one component** (start with StatsOverview)

   Before:
   ```typescript
   const cityData = {
     Boston: { stats: { ... } }
   };
   ```

   After:
   ```typescript
   import { useState, useEffect } from 'react';
   import Papa from 'papaparse';

   export function StatsOverview({ city }) {
     const [stats, setStats] = useState(null);

     useEffect(() => {
       Papa.parse('/data/city_stats.csv', {
         download: true,
         header: true,
         complete: (results) => {
           const cityStats = results.data.find(row => row.city === city);
           setStats(cityStats);
         }
       });
     }, [city]);

     if (!stats) return <div>Loading...</div>;
     
     // ... render stats
   }
   ```

4. **Test with real data**
5. **Repeat for other components**

### Phase 2: Set Up REST API

**Estimated Time:** 1-2 days

1. **Create API backend** (choose one):
   - Zoho Creator REST API (built-in)
   - Custom Node.js/Python backend
   - Serverless functions (Vercel, Netlify, AWS Lambda)

2. **Define endpoints**
   ```
   GET /api/catalysts?city={city}
   GET /api/leads
   GET /api/stats?city={city}
   ```

3. **Add authentication**

4. **Update components to use `fetch()`**

5. **Add loading states and error handling**

### Phase 3: Integrate Maps

**Estimated Time:** 4-8 hours

1. **Generate map HTML with Python**
   - Use example script above
   - Test locally first

2. **Host map**
   - Upload to GitHub Pages OR
   - Host on web server

3. **Update `MAP_URLS` in dashboard**

4. **Set up automated updates** (optional)

### Phase 4: Production Deployment

**Estimated Time:** 4-8 hours

1. **Environment variables**
   - Create `.env` file
   - Add API keys
   - Configure build

2. **Build dashboard**
   ```bash
   pnpm build
   ```

3. **Deploy** (choose one):
   - Vercel (recommended)
   - Netlify
   - GitHub Pages
   - Zoho Embedded Widget

4. **Test all features**

---

## API Examples

### Example 1: Fetch Catalysts

**Request:**
```http
GET /api/catalysts?city=Boston&status=active
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 98,
  "data": [
    {
      "id": 1,
      "name": "Jackson, Terrell",
      "status": "active",
      "type": "Network",
      "lead": "Marcus Johnson",
      "crew": "Dorchester Crew",
      "phone": "(617) 555-0142",
      "email": "terrell.j@example.com",
      "address": "Dorchester, Boston",
      "enrolled": "2025-08-15",
      "checkIns": 34,
      "lastContact": "2026-04-20",
      "gender": "Male",
      "age": 24,
      "race": "Black",
      "statusIntervals": [
        {
          "status": "active",
          "startDate": "2025-08-15",
          "endDate": null,
          "durationDays": 250,
          "checkIns": 34
        }
      ]
    }
  ]
}
```

### Example 2: Update Catalyst Status

**Request:**
```http
PUT /api/catalysts/1/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "inactive",
  "reason": "Incarcerated",
  "changeDate": "2026-04-25"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated",
  "catalyst": {
    "id": 1,
    "name": "Jackson, Terrell",
    "status": "inactive",
    "statusIntervals": [
      {
        "status": "active",
        "startDate": "2025-08-15",
        "endDate": "2026-04-25",
        "durationDays": 253,
        "checkIns": 34
      },
      {
        "status": "inactive",
        "startDate": "2026-04-25",
        "endDate": null,
        "durationDays": 0,
        "checkIns": 0
      }
    ]
  }
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All placeholder data replaced with real data sources
- [ ] API endpoints tested and working
- [ ] Maps generated and hosted at stable URLs
- [ ] Environment variables configured
- [ ] Authentication tokens secure
- [ ] Error handling implemented
- [ ] Loading states added to all async components

### Data Validation

- [ ] Catalyst status intervals correctly tracked
- [ ] Lead assignments match crew data
- [ ] City filters work correctly
- [ ] Demographics sum to total counts
- [ ] Check-in completion rates calculate correctly

### Map Integration

- [ ] All city maps accessible at configured URLs
- [ ] Maps load correctly in iframe
- [ ] Layer toggles work (if implemented)
- [ ] Time filters function properly
- [ ] Map auto-updates scheduled (if using cron)

### Testing

- [ ] Test each page/view
- [ ] Verify city switching works
- [ ] Check mobile responsiveness
- [ ] Test with real data volumes
- [ ] Verify API rate limits
- [ ] Check browser compatibility

### Performance

- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] API responses cached where appropriate
- [ ] Loading states prevent layout shift
- [ ] No memory leaks in long sessions

### Security

- [ ] API tokens not exposed in frontend code
- [ ] HTTPS enabled
- [ ] Authentication required for sensitive endpoints
- [ ] Rate limiting implemented
- [ ] Input validation on all user inputs

### Documentation

- [ ] Update this DATA_INTEGRATION.md with final configurations
- [ ] Document API endpoints
- [ ] Create user guide for non-technical staff
- [ ] Add troubleshooting section

---

## Support Resources

### Zoho

- **Zoho Creator Docs:** https://www.zoho.com/creator/help/
- **Zoho Analytics API:** https://www.zoho.com/analytics/api/
- **Zoho CRM Integration:** https://www.zoho.com/crm/developer/docs/

### Python Mapping

- **Folium Documentation:** https://python-visualization.github.io/folium/
- **Plotly Maps:** https://plotly.com/python/maps/
- **GeoPandas:** https://geopandas.org/

### React/Vite

- **Vite Docs:** https://vitejs.dev/
- **React Documentation:** https://react.dev/

### Deployment

- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com/
- **GitHub Pages:** https://pages.github.com/

---

## Contact & Maintenance

**Repository:** https://github.com/Columbia-IEOR/uncornered

**Issues:** https://github.com/Columbia-IEOR/uncornered/issues

**Integration Support:** Create an issue with the `integration` tag

---

**Last Updated:** April 2026

**Version:** 1.0

**Status:** Production Ready
