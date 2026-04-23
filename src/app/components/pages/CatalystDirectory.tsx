import { useState } from 'react';
import { Search, Filter, ArrowLeft, User, Phone, Mail, MapPin, Calendar, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ============================================================================
// 📌 DATA INTEGRATION NOTES - CATALYST DIRECTORY
// ============================================================================
//
// Catalysts have interval-based status tracking:
// - Enrollment Date → Active
// - Active → Inactive (date)
// - Inactive → Active (date) - NEW INTERVAL
//
// Each interval is tracked separately for analytics.
//
// DATA SOURCE: Zoho Creator → Zoho Analytics → Dashboard
//
// Expected Schema:
// {
//   id: number,
//   name: string,
//   status_intervals: [
//     { status: 'active', start_date: '2025-08-15', end_date: '2026-01-10' },
//     { status: 'inactive', start_date: '2026-01-10', end_date: '2026-02-15' },
//     { status: 'active', start_date: '2026-02-15', end_date: null } // current
//   ],
//   current_status: 'active' | 'inactive',
//   ...
// }
//
// INTEGRATION:
// 1. CSV Import: /data/catalysts.csv with intervals
// 2. API Endpoint: GET /api/catalysts with nested intervals
// 3. Zoho Analytics: Use relationship tables (catalysts ← status_intervals)
//
// All data is MODULAR and REPLACEABLE
// ============================================================================

interface StatusInterval {
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string | null; // null = current interval
  durationDays: number;
  checkIns?: number;
}

interface Catalyst {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: string;
  lead: string;
  crew: string;
  phone: string;
  email: string;
  address: string;
  enrolled: string;
  checkIns: number;
  lastContact: string;
  gender: string;
  age: number;
  race: string;
  statusIntervals: StatusInterval[]; // Interval-based tracking
}

interface CatalystDirectoryProps {
  onBack: () => void;
}

export function CatalystDirectory({ onBack }: CatalystDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCatalyst, setSelectedCatalyst] = useState<number | null>(null);

  // ============================================================================
  // 📌 PLACEHOLDER DATA WITH STATUS INTERVALS
  // ============================================================================
  // TODO: Replace with real data from Zoho Creator/Analytics
  // Each catalyst has multiple status intervals showing their activity history
  // ============================================================================
  const catalysts: Catalyst[] = [
    {
      id: 1,
      name: 'Jackson, Terrell',
      status: 'active',
      type: 'Network',
      lead: 'Marcus Johnson',
      crew: 'Dorchester Crew',
      phone: '(617) 555-0142',
      email: 'terrell.j@example.com',
      address: 'Dorchester, Boston',
      enrolled: '2025-08-15',
      checkIns: 34,
      lastContact: '2026-04-20',
      gender: 'Male',
      age: 24,
      race: 'Black',
      statusIntervals: [
        { status: 'active', startDate: '2025-08-15', endDate: null, durationDays: 250, checkIns: 34 },
      ],
    },
    {
      id: 2,
      name: 'Williams, DeAndre',
      status: 'active',
      type: 'Stipend',
      lead: 'Sarah Williams',
      crew: 'Roxbury Collective',
      phone: '(617) 555-0198',
      email: 'deandre.w@example.com',
      address: 'Roxbury, Boston',
      enrolled: '2025-09-22',
      checkIns: 28,
      lastContact: '2026-04-21',
      gender: 'Male',
      age: 22,
      race: 'Black',
      statusIntervals: [
        { status: 'active', startDate: '2025-09-22', endDate: null, durationDays: 212, checkIns: 28 },
      ],
    },
    {
      id: 3,
      name: 'Rodriguez, Maria',
      status: 'active',
      type: 'Network',
      lead: 'Ana Martinez',
      crew: 'Hyde Park Group',
      phone: '(617) 555-0234',
      email: 'maria.r@example.com',
      address: 'Hyde Park, Boston',
      enrolled: '2025-07-10',
      checkIns: 42,
      lastContact: '2026-04-19',
      gender: 'Female',
      age: 28,
      race: 'Hispanic',
      statusIntervals: [
        { status: 'active', startDate: '2025-07-10', endDate: '2025-12-01', durationDays: 144, checkIns: 18 },
        { status: 'inactive', startDate: '2025-12-01', endDate: '2026-01-15', durationDays: 45, checkIns: 0 },
        { status: 'active', startDate: '2026-01-15', endDate: null, durationDays: 97, checkIns: 24 },
      ],
    },
    {
      id: 4,
      name: 'Thompson, Marcus',
      status: 'inactive',
      type: 'Volunteer',
      lead: 'Jerome Davis',
      crew: 'Mattapan Network',
      phone: '(617) 555-0167',
      email: 'marcus.t@example.com',
      address: 'Mattapan, Boston',
      enrolled: '2025-06-05',
      checkIns: 12,
      lastContact: '2026-03-15',
      gender: 'Male',
      age: 31,
      race: 'Black',
      statusIntervals: [
        { status: 'active', startDate: '2025-06-05', endDate: '2025-10-20', durationDays: 137, checkIns: 12 },
        { status: 'inactive', startDate: '2025-10-20', endDate: null, durationDays: 184, checkIns: 0 },
      ],
    },
    {
      id: 5,
      name: 'Chen, Wei',
      status: 'active',
      type: 'Network',
      lead: 'Marcus Johnson',
      crew: 'Dorchester Crew',
      phone: '(617) 555-0289',
      email: 'wei.c@example.com',
      address: 'Dorchester, Boston',
      enrolled: '2025-10-01',
      checkIns: 19,
      lastContact: '2026-04-22',
      gender: 'Male',
      age: 26,
      race: 'Asian',
      statusIntervals: [
        { status: 'active', startDate: '2025-10-01', endDate: '2026-02-01', durationDays: 123, checkIns: 15 },
        { status: 'inactive', startDate: '2026-02-01', endDate: '2026-03-10', durationDays: 37, checkIns: 0 },
        { status: 'active', startDate: '2026-03-10', endDate: null, durationDays: 43, checkIns: 4 },
      ],
    },
  ];

  const filteredCatalysts = catalysts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: catalysts.length,
    active: catalysts.filter((c) => c.status === 'active').length,
    inactive: catalysts.filter((c) => c.status === 'inactive').length,
  };

  const selected = selectedCatalyst ? catalysts.find((c) => c.id === selectedCatalyst) : null;

  // Prepare interval visualization data
  const getIntervalChartData = (intervals: StatusInterval[]) => {
    return intervals.map((interval, idx) => ({
      name: `${interval.status === 'active' ? 'Active' : 'Inactive'} ${idx + 1}`,
      days: interval.durationDays,
      checkIns: interval.checkIns || 0,
      status: interval.status,
      startDate: new Date(interval.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      endDate: interval.endDate
        ? new Date(interval.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Current',
    }));
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Catalyst Directory</h1>
            <p className="text-sm text-gray-600 mt-1">Browse all catalysts, view profiles, and contact information</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
              <div className="text-xs text-gray-500">Inactive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-2/5 border-r border-gray-200 overflow-y-auto">
          {filteredCatalysts.map((catalyst) => (
            <button
              key={catalyst.id}
              onClick={() => setSelectedCatalyst(catalyst.id)}
              className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                selectedCatalyst === catalyst.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900">{catalyst.name}</div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    catalyst.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {catalyst.status}
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{catalyst.crew}</div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium text-orange-600">{catalyst.type}</span>
                  <span>Lead: {catalyst.lead}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail View */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-orange-100 rounded-full">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selected.name}</h2>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selected.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selected.status}
                    </span>
                    <span className="text-sm text-gray-600">{selected.type} Catalyst</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selected.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selected.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selected.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Program Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500 text-xs">Enrolled</div>
                        <div className="text-gray-900">{new Date(selected.enrolled).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500 text-xs">Lead</div>
                        <div className="text-gray-900">{selected.lead}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500 text-xs">Crew</div>
                        <div className="text-gray-900">{selected.crew}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Demographics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">Gender</div>
                    <div className="text-lg font-semibold text-gray-900">{selected.gender}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">Age</div>
                    <div className="text-lg font-semibold text-gray-900">{selected.age}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">Race/Ethnicity</div>
                    <div className="text-lg font-semibold text-gray-900">{selected.race}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded p-4">
                    <div className="text-3xl font-bold text-blue-900 mb-1">{selected.checkIns}</div>
                    <div className="text-sm text-blue-700">Total Check-ins</div>
                  </div>
                  <div className="bg-green-50 rounded p-4">
                    <div className="text-sm text-green-700 mb-1">Last Contact</div>
                    <div className="font-semibold text-green-900">
                      {new Date(selected.lastContact).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Intervals - Timeline & Visualizations */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-gray-700" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Status History (Intervals)</h3>
                </div>

                {/* Timeline */}
                <div className="space-y-3 mb-6">
                  {selected.statusIntervals.map((interval, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          interval.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <div className="flex-1 bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-semibold ${
                              interval.status === 'active' ? 'text-green-700' : 'text-gray-700'
                            }`}
                          >
                            {interval.status === 'active' ? 'Active' : 'Inactive'} Period {idx + 1}
                          </span>
                          {interval.endDate === null && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Current</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            {new Date(interval.startDate).toLocaleDateString()}
                            {' → '}
                            {interval.endDate ? new Date(interval.endDate).toLocaleDateString() : 'Present'}
                          </div>
                          <div className="flex gap-4">
                            <span>{interval.durationDays} days</span>
                            {interval.checkIns !== undefined && (
                              <span>{interval.checkIns} check-ins</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interval Visualizations */}
                <div className="bg-gray-50 rounded p-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Interval Duration (Days)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={getIntervalChartData(selected.statusIntervals)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border border-gray-200 rounded shadow-lg p-2 text-xs">
                                <div className="font-semibold">{data.name}</div>
                                <div className="text-gray-600">{data.startDate} → {data.endDate}</div>
                                <div className="mt-1">{data.days} days</div>
                                <div>{data.checkIns} check-ins</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="days" radius={[8, 8, 0, 0]}>
                        {getIntervalChartData(selected.statusIntervals).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.status === 'active' ? '#10b981' : '#9ca3af'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-blue-50 rounded p-4 mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Check-ins per Interval</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={getIntervalChartData(selected.statusIntervals)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="checkIns" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a catalyst to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}