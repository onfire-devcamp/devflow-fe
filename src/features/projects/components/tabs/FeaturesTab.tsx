import { CheckCircle } from 'lucide-react';
import { TabPanel, EmptyPanel } from '.';

export function FeaturesTab({ features }: { features: string[] }) {
  return (
    <TabPanel tabId="features" className="p-6 sm:p-8">
      {features.length > 0 ? (
        <ul className="space-y-3" aria-label="Project features">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 text-success shrink-0 mt-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-sm text-fg leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyPanel message="Features list coming soon." />
      )}
    </TabPanel>
  );
}
