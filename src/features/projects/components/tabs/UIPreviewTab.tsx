import { TabPanel } from '.';

export function UIPreviewTab({
  slug,
  title,
}: {
  slug?: string;
  previewUrl?: string;
  title: string;
}) {
  const uiPreviewImg = new URL(
    `../../../../assets/project/${slug || 'twitter-clone'}-project.png`,
    import.meta.url,
  ).href;

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
