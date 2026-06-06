import { TabPanel, EmptyPanel } from '.';

export function UIPreviewTab({
  previewUrl,
  title,
}: {
  previewUrl?: string;
  title: string;
}) {
  return (
    <TabPanel tabId="ui-preview" className="p-4 sm:p-6">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`${title} UI preview`}
          className="w-full rounded-xl shadow-sm object-cover"
        />
      ) : (
        <EmptyPanel message="No preview available yet." />
      )}
    </TabPanel>
  );
}
