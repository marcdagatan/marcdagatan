import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-foreground/10 bg-[color:var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/60">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-serif text-md md:text-lg tracking-[0.3rem]"
          >
            Marc Uy Dagatan
          </Link>
          {/* <nav className="hidden gap-4 text-sm md:flex">
            <Link href="/blog" className="text-foreground/80 hover:text-foreground">
              Blog
            </Link>
          </nav> */}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
