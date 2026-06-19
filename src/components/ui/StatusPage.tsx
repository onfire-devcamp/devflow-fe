import { Link } from 'react-router-dom';

type StatusPageProps = {
  title: string;
  message: string;
  details?: string;
  actionLabel?: string;
  actionLink?: string;
};

export function StatusPage({
  title,
  message,
  details,
  actionLabel = 'Go to Dashboard',
  actionLink = '/dashboard',
}: StatusPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <div className="text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-primary">
            Oops!
          </p>
          <h1 className="text-6xl font-black text-slate-900">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {message}
          </p>
          {details ? (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
              {details}
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-mid"
          >
            {actionLabel}
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-primary transition hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
