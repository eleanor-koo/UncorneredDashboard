import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  city: string;
}

const cityData: Record<string, any> = {
  'Boston': {
    stats: {
      total: 142,
      active: 98,
      inactive: 44,
      recentActivity: 23,
    },
    demographics: {
      gender: { male: 96, female: 42, other: 4 },
      age: { '18-24': 45, '25-34': 52, '35-44': 31, '45+': 14 },
      race: { black: 78, hispanic: 42, white: 15, other: 7 },
    },
  },
  'Kansas City': {
    stats: {
      total: 89,
      active: 67,
      inactive: 22,
      recentActivity: 15,
    },
    demographics: {
      gender: { male: 62, female: 24, other: 3 },
      age: { '18-24': 28, '25-34': 35, '35-44': 19, '45+': 7 },
      race: { black: 52, hispanic: 21, white: 12, other: 4 },
    },
  },
  'Providence': {
    stats: {
      total: 67,
      active: 51,
      inactive: 16,
      recentActivity: 11,
    },
    demographics: {
      gender: { male: 45, female: 19, other: 3 },
      age: { '18-24': 21, '25-34': 26, '35-44': 14, '45+': 6 },
      race: { black: 31, hispanic: 24, white: 9, other: 3 },
    },
  },
};

export function StatsOverview({ city }: StatsOverviewProps) {
  const data = cityData[city];
  const stats = data.stats;
  const demographics = data.demographics;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-600 uppercase">{city} At-A-Glance</h2>

        <div className="flex items-center gap-6">
          {/* Main Stats - Compact */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            <div className="text-lg font-bold text-gray-900">{stats.active}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <div className="text-lg font-bold text-gray-900">{stats.inactive}</div>
            <div className="text-xs text-gray-500">Inactive</div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div className="text-lg font-bold text-gray-900">{stats.recentActivity}</div>
            <div className="text-xs text-gray-500">7d Activity</div>
          </div>

          {/* Demographics - Ultra Compact */}
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Gender:</span>
              <span className="text-xs font-semibold text-gray-900">{demographics.gender.male}M</span>
              <span className="text-xs font-semibold text-gray-900">{demographics.gender.female}F</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Age:</span>
              {Object.entries(demographics.age).map(([range, count]) => (
                <span key={range} className="text-xs text-gray-700">
                  {range.replace('-', '-')}:{count}
                </span>
              )).reduce((prev: any, curr) => [prev, ' | ', curr])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
