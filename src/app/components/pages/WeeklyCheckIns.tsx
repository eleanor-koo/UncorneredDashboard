import { ArrowLeft, TrendingUp, Calendar, CheckCircle, XCircle, Phone, MessageSquare } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyCheckInsProps {
  onBack: () => void;
}

export function WeeklyCheckIns({ onBack }: WeeklyCheckInsProps) {
  const completionData = [
    { week: 'Week 1', completed: 85, missed: 15 },
    { week: 'Week 2', completed: 92, missed: 8 },
    { week: 'Week 3', completed: 88, missed: 12 },
    { week: 'Week 4', completed: 89, missed: 11 },
  ];

  const trendData = [
    { month: 'Jan', rate: 82 },
    { month: 'Feb', rate: 85 },
    { month: 'Mar', rate: 88 },
    { month: 'Apr', rate: 89 },
  ];

  const recentCheckIns = [
    {
      catalyst: 'Jackson, Terrell',
      date: '2026-04-22',
      status: 'completed',
      method: 'In-person',
      duration: 45,
      notes: 'Positive engagement, attending job training program',
      problemSolving: 'Yes',
      clinician: 'No',
      firearms: 'No',
      conflicts: 'No',
    },
    {
      catalyst: 'Williams, DeAndre',
      date: '2026-04-21',
      status: 'completed',
      method: 'Phone',
      duration: 30,
      notes: 'Brief check-in, working full-time',
      problemSolving: 'No',
      clinician: 'No',
      firearms: 'No',
      conflicts: 'No',
    },
    {
      catalyst: 'Rodriguez, Maria',
      date: '2026-04-21',
      status: 'completed',
      method: 'In-person',
      duration: 60,
      notes: 'Extended session, discussing family support needs',
      problemSolving: 'Yes',
      clinician: 'Yes',
      firearms: 'No',
      conflicts: 'No',
    },
    {
      catalyst: 'Chen, Wei',
      date: '2026-04-20',
      status: 'completed',
      method: 'Text',
      duration: 15,
      notes: 'Quick check-in, stable situation',
      problemSolving: 'No',
      clinician: 'No',
      firearms: 'No',
      conflicts: 'No',
    },
    {
      catalyst: 'Thompson, Marcus',
      date: '2026-04-18',
      status: 'missed',
      method: 'N/A',
      duration: 0,
      notes: 'No response to outreach attempts',
      problemSolving: 'N/A',
      clinician: 'N/A',
      firearms: 'N/A',
      conflicts: 'N/A',
    },
  ];

  const methodBreakdown = [
    { method: 'In-person', count: 45, percentage: 45 },
    { method: 'Phone', count: 32, percentage: 32 },
    { method: 'Text', count: 18, percentage: 18 },
    { method: 'Video', count: 5, percentage: 5 },
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
            <h1 className="text-2xl font-bold text-gray-900">Weekly Check-ins</h1>
            <p className="text-sm text-gray-600 mt-1">Track check-in completion, contact methods, and trends</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">126</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">16</div>
              <div className="text-xs text-gray-500">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Completion Rate</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="missed" fill="#ef4444" name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Completion Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2} name="Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contact Method Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Method Breakdown</h3>
          <div className="grid grid-cols-4 gap-4">
            {methodBreakdown.map((method) => (
              <div key={method.method} className="bg-gray-50 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{method.method}</span>
                  {method.method === 'In-person' && <Phone className="h-4 w-4 text-orange-500" />}
                  {method.method === 'Phone' && <Phone className="h-4 w-4 text-blue-500" />}
                  {method.method === 'Text' && <MessageSquare className="h-4 w-4 text-green-500" />}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{method.count}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{method.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Check-ins Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Recent Check-ins</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Catalyst</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Problem Solving</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Clinician</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentCheckIns.map((checkIn, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{checkIn.catalyst}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(checkIn.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {checkIn.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          <XCircle className="h-3 w-3" />
                          Missed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{checkIn.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{checkIn.duration}m</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{checkIn.problemSolving}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{checkIn.clinician}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{checkIn.notes}</td>
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
