import { useState } from 'react';
import { ArrowLeft, FileText, TrendingUp, TrendingDown, Filter, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface CatalystLogsProps {
  onBack: () => void;
}

export function CatalystLogs({ onBack }: CatalystLogsProps) {
  const [narrativeFilter, setNarrativeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('30days');

  const narrativeData = [
    { name: 'Peace', value: 782, color: '#10b981' },
    { name: 'Disruption', value: 218, color: '#ef4444' },
  ];

  const weeklyNarratives = [
    { week: 'W1', peace: 185, disruption: 52 },
    { week: 'W2', peace: 192, disruption: 48 },
    { week: 'W3', peace: 198, disruption: 55 },
    { week: 'W4', peace: 207, disruption: 63 },
  ];

  const logs = [
    {
      id: 1,
      catalyst: 'Jackson, Terrell',
      date: '2026-04-22',
      time: '14:30',
      narrative: 'peace',
      category: 'Community Engagement',
      description: 'Organized youth basketball tournament, brought together 30+ community members',
      lead: 'Marcus Johnson',
      crew: 'Dorchester Crew',
      impact: 'High',
    },
    {
      id: 2,
      catalyst: 'Williams, DeAndre',
      date: '2026-04-21',
      time: '16:45',
      narrative: 'peace',
      category: 'Conflict Mediation',
      description: 'Successfully mediated dispute between two individuals, prevented escalation',
      lead: 'Sarah Williams',
      crew: 'Roxbury Collective',
      impact: 'Medium',
    },
    {
      id: 3,
      catalyst: 'Rodriguez, Maria',
      date: '2026-04-21',
      time: '11:20',
      narrative: 'peace',
      category: 'Mentorship',
      description: 'Connected youth to job training program, providing ongoing support',
      lead: 'Ana Martinez',
      crew: 'Hyde Park Group',
      impact: 'High',
    },
    {
      id: 4,
      catalyst: 'Brown, Isaiah',
      date: '2026-04-20',
      time: '19:15',
      narrative: 'disruption',
      category: 'Conflict',
      description: 'Involved in verbal altercation, de-escalated by another catalyst',
      lead: 'Jerome Davis',
      crew: 'Mattapan Network',
      impact: 'Low',
    },
    {
      id: 5,
      catalyst: 'Chen, Wei',
      date: '2026-04-20',
      time: '13:00',
      narrative: 'peace',
      category: 'Community Support',
      description: 'Delivered food assistance to 5 families in need',
      lead: 'Marcus Johnson',
      crew: 'Dorchester Crew',
      impact: 'Medium',
    },
    {
      id: 6,
      catalyst: 'Garcia, Luis',
      date: '2026-04-19',
      time: '22:30',
      narrative: 'disruption',
      category: 'Risk Behavior',
      description: 'Reported association with high-risk individuals, outreach scheduled',
      lead: 'Sarah Williams',
      crew: 'Roxbury Collective',
      impact: 'Medium',
    },
  ];

  const categoryBreakdown = [
    { category: 'Community Engagement', count: 245 },
    { category: 'Conflict Mediation', count: 198 },
    { category: 'Mentorship', count: 167 },
    { category: 'Community Support', count: 142 },
    { category: 'Conflict', count: 89 },
    { category: 'Risk Behavior', count: 78 },
  ];

  const filteredLogs = logs.filter((log) => {
    if (narrativeFilter === 'all') return true;
    return log.narrative === narrativeFilter;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catalyst Logs</h1>
            <p className="text-sm text-gray-600 mt-1">Track peace vs disruption narratives and activity logs</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1,000</div>
              <div className="text-xs text-gray-500">Total Logs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">78.2%</div>
              <div className="text-xs text-gray-500">Peace</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">21.8%</div>
              <div className="text-xs text-gray-500">Disruption</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Narrative:</label>
          <select
            value={narrativeFilter}
            onChange={(e) => setNarrativeFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="all">All</option>
            <option value="peace">Peace</option>
            <option value="disruption">Disruption</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Time:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Peace vs Disruption</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={narrativeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {narrativeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {narrativeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Narrative Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyNarratives}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="peace" fill="#10b981" name="Peace" />
                <Bar dataKey="disruption" fill="#ef4444" name="Disruption" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity by Category</h3>
          <div className="grid grid-cols-3 gap-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                <span className="text-lg font-bold text-gray-900">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Recent Activity Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Catalyst</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Narrative</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Impact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{new Date(log.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{log.time}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div>{log.catalyst}</div>
                      <div className="text-xs text-gray-500">{log.crew}</div>
                    </td>
                    <td className="px-4 py-3">
                      {log.narrative === 'peace' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          <TrendingUp className="h-3 w-3" />
                          Peace
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          <TrendingDown className="h-3 w-3" />
                          Disruption
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{log.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.impact === 'High'
                            ? 'bg-orange-100 text-orange-700'
                            : log.impact === 'Medium'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {log.impact}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.lead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
