import { TabPanel } from '.';
import uiPreviewImg from '../../../../assets/twitter-project.png';

export function UIPreviewTab({
  title,
}: {
  previewUrl?: string;
  title: string;
}) {
  return (
    <TabPanel tabId="ui-preview" className="p-4 sm:p-6">
      <img
        src={uiPreviewImg}
        alt={`${title} UI preview`}
        className="w-full rounded-xl shadow-sm object-cover"
      />
    </TabPanel>
  );
}
