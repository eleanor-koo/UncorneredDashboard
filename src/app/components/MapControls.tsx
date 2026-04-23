import { useState } from 'react';
import { Layers, Filter, Calendar, User, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';

// ============================================================================
// 📌 DATA INTEGRATION NOTES
// ============================================================================
// This component will connect to external data sources for filters:
//
// Data Source: Zoho Creator → Zoho Analytics → Dashboard
// Pipeline: CSV export OR API endpoint
//
// Expected Schema for Filters:
// - crews: { id, name, city, lead_id, member_count, status }
// - catalysts: { id, name, crew_id, status, type, enrollment_date }
// - leads: { id, name, phone, email, assigned_crews[] }
//
// Integration Methods:
// 1. CSV Import (weekly): Upload to /data/crews.csv, /data/catalysts.csv
// 2. API Endpoint: POST to /api/filters/data with auth token
// 3. Zoho Analytics Direct Connect: Use Zoho API SDK
//
// All data is MODULAR and REPLACEABLE - update schema in /types/data.ts
// ============================================================================

interface MapControlsProps {
  layers: {
    crews: boolean;
    catalysts: boolean;
    conflicts: boolean;
    incidents: boolean;
    networks: boolean;
  };
  onLayerToggle: (layer: string) => void;
  onTimeRangeChange?: (range: { start: Date | undefined; end: Date | undefined }) => void;
}

// ============================================================================
// 📌 PLACEHOLDER DATA - REPLACE WITH REAL DATA
// ============================================================================
// TODO: Replace with API call or CSV import
// Data should come from: Zoho Creator → Analytics → Dashboard
// Schema: { id, name, members[], status, city }
// ============================================================================
const PLACEHOLDER_CREWS = [
  { id: 1, name: 'Dorchester Crew', members: 23, city: 'Boston' },
  { id: 2, name: 'Roxbury Collective', members: 18, city: 'Boston' },
  { id: 3, name: 'Mattapan Network', members: 15, city: 'Boston' },
  { id: 4, name: 'Hyde Park Group', members: 12, city: 'Boston' },
];

const PLACEHOLDER_CATALYSTS = [
  { id: 1, name: 'Jackson, Terrell', crew: 'Dorchester Crew', status: 'active' },
  { id: 2, name: 'Williams, DeAndre', crew: 'Roxbury Collective', status: 'active' },
  { id: 3, name: 'Rodriguez, Maria', crew: 'Hyde Park Group', status: 'active' },
  { id: 4, name: 'Thompson, Marcus', crew: 'Mattapan Network', status: 'inactive' },
  { id: 5, name: 'Chen, Wei', crew: 'Dorchester Crew', status: 'active' },
];

export function MapControls({ layers, onLayerToggle, onTimeRangeChange }: MapControlsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    crews: false,
    catalysts: false,
  });

  const [selectedCrews, setSelectedCrews] = useState<number[]>([]);
  const [selectedCatalysts, setSelectedCatalysts] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'custom'>('30days');
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCrew = (crewId: number) => {
    setSelectedCrews((prev) =>
      prev.includes(crewId) ? prev.filter((id) => id !== crewId) : [...prev, crewId]
    );
  };

  const toggleCatalyst = (catalystId: number) => {
    setSelectedCatalysts((prev) =>
      prev.includes(catalystId) ? prev.filter((id) => id !== catalystId) : [...prev, catalystId]
    );
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as typeof timeRange);
    if (value !== 'custom' && onTimeRangeChange) {
      // Calculate date range based on preset
      const end = new Date();
      const start = new Date();
      if (value === '7days') start.setDate(start.getDate() - 7);
      else if (value === '30days') start.setDate(start.getDate() - 30);
      else if (value === '90days') start.setDate(start.getDate() - 90);
      onTimeRangeChange({ start, end });
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Controls & Filters
        </h3>
      </div>

      {/* Layer Toggles with Subcategories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-gray-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Map Layers</h4>
        </div>
        <div className="space-y-2">
          {/* Crews Layer with Subcategories */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.crews}
                onChange={() => onLayerToggle('crews')}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Crews</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSection('crews');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.crews ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              </div>
            </label>
            {expandedSections.crews && layers.crews && (
              <div className="ml-6 mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                {PLACEHOLDER_CREWS.map((crew) => (
                  <label key={crew.id} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={selectedCrews.includes(crew.id)}
                      onChange={() => toggleCrew(crew.id)}
                      className="w-3 h-3 rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-gray-600">{crew.name} ({crew.members})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Catalysts Layer with Subcategories */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.catalysts}
                onChange={() => onLayerToggle('catalysts')}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Catalysts</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSection('catalysts');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.catalysts ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              </div>
            </label>
            {expandedSections.catalysts && layers.catalysts && (
              <div className="ml-6 mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                {PLACEHOLDER_CATALYSTS.map((catalyst) => (
                  <label key={catalyst.id} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={selectedCatalysts.includes(catalyst.id)}
                      onChange={() => toggleCatalyst(catalyst.id)}
                      className="w-3 h-3 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-600">
                      {catalyst.name}
                      <span
                        className={`ml-1 ${
                          catalyst.status === 'active' ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        •
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Other Layers */}
          {(['conflicts', 'incidents', 'networks'] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => onLayerToggle(key)}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700 capitalize">{key}</span>
              <div
                className={`ml-auto w-2 h-2 rounded-full ${
                  key === 'conflicts' ? 'bg-red-500' :
                  key === 'incidents' ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Time Filter with Calendar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Time Range</h4>
        </div>
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="custom">Custom range</option>
        </select>

        {/* Custom Calendar Range Picker */}
        {timeRange === 'custom' && (
          <div className="mt-3 space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-left hover:bg-gray-50">
                  {dateRange.start ? format(dateRange.start, 'MMM dd, yyyy') : 'Start Date'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.start}
                  onSelect={(date) => {
                    const newRange = { ...dateRange, start: date };
                    setDateRange(newRange);
                    if (onTimeRangeChange) onTimeRangeChange(newRange);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-left hover:bg-gray-50">
                  {dateRange.end ? format(dateRange.end, 'MMM dd, yyyy') : 'End Date'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.end}
                  onSelect={(date) => {
                    const newRange = { ...dateRange, end: date };
                    setDateRange(newRange);
                    if (onTimeRangeChange) onTimeRangeChange(newRange);
                  }}
                  disabled={(date) => (dateRange.start ? date < dateRange.start : false)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Catalyst Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-gray-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Catalyst Status</h4>
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Inactive</span>
          </label>
        </div>
      </div>

      {/* Catalyst Type */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-gray-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Catalyst Type</h4>
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Network</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Stipend</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Volunteer</span>
          </label>
        </div>
      </div>

      {/* Lead Filter */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Lead Name</h4>
        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option>All Leads</option>
          <option>Johnson, Marcus</option>
          <option>Williams, Sarah</option>
          <option>Davis, Jerome</option>
          <option>Martinez, Ana</option>
        </select>
      </div>
    </div>
  );
}
