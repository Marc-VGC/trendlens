import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill="#1d4ed8" />
            <path d="M6 19l5-6 4 3 7-8" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          TrendLens
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/explore" className="hover:text-slate-900">Explore</Link>
          <Link href="/example" className="hover:text-slate-900">Example</Link>
          <SignedIn>
            <Link href="/ask" className="hover:text-slate-900">Ask</Link>
            <Link href="/reports" className="hover:text-slate-900">My reports</Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">Sign in</button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
