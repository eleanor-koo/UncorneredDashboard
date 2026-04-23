import { BookOpen, CheckSquare, Network, FileText, ArrowRight, UserCircle } from 'lucide-react';

interface NavigationCardsProps {
  onNavigate: (page: 'directory' | 'checkins' | 'influence' | 'logs' | 'leads') => void;
}

export function NavigationCards({ onNavigate }: NavigationCardsProps) {
  const cards = [
    {
      title: 'Catalyst Directory',
      description: 'Browse all catalysts, view profiles, contact info, and status intervals',
      icon: BookOpen,
      stats: '142 total',
      color: 'blue',
      page: 'directory' as const,
    },
    {
      title: 'Lead Directory',
      description: 'Manage leads who upload catalyst updates and oversee crews',
      icon: UserCircle,
      stats: '5 leads',
      color: 'indigo',
      page: 'leads' as const,
    },
    {
      title: 'Weekly Check-ins',
      description: 'Review check-in completion, contact summaries, and trends',
      icon: CheckSquare,
      stats: '89% completion',
      color: 'green',
      page: 'checkins' as const,
    },
    {
      title: 'Influence & Network',
      description: 'Analyze network ratings, relationships, and influence metrics',
      icon: Network,
      stats: '23 high-influence',
      color: 'purple',
      page: 'influence' as const,
    },
    {
      title: 'Catalyst Logs',
      description: 'Track peace vs disruption narratives and activity logs',
      icon: FileText,
      stats: '1,284 entries',
      color: 'orange',
      page: 'logs' as const,
    },
  ];

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
      <div className="grid grid-cols-5 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600',
          }[card.color];

          return (
            <button
              key={card.title}
              onClick={() => onNavigate(card.page)}
              className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-md hover:border-orange-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${colorClasses}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{card.title}</h4>
                </div>
                <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-600 mb-2">{card.description}</p>
              <div className="text-xs font-medium text-gray-500">{card.stats}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
