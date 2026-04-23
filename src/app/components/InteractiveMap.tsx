import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react';

// ============================================================================
// 📌 MAP INTEGRATION NOTES - CRITICAL FOR ZOHO EMBEDDING
// ============================================================================
//
// This component is a PLACEHOLDER for externally generated maps.
//
// PRODUCTION INTEGRATION OPTIONS:
//
// Option 1: External Map Generation (Python/ArcGIS/Mapbox)
// ----------------------------------------------------------
// 1. Generate map externally (Python script with Folium/Plotly)
// 2. Output HTML file to: /outputs/maps/{city}_map.html
// 3. In Zoho Dashboard:
//    - Use HTML Embed widget
//    - OR use iframe: <iframe src="https://yourdomain.com/outputs/maps/boston_map.html"></iframe>
//
// Option 2: Embedded in this React component
// -------------------------------------------
// 1. Use iframe to embed external map
// 2. Example: <iframe src="/maps/boston_map.html" width="100%" height="100%"></iframe>
//
// Option 3: Zoho Analytics Map Widget
// ------------------------------------
// 1. Create map in Zoho Analytics using built-in mapping
// 2. Embed the entire widget into Zoho Dashboard
// 3. No custom code needed
//
// DATA PIPELINE:
// Zoho Creator → Zoho Analytics → Map Generation Script → HTML Output
//
// UPDATING MAPS:
// - Auto-update: Replace HTML file weekly via scheduled script
// - Manual update: Re-run map generation script and replace file
// - API integration: Zoho API → Python script → Generate map on demand
//
// SCHEMA FOR MAP DATA:
// { catalyst_id, lat, lng, status, crew_id, conflict_flag, city }
//
// ============================================================================

interface InteractiveMapProps {
  city: string;
  layers: {
    crews: boolean;
    catalysts: boolean;
    conflicts: boolean;
    incidents: boolean;
    networks: boolean;
  };
}

// ============================================================================
// 📌 PLACEHOLDER DATA - THIS WILL BE REPLACED WITH REAL MAP EMBEDS
// ============================================================================
// TODO: Replace this entire component with:
// <iframe src={`/outputs/maps/${city.toLowerCase()}_map.html`} />
//
// OR integrate real coordinates from Zoho:
// Data source: /data/geolocation.csv OR API endpoint /api/maps/data?city={city}
// Expected schema: { id, lat, lng, type, name, status, ... }
// ============================================================================

const cityMapData: Record<string, any> = {
  'Boston': {
    center: 'Boston Metropolitan Area',
    // City background: Streets and districts layer
    districts: ['Dorchester', 'Roxbury', 'Mattapan', 'Hyde Park', 'Jamaica Plain'],
    crews: [
      { x: 35, y: 40, name: 'Dorchester Crew', size: 8, members: 23 },
      { x: 55, y: 30, name: 'Roxbury Collective', size: 6, members: 18 },
      { x: 25, y: 65, name: 'Mattapan Network', size: 5, members: 15 },
      { x: 70, y: 55, name: 'Hyde Park Group', size: 4, members: 12 },
    ],
    catalysts: [
      { x: 40, y: 35 }, { x: 32, y: 48 }, { x: 60, y: 28 }, { x: 52, y: 38 },
      { x: 28, y: 70 }, { x: 75, y: 52 }, { x: 45, y: 60 }, { x: 68, y: 45 },
      { x: 38, y: 42 }, { x: 58, y: 35 }, { x: 30, y: 55 }, { x: 72, y: 58 },
    ],
    conflicts: [
      { x: 48, y: 42, intensity: 'high' },
      { x: 38, y: 55, intensity: 'medium' },
      { x: 65, y: 35, intensity: 'high' },
      { x: 30, y: 75, intensity: 'low' },
    ],
    heatmapZones: [
      { x: 30, y: 40, radius: 15, intensity: 0.7 },
      { x: 55, y: 30, radius: 12, intensity: 0.5 },
      { x: 25, y: 68, radius: 10, intensity: 0.8 },
      { x: 70, y: 50, radius: 8, intensity: 0.4 },
    ],
  },
  'Kansas City': {
    center: 'Kansas City Metro',
    districts: ['East Side', 'Westport', 'South KC', 'Downtown', 'Midtown'],
    crews: [
      { x: 40, y: 35, name: 'East Side Collective', size: 7, members: 19 },
      { x: 60, y: 45, name: 'Westport Group', size: 5, members: 14 },
      { x: 30, y: 60, name: 'South KC Network', size: 6, members: 16 },
    ],
    catalysts: [
      { x: 45, y: 32 }, { x: 38, y: 40 }, { x: 62, y: 42 }, { x: 56, y: 50 },
      { x: 32, y: 65 }, { x: 35, y: 55 }, { x: 50, y: 38 }, { x: 42, y: 48 },
    ],
    conflicts: [
      { x: 42, y: 38, intensity: 'medium' },
      { x: 58, y: 48, intensity: 'high' },
      { x: 33, y: 62, intensity: 'low' },
    ],
    heatmapZones: [
      { x: 40, y: 35, radius: 14, intensity: 0.6 },
      { x: 60, y: 45, radius: 11, intensity: 0.7 },
      { x: 30, y: 60, radius: 9, intensity: 0.5 },
    ],
  },
  'Providence': {
    center: 'Providence Area',
    districts: ['South Providence', 'Olneyville', 'Central Falls', 'Fox Point', 'Federal Hill'],
    crews: [
      { x: 45, y: 40, name: 'South Providence Crew', size: 6, members: 17 },
      { x: 55, y: 55, name: 'Olneyville Network', size: 5, members: 13 },
      { x: 35, y: 65, name: 'Central Falls Group', size: 4, members: 11 },
    ],
    catalysts: [
      { x: 48, y: 38 }, { x: 42, y: 45 }, { x: 58, y: 52 }, { x: 52, y: 60 },
      { x: 37, y: 68 }, { x: 40, y: 58 }, { x: 50, y: 48 }, { x: 44, y: 42 },
    ],
    conflicts: [
      { x: 46, y: 42, intensity: 'high' },
      { x: 54, y: 57, intensity: 'medium' },
      { x: 36, y: 66, intensity: 'low' },
    ],
    heatmapZones: [
      { x: 45, y: 40, radius: 13, intensity: 0.65 },
      { x: 55, y: 55, radius: 10, intensity: 0.55 },
      { x: 35, y: 65, radius: 8, intensity: 0.45 },
    ],
  },
};

