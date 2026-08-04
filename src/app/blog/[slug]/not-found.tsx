import Link from "next/link";

/**
 * Post-scoped 404: unknown slugs return here instead of crashing. Matches the
 * global not-found voice and always points back into the archive.
 */
export default function PostNotFound() {
  return (
    <main className="flex flex-col items-center py-24 text-center">
      <p aria-hidden="true" className="font-serif text-8xl font-bold leading-none text-foreground/[0.12]">
        404
      </p>
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        This round doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
        The bell never rang for this one. It may have been cut, renamed, or
        never written at all.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/blog"
          className="border border-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent hover:bg-accent/10"
        >
          The fight record
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
        >
          Front door →
        </Link>
      </div>
    </main>
  );
}
