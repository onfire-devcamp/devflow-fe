import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-4">
      <div className="max-w-2xl rounded-3xl border border-primary-mid/30 bg-card p-10 shadow-xl shadow-slate-200/30">
        <div className="text-center">
          <p className="text-7xl font-black text-primary">404</p>
          <h1 className="mt-4 text-3xl font-semibold text-fg">
            Page Not Found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-fg-muted">
            We couldn’t find the page you’re looking for. It may have been
            removed or the URL may be incorrect.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-[1.25rem] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-mid"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
