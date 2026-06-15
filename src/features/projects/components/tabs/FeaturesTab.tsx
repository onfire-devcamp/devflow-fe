import { Layers } from 'lucide-react';
import { TabPanel, EmptyPanel } from '.';

interface FeatureItem {
  title: string;
  description: string;
}

export function FeaturesTab({ features }: { features: FeatureItem[] }) {
  return (
    <TabPanel tabId="features" className="p-6 sm:p-8">
      {features.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          aria-label="Project features"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 border border-slate-200 rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="p-2 bg-pink-50 rounded-lg text-pink-500 shrink-0">
                <Layers className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPanel message="Features list coming soon." />
      )}
    </TabPanel>
  );
}
