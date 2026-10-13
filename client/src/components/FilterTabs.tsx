import React from 'react';

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: Record<string, number>;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  counts
}) => {
  return (
    <div className="flex items-center space-x-1 border-b border-slate-200 w-full overflow-x-auto scrollbar-none pb-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`inline-flex items-center pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors -mb-px cursor-pointer ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab}
            {counts && counts[tab] !== undefined && (
              <span
                className={`ml-2 px-1.5 py-0.2 rounded-full text-xs ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
