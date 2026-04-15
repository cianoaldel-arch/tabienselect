import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center">
      <h2 className="text-xl font-semibold">Plate not found</h2>
      <p className="mt-2 text-sm text-slate-600">
        The plate you're looking for no longer exists.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded bg-brand px-4 py-2 text-sm text-white hover:bg-slate-800"
      >
        Back to listing
      </Link>
    </div>
  );
}
