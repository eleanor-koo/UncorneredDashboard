import { useState } from 'react';
import { Search, Filter, ArrowLeft, User, Phone, Mail, MapPin, Users, Calendar } from 'lucide-react';

// ============================================================================
// 📌 DATA INTEGRATION NOTES - LEAD DIRECTORY
// ============================================================================
//
// Leads are responsible for uploading catalyst updates to the system.
// They manage multiple crews and catalysts.
//
// DATA SOURCE: Zoho Creator → Zoho Analytics → Dashboard
//
// Expected Schema:
// {
//   id: number,
//   name: string,
//   phone: string,
//   email: string,
//   assigned_crews: string[],
//   total_catalysts: number,
//   active_catalysts: number,
//   city: string,
//   hire_date: string,
//   status: 'active' | 'inactive'
// }
//
// INTEGRATION:
// 1. CSV Import: /data/leads.csv
// 2. API Endpoint: GET /api/leads
// 3. Zoho Analytics: Direct connection via Zoho API
//
// All data is MODULAR and REPLACEABLE
// ============================================================================

interface LeadDirectoryProps {
  onBack: () => void;
}

export function LeadDirectory({ onBack }: LeadDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  // ============================================================================
  // 📌 PLACEHOLDER DATA - REPLACE WITH REAL DATA FROM ZOHO
  // ============================================================================
  const leads = [
    {
      id: 1,
      name: 'Johnson, Marcus',
      phone: '(617) 555-0100',
      email: 'marcus.j@example.com',
      city: 'Boston',
      address: 'Dorchester, Boston',
      hireDate: '2024-03-15',
      status: 'active' as const,
      assignedCrews: ['Dorchester Crew', 'Roxbury Collective'],
      totalCatalysts: 41,
      activeCatalysts: 38,
      weeklyUploads: 89,
    },
    {
      id: 2,
      name: 'Williams, Sarah',
      phone: '(617) 555-0101',
      email: 'sarah.w@example.com',
      city: 'Boston',
      address: 'Roxbury, Boston',
      hireDate: '2024-05-22',
      status: 'active' as const,
      assignedCrews: ['Hyde Park Group'],
      totalCatalysts: 28,
      activeCatalysts: 26,
      weeklyUploads: 92,
    },
    {
      id: 3,
      name: 'Davis, Jerome',
      phone: '(617) 555-0102',
      email: 'jerome.d@example.com',
      city: 'Boston',
      address: 'Mattapan, Boston',
      hireDate: '2024-02-10',
      status: 'active' as const,
      assignedCrews: ['Mattapan Network'],
      totalCatalysts: 19,
      activeCatalysts: 17,
      weeklyUploads: 85,
    },
    {
      id: 4,
      name: 'Martinez, Ana',
      phone: '(913) 555-0200',
      email: 'ana.m@example.com',
      city: 'Kansas City',
      address: 'Kansas City, MO',
      hireDate: '2024-06-01',
      status: 'active' as const,
      assignedCrews: ['East Side Collective', 'Westport Group'],
      totalCatalysts: 33,
      activeCatalysts: 30,
      weeklyUploads: 91,
    },
    {
      id: 5,
      name: 'Thompson, Lisa',
      phone: '(401) 555-0300',
      email: 'lisa.t@example.com',
      city: 'Providence',
      address: 'Providence, RI',
      hireDate: '2024-04-18',
      status: 'active' as const,
      assignedCrews: ['South Providence Crew', 'Olneyville Network'],
      totalCatalysts: 24,
      activeCatalysts: 22,
      weeklyUploads: 87,
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || lead.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const stats = {
    total: leads.length,
    active: leads.filter((l) => l.status === 'active').length,
    cities: new Set(leads.map((l) => l.city)).size,
  };

  const selected = selectedLead ? leads.find((l) => l.id === selectedLead) : null;

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
            <h1 className="text-2xl font-bold text-gray-900">Lead Directory</h1>
            <p className="text-sm text-gray-600 mt-1">Leads manage crews and upload catalyst updates</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.cities}</div>
              <div className="text-xs text-gray-500">Cities</div>
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
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Cities</option>
            <option value="Boston">Boston</option>
            <option value="Kansas City">Kansas City</option>
            <option value="Providence">Providence</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-2/5 border-r border-gray-200 overflow-y-auto">
          {filteredLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead.id)}
              className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                selectedLead === lead.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900">{lead.name}</div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    lead.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {lead.status}
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="font-medium text-orange-600">{lead.city}</div>
                <div className="flex items-center gap-3 text-xs">
                  <span>{lead.assignedCrews.length} crews</span>
                  <span>•</span>
                  <span>{lead.activeCatalysts}/{lead.totalCatalysts} active</span>
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
                    <span className="text-sm text-gray-600">{selected.city}</span>
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
                        <div className="text-gray-500 text-xs">Hire Date</div>
                        <div className="text-gray-900">{new Date(selected.hireDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-500 text-xs">Assigned Crews</div>
                        <div className="text-gray-900">{selected.assignedCrews.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Assigned Crews</h3>
                <div className="space-y-2">
                  {selected.assignedCrews.map((crew, idx) => (
                    <div key={idx} className="bg-purple-50 rounded p-3 flex items-center justify-between">
                      <span className="font-medium text-purple-900">{crew}</span>
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded p-4">
                    <div className="text-3xl font-bold text-blue-900 mb-1">{selected.totalCatalysts}</div>
                    <div className="text-sm text-blue-700">Total Catalysts</div>
                  </div>
                  <div className="bg-green-50 rounded p-4">
                    <div className="text-3xl font-bold text-green-900 mb-1">{selected.activeCatalysts}</div>
                    <div className="text-sm text-green-700">Active Catalysts</div>
                  </div>
                  <div className="bg-orange-50 rounded p-4">
                    <div className="text-3xl font-bold text-orange-900 mb-1">{selected.weeklyUploads}%</div>
                    <div className="text-sm text-orange-700">Weekly Upload Rate</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a lead to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
