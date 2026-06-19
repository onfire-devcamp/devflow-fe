import { Link } from 'react-router-dom';

export function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="w-full max-w-3xl rounded-[2rem] border border-primary-mid/20 bg-card p-10 shadow-lg shadow-slate-200/20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-black tracking-tight text-fg">
            Request Failed
          </h1>
          <p className="max-w-xl text-base leading-8 text-fg-muted">
            Please check your connection and try again.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-mid"
            >
              Retry
            </button>
            <Link
              to="/"
              className="text-sm font-medium text-primary transition hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
