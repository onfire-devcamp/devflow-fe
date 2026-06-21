import { TabPanel } from '.';

export function SystemFlowTab({
  slug,
  title,
}: {
  slug?: string;
  systemFlowUrl?: string;
  title: string;
}) {
  const systemFlowImg = new URL(
    `../../../../assets/system/${slug || 'twitter-clone'}-system.png`,
    import.meta.url,
  ).href;

  return (
    <TabPanel tabId="system-flow" className="p-4 sm:p-6">
      <img
        src={systemFlowImg}
        alt={`${title} system flow diagram`}
        className="w-full rounded-xl object-contain shadow-sm"
      />
    </TabPanel>
  );
}
