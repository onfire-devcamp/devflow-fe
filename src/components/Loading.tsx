export function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-card">
      <img
        src="/loading.gif"
        alt="Loading"
        className="w-40 h-40 object-contain"
      />
      <p className="mt-6 text-4xl font-medium text-primary flex items-baseline gap-0.5">
        <span>Loading</span>
        <span className="flex gap-0.5 ml-1">
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </span>
      </p>
    </div>
  );
}
