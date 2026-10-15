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
    <div className="flex items-center space-x-1 border-b border-zinc-200 w-full overflow-x-auto scrollbar-none pb-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`inline-flex items-center pb-2.5 px-3 text-sm font-medium border-b-2 transition-colors -mb-px cursor-pointer ${
              isActive
                ? 'border-zinc-900 text-zinc-950 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
            }`}
          >
            {tab}
            {counts && counts[tab] !== undefined && (
              <span
                className={`ml-2 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600'
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
