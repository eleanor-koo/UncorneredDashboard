import { TrendingUp, AlertTriangle, Users, Activity } from 'lucide-react';

export function InsightsPanel() {
  const topCrews = [
    { name: 'Dorchester Crew', activity: 34, risk: 'high' },
    { name: 'Roxbury Collective', activity: 28, risk: 'medium' },
    { name: 'Mattapan Network', activity: 19, risk: 'high' },
    { name: 'Hyde Park Group', activity: 15, risk: 'low' },
  ];

  const highRiskAreas = [
    { area: 'Grove Hall', incidents: 12 },
    { area: 'Blue Hill Ave', incidents: 9 },
    { area: 'Talbot Ave', incidents: 7 },
    { area: 'Warren St', incidents: 5 },
  ];

  const topLeads = [
    { name: 'Marcus Johnson', catalysts: 23, checkIns: 89 },
    { name: 'Sarah Williams', catalysts: 18, checkIns: 76 },
    { name: 'Jerome Davis', catalysts: 15, checkIns: 68 },
  ];

  const recentAlerts = [
    { type: 'spike', message: 'Conflict activity +40% in Dorchester', time: '2h ago' },
    { type: 'change', message: '3 catalysts marked inactive', time: '5h ago' },
    { type: 'positive', message: 'Check-in completion rate: 92%', time: '1d ago' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Live Insights
        </h3>
      </div>

      {/* Top Active Crews */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-gray-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Top Active Crews</h4>
        </div>
        <div className="space-y-2">
          {topCrews.map((crew) => (
            <div key={crew.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{crew.name}</div>
                <div className="text-xs text-gray-500">{crew.activity} activities</div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  crew.risk === 'high'
                    ? 'bg-red-100 text-red-700'
                    : crew.risk === 'medium'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {crew.risk}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highest Risk Areas */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Highest Risk Areas</h4>
        </div>
        <div className="space-y-2">
          {highRiskAreas.map((area) => (
            <div key={area.area} className="flex items-center justify-between">
              <span className="text-sm text-gray-900">{area.area}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${(area.incidents / 12) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 w-6 text-right">{area.incidents}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads with Most Activity */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase">Most Active Leads</h4>
        </div>
        <div className="space-y-2">
          {topLeads.map((lead) => (
            <div key={lead.name} className="p-2 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
              <div className="flex gap-3 mt-1 text-xs text-gray-600">
                <span>{lead.catalysts} catalysts</span>
                <span>{lead.checkIns} check-ins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Recent Changes</h4>
        <div className="space-y-3">
          {recentAlerts.map((alert, idx) => (
            <div key={idx} className="flex gap-2">
              <div
                className={`w-1.5 rounded-full ${
                  alert.type === 'spike'
                    ? 'bg-red-500'
                    : alert.type === 'change'
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
              />
              <div className="flex-1">
                <div className="text-sm text-gray-900">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-0.5">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}