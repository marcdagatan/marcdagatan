import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const linkClass = "text-foreground/60 hover:text-accent transition-colors duration-200";
  
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 py-10 text-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground leading-relaxed">
            I write my own stuff. Sometimes it's good, sometimes it's… a war crime against grammar.
            ChatGPT cleans up the mess. Judge accordingly.
          </p>
          <nav className="flex flex-wrap gap-4">
            <a href="https://marcuyyy.com" target="_blank" rel="noreferrer" className={linkClass}>
              Blog
            </a>
            <a href="mailto:marc.dagatan@gmail.com" className={linkClass}>
              Email
            </a>
            <a href="https://github.com/marcdagatan" target="_blank" rel="noreferrer" className={linkClass}>
              GitHub
            </a>
            <a href="https://www.instagram.com/marc.uyyy/" target="_blank" rel="noreferrer" className={linkClass}>
              Instagram
            </a>
            <Link href="/rss.xml" className={linkClass}>
              RSS
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Marc Uy Dagatan. All rights reserved.</p>
          <p>
            Built with Next.js, MDX, and Vercel. Theme toggle, shiki highlighting, and minimal typography.
          </p>
        </div>
      </div>
    </footer>
  );
}


