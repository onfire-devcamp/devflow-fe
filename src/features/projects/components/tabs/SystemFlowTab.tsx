import { TabPanel, EmptyPanel } from '.';

export function SystemFlowTab({
  systemFlowUrl,
  title,
}: {
  systemFlowUrl?: string;
  title: string;
}) {
  return (
    <TabPanel tabId="system-flow" className="p-4 sm:p-6">
      {systemFlowUrl ? (
        <img
          src={systemFlowUrl}
          alt={`${title} system flow diagram`}
          className="w-full rounded-xl object-contain shadow-sm"
        />
      ) : (
        <EmptyPanel message="System flow diagram coming soon." />
      )}
    </TabPanel>
  );
}
