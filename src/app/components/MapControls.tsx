import { useState } from 'react';
import { Filter, Calendar, User, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
 
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
 
export function MapControls({ layers, onLayerToggle, onTimeRangeChange }: MapControlsProps) {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'custom'>('30days');
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
 
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as typeof timeRange);
    if (value !== 'custom' && onTimeRangeChange) {
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
 
      {/* Time Filter */}
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
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-orange-600"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-orange-600"
            />
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
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-orange-600"
            />
            <span className="text-sm text-gray-700">Network</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-orange-600"
            />
            <span className="text-sm text-gray-700">Stipend</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-orange-600"
            />
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