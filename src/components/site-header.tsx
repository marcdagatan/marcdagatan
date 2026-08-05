import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/search";

/**
 * Quiet, sticky publication header: wordmark, About, CV, Archive, Search, theme.
 * The pages carry the drama; this stays minimal and functional.
 */
export function SiteHeader() {
  const navClass =
    "hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-150 hover:text-accent sm:inline-block";

  return (
    <header className="site-header sticky top-0 z-30 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="font-serif text-base font-bold tracking-[-0.01em] hover:text-accent sm:text-lg"
        >
          Marc Uy Dagatan
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-5">
          <Link href="/about" className={navClass}>
            About
          </Link>
          <Link href="/cv" className={navClass}>
            CV
          </Link>
          <Link href="/blog" className={navClass}>
            Archive
          </Link>
          <Search />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
