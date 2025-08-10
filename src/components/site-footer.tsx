import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-foreground/10">
      <div className="mx-auto max-w-[1100px] px-4 py-10 text-sm text-foreground/70">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="leading-relaxed">
            I write my own stuff. Sometimes it’s good, sometimes it’s… a war crime against grammar.
            ChatGPT cleans up the mess. Judge accordingly.
          </p>
          <nav className="flex flex-wrap gap-4 text-foreground/60">
            <a href="https://marcuyyy.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Blog
            </a>
            <a href="mailto:marc.dagatan@gmail.com" className="hover:text-foreground">
              Email
            </a>
            <a href="https://github.com/marcdagatan" target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a href="https://www.instagram.com/marc.uyyy/" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Instagram
            </a>
            <Link href="/rss.xml" className="hover:text-foreground">
              RSS
            </Link>
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-2 text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Marc Uy Dagatan. All rights reserved.</p>
          <p>
            Built with Next.js, MDX, and Vercel. Theme toggle, shiki highlighting, and minimal typography.
          </p>
        </div>
      </div>
    </footer>
  );
}


