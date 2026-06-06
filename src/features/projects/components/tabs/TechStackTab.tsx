import { TabPanel, EmptyPanel } from '.';

export function TechStackTab({ techStack }: { techStack: string[] }) {
  return (
    <TabPanel tabId="tech-stack" className="p-6 sm:p-8">
      {techStack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-slate-200 text-fg shadow-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        <EmptyPanel message="Tech stack details coming soon." />
      )}
    </TabPanel>
  );
}
