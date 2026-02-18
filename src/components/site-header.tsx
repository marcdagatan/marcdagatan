import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/search";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-serif text-md md:text-lg tracking-[0.2em] hover:text-accent transition-colors duration-200"
          >
            Marc Uy Dagatan
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Search />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
