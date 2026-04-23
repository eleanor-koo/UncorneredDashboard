import { ArrowLeft, Users, TrendingUp, Network as NetworkIcon } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InfluenceNetworkProps {
  onBack: () => void;
}

export function InfluenceNetwork({ onBack }: InfluenceNetworkProps) {
  const influenceData = [
    { name: 'Jackson, Terrell', influence: 8, network: 9, crew: 'Dorchester Crew', connections: 23 },
    { name: 'Williams, DeAndre', influence: 7, network: 8, crew: 'Roxbury Collective', connections: 18 },
    { name: 'Rodriguez, Maria', influence: 9, network: 7, crew: 'Hyde Park Group', connections: 21 },
    { name: 'Chen, Wei', influence: 6, network: 6, crew: 'Dorchester Crew', connections: 15 },
    { name: 'Brown, Isaiah', influence: 8, network: 9, crew: 'Mattapan Network', connections: 25 },
    { name: 'Garcia, Luis', influence: 7, network: 7, crew: 'Roxbury Collective', connections: 19 },
    { name: 'Johnson, Malik', influence: 9, network: 8, crew: 'Dorchester Crew', connections: 22 },
    { name: 'Davis, Jamal', influence: 5, network: 5, crew: 'Hyde Park Group', connections: 12 },
    { name: 'Lee, Kevin', influence: 6, network: 7, crew: 'Mattapan Network', connections: 16 },
    { name: 'Martinez, Carlos', influence: 8, network: 8, crew: 'Roxbury Collective', connections: 20 },
  ];

  const topInfluencers = influenceData
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 5);

  const networkHubs = influenceData
    .sort((a, b) => b.network - a.network)
    .slice(0, 5);

  const crewConnections = [
    { crew: 'Dorchester Crew', internal: 45, external: 23, total: 68 },
    { crew: 'Roxbury Collective', internal: 38, external: 19, total: 57 },
    { crew: 'Mattapan Network', internal: 32, external: 15, total: 47 },
    { crew: 'Hyde Park Group', internal: 28, external: 12, total: 40 },
  ];

  const relationshipTypes = [
    { type: 'Family', count: 89, percentage: 35 },
    { type: 'Crew Member', count: 67, percentage: 26 },
    { type: 'Friend', count: 54, percentage: 21 },
    { type: 'Mentor', count: 32, percentage: 13 },
    { type: 'Other', count: 13, percentage: 5 },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Influence & Network Analysis</h1>
            <p className="text-sm text-gray-600 mt-1">Explore catalyst connections and influence metrics</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">255</div>
              <div className="text-xs text-gray-500">Total Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7.2</div>
              <div className="text-xs text-gray-500">Avg Influence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7.4</div>
              <div className="text-xs text-gray-500">Avg Network</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Influence vs Network Scatter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Influence vs Network Rating</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="influence" name="Influence" domain={[0, 10]} label={{ value: 'Influence Rating', position: 'insideBottom', offset: -5 }} />
              <YAxis type="number" dataKey="network" name="Network" domain={[0, 10]} label={{ value: 'Network Rating', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded shadow-lg p-3">
                      <div className="font-semibold text-gray-900 mb-1">{data.name}</div>
                      <div className="text-sm text-gray-600">Crew: {data.crew}</div>
                      <div className="text-sm text-gray-600">Influence: {data.influence}</div>
                      <div className="text-sm text-gray-600">Network: {data.network}</div>
                      <div className="text-sm text-gray-600">Connections: {data.connections}</div>
                    </div>
                  );
                }
                return null;
              }} />
              <Scatter name="Catalysts" data={influenceData} fill="#f97316">
                {influenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.crew === 'Dorchester Crew' ? '#9333ea' :
                    entry.crew === 'Roxbury Collective' ? '#3b82f6' :
                    entry.crew === 'Mattapan Network' ? '#10b981' :
                    '#f97316'
                  } />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Top Lists */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Top Influencers</h3>
            </div>
            <div className="space-y-3">
              {topInfluencers.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-xs text-gray-600">{person.crew}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">{person.influence}</div>
                    <div className="text-xs text-gray-500">Influence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <NetworkIcon className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Network Hubs</h3>
            </div>
            <div className="space-y-3">
              {networkHubs.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-xs text-gray-600">{person.connections} connections</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{person.network}</div>
                    <div className="text-xs text-gray-500">Network</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crew Connections */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900">Crew Network Analysis</h3>
          </div>
          <div className="space-y-3">
            {crewConnections.map((crew) => (
              <div key={crew.crew} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{crew.crew}</h4>
                  <div className="text-lg font-bold text-gray-900">{crew.total} total</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Internal Connections</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(crew.internal / crew.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{crew.internal}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">External Connections</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(crew.external / crew.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{crew.external}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationship Types */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Relationship Type Distribution</h3>
          <div className="space-y-3">
            {relationshipTypes.map((rel) => (
              <div key={rel.type} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">{rel.type}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${rel.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-gray-900">{rel.count}</span>
                  <span className="text-xs text-gray-500 ml-1">({rel.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
