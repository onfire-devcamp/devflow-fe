import { TabPanel } from '.';
import systemFlowImg from '../../../../assets/twitter-system.png';

export function SystemFlowTab({
  title,
}: {
  systemFlowUrl?: string;
  title: string;
}) {
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
