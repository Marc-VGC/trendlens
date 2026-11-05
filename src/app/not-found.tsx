import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg text-center">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="mt-2 text-slate-600">This report doesn&apos;t exist or was deleted by its owner.</p>
      <div className="mt-5 flex justify-center gap-3">
        <Link href="/example" className="btn-primary">See an example report</Link>
        <Link href="/" className="btn-secondary">Home</Link>
      </div>
    </div>
  );
}
