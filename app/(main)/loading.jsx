export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2"><div className="h-80 animate-pulse rounded-xl bg-muted" /><div className="h-80 animate-pulse rounded-xl bg-muted" /></div>
    </div>
  );
}
