import { MapPin } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const cities = ['Boston', 'Kansas City', 'Providence'];

export function Header({ selectedCity, onCityChange }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Uncornered.live</h1>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent border-none text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Live Intelligence Environment
        </div>
      </div>
    </div>
  );
}