export function InteractiveMap({ city, layers }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(12);
  const mapData = cityMapData[city];

  const { crews, catalysts, conflicts, heatmapZones, center, districts } = mapData;

  return (
    <div className="flex-1 bg-gray-50 relative">
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded shadow-lg p-3 z-10 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-3 w-3 text-gray-600" />
          <span className="font-semibold text-gray-900">Legend</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-700">Crews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-700">Catalysts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-700">Conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 opacity-30" />
            <span className="text-gray-700">Incident Zones</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white rounded shadow-lg z-10 overflow-hidden">
        <button
          onClick={() => setZoom(Math.min(zoom + 1, 18))}
          className="p-2 hover:bg-gray-100 border-b border-gray-200 block w-full"
        >
          <ZoomIn className="h-4 w-4 text-gray-700" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 1, 8))}
          className="p-2 hover:bg-gray-100 border-b border-gray-200 block w-full"
        >
          <ZoomOut className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 block w-full">
          <Maximize2 className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-full relative overflow-hidden">
        {/* City Background Layer - Streets & Districts */}
        {/* TODO: Replace with real map tiles (OpenStreetMap, Mapbox, Google Maps) */}
        <div className="absolute inset-0 bg-gray-100">
          {districts && (
            <div className="absolute top-6 right-16 bg-white bg-opacity-80 p-2 rounded text-xs">
              <div className="font-semibold text-gray-700 mb-1">Districts</div>
              {districts.map((district: string) => (
                <div key={district} className="text-gray-600">{district}</div>
              ))}
            </div>
          )}
        </div>

        {/* Background grid pattern (simulating streets) */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
            <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 0 40 L 80 40 M 40 0 L 40 80" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streets)" opacity="0.3" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Heatmap zones - only show if incidents layer is enabled */}
          {layers.incidents && heatmapZones.map((zone, idx) => (
            <circle
              key={`heat-${idx}`}
              cx={`${zone.x}%`}
              cy={`${zone.y}%`}
              r={`${zone.radius}%`}
              fill="rgba(249, 115, 22, 0.2)"
              opacity={zone.intensity}
            />
          ))}

          {/* Network connections - only show if networks layer is enabled */}
          {layers.networks && (
            <>
              <line x1="35%" y1="40%" x2="55%" y2="30%" stroke="#9333ea" strokeWidth="1" opacity="0.3" />
              <line x1="55%" y1="30%" x2="70%" y2="55%" stroke="#9333ea" strokeWidth="1" opacity="0.3" />
              <line x1="35%" y1="40%" x2="25%" y2="65%" stroke="#9333ea" strokeWidth="1" opacity="0.3" />
            </>
          )}

          {/* Conflict indicators - only show if conflicts layer is enabled */}
          {layers.conflicts && conflicts.map((conflict, idx) => (
            <g key={`conflict-${idx}`}>
              <circle
                cx={`${conflict.x}%`}
                cy={`${conflict.y}%`}
                r="3"
                fill={
                  conflict.intensity === 'high'
                    ? '#dc2626'
                    : conflict.intensity === 'medium'
                    ? '#f97316'
                    : '#fbbf24'
                }
                className="animate-pulse"
              />
              <circle
                cx={`${conflict.x}%`}
                cy={`${conflict.y}%`}
                r="8"
                fill="none"
                stroke={
                  conflict.intensity === 'high'
                    ? '#dc2626'
                    : conflict.intensity === 'medium'
                    ? '#f97316'
                    : '#fbbf24'
                }
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Crew locations - only show if crews layer is enabled */}
          {layers.crews && crews.map((crew, idx) => (
            <g key={`crew-${idx}`}>
              <g className="cursor-pointer">
                <circle
                  cx={`${crew.x}%`}
                  cy={`${crew.y}%`}
                  r={crew.size}
                  fill="#9333ea"
                  opacity="0.7"
                  className="hover:opacity-100 transition-opacity"
                />
                <text
                  x={`${crew.x}%`}
                  y={`${crew.y + 3}%`}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-white pointer-events-none"
                >
                  {crew.name.split(' ')[0]}
                </text>
                <title>{crew.name} ({crew.members} members)</title>
              </g>
            </g>
          ))}

          {/* Catalyst markers - only show if catalysts layer is enabled */}
          {layers.catalysts && catalysts.map((catalyst, idx) => (
            <circle
              key={`catalyst-${idx}`}
              cx={`${catalyst.x}%`}
              cy={`${catalyst.y}%`}
              r="2.5"
              fill="#3b82f6"
              className="cursor-pointer hover:r-4 transition-all"
            />
          ))}
        </svg>

        {/* Map label */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded text-xs font-medium">
          {center} • Zoom: {zoom}
        </div>

        {/* Data update indicator */}
        <div className="absolute bottom-4 right-20 bg-green-500 bg-opacity-90 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Live Data • Updated Weekly
        </div>
      </div>
    </div>
  );
}
