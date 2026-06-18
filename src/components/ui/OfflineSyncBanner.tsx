import { useOfflineSyncStore } from '../../stores/offlineSyncStore';
import { useToastStore } from '../../stores/toastStore';

export function OfflineSyncBanner() {
  const pendingRequests = useOfflineSyncStore((state) => state.pendingRequests);
  const isSyncing = useOfflineSyncStore((state) => state.isSyncing);
  const setSyncing = useOfflineSyncStore((state) => state.setSyncing);
  const removePendingRequest = useOfflineSyncStore(
    (state) => state.removePendingRequest,
  );
  const pushToast = useToastStore((state) => state.pushToast);

  const pendingCount = pendingRequests.length;

  const handleSync = async () => {
    if (!pendingCount) return;
    setSyncing(true);

    try {
      const results = await Promise.all(
        pendingRequests.map(async (request) => {
          const response = await fetch(request.url, {
            method: request.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: request.data ? JSON.stringify(request.data) : undefined,
          });

          if (!response.ok) {
            throw new Error(`Sync failed: ${response.status}`);
          }

          removePendingRequest(request.id);
          return response;
        }),
      );

      if (results.length) {
        pushToast('Saved progress synced successfully.', 'success');
      }
    } catch {
      pushToast('Server still unavailable. Sync will retry later.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const showBanner = pendingCount > 0;
  const buttonLabel = isSyncing
    ? 'Syncing...'
    : `Sync ${pendingCount} item${pendingCount > 1 ? 's' : ''}`;

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,720px)] -translate-x-1/2 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-fg shadow-xl shadow-slate-950/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-primary">
            Saved locally while the server is unavailable.
          </p>
          <p>Further actions will not be saved until connection is restored.</p>
        </div>
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="rounded-full bg-primary px-5 py-2 text-white transition hover:bg-primary-mid disabled:cursor-not-allowed disabled:bg-primary/70"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
