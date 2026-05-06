import { MapPin } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const cities = ['Boston', 'Kansas City', 'Providence'];

export function Header({ selectedCity, onCityChange }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-2.5">
      <div className="flex items-center justify-between">
        
        {/* Left side */}
        <div className="flex items-center gap-3">
          
          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-900">
            Uncornered.live
          </h1>

          <div className="h-4 w-px bg-gray-300" />

          {/* City selector */}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-orange-500" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-1.5 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side */}
        <div className="text-xs text-gray-500">
          Live Intelligence
        </div>
      </div>
    </div>
  );
}
