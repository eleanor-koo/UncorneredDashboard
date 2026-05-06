import { Info } from 'lucide-react';

// ============================================================================
// 📌 MAP INTEGRATION NOTES - CRITICAL FOR ZOHO / WORDPRESS EMBEDDING
// ============================================================================
//
// This component embeds externally generated HTML maps.
//
// Expected workflow:
// 1. Python / Jupyter notebook generates map HTML.
// 2. HTML map is saved to a stable hosted path.
// 3. This React/Figma Make component embeds the map in an iframe.
// 4. Later, Uncornered can replace the placeholder URL with the final hosted URL.
//
// Important:
// - The map file should overwrite the same filename each refresh.
// - That allows Zoho / WordPress / Uncornered Live to keep one stable embed URL.
// - Current layer toggles are passed as URL parameters for future use.
// - Folium maps will not automatically respond to these parameters unless the map
//   generation code is updated to read them or separate map files are created.
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
 
const MAP_URLS: Record<string, string> = {
  Boston:
    'https://Columbia-IEOR.github.io/uncornered/outputs/maps/boston_crew_network_dashboard.html',
  'Kansas City':
    'https://Columbia-IEOR.github.io/uncornered/outputs/maps/kc_crew_network_map.html',
  // Providence:
  //   'https://Columbia-IEOR.github.io/uncornered/outputs/maps/providence_crew_network_map.html',
};
 
export function InteractiveMap({ city, layers }: InteractiveMapProps) {
  const mapUrl = MAP_URLS[city];
 
  return (
    <div className="w-full h-full bg-gray-50 relative">
      <div className="w-full h-full relative overflow-hidden">
        {mapUrl ? (
          <iframe
            key={`${city}-${JSON.stringify(layers)}`}
            src={`${mapUrl}?layers=${encodeURIComponent(JSON.stringify(layers))}`}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
            title={`${city} Violence Intervention Map`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No map available for {city}
          </div>
        )}
      </div>
    </div>
  );
}