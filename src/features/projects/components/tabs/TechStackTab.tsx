import { useMemo } from 'react';
import { TabPanel, EmptyPanel } from '.';

interface TechItem {
  name: string;
  iconUrl: string;
  category: string;
}

interface TechStackTabProps {
  techStack: TechItem[];
  isLoading?: boolean;
}

export function TechStackTab({
  techStack,
  isLoading = false,
}: TechStackTabProps) {
  const groupedTech = useMemo(() => {
    return techStack.reduce(
      (acc, tech) => {
        const category = tech.category || 'OTHER';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(tech);
        return acc;
      },
      {} as Record<string, TechItem[]>,
    );
  }, [techStack]);

  if (isLoading) {
    return (
      <TabPanel tabId="tech-stack" className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((skeletonIdx) => (
            <div
              key={`skeleton-category-${skeletonIdx}`}
              className="border border-slate-200 rounded-xl p-5 bg-white animate-pulse"
            >
              <div className="h-3 bg-slate-200 rounded w-1/3 mb-5"></div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((itemIdx) => (
                  <div
                    key={`skeleton-item-${itemIdx}`}
                    className="h-8 w-24 bg-slate-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TabPanel>
    );
  }
  return (
    <TabPanel tabId="tech-stack" className="p-6 sm:p-8">
      {techStack.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedTech).map(([category, items]) => (
            <div
              key={category}
              className="border border-slate-200 rounded-xl p-5 bg-white"
            >
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-50 border border-slate-200 text-slate-800 shadow-sm"
                  >
                    {tech.iconUrl && (
                      <img
                        src={tech.iconUrl}
                        alt={tech.name}
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPanel message="Tech stack details coming soon." />
      )}
    </TabPanel>
  );
}
