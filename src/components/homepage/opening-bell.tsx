/**
 * Opening Bell: the homepage hero. A specific editorial composition, not a
 * reusable SaaS hero: staged Playfair line breaks, one crimson word, a
 * direct positioning line, and a short intro that names Marc in one breath.
 */

export function OpeningBell() {
  return (
    <section className="border-b border-border pb-14 pt-4 lg:pb-20">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-muted-foreground">
        The Fight Journal · Est. 2025
      </p>

      <h1 className="mt-8 font-serif text-[3.25rem] font-bold leading-[0.95] tracking-[-0.015em] sm:text-7xl lg:text-8xl">
        Thoughts of a
        <br />
        <span className="text-accent">Mastermind</span>
        <br />
        in Pajamas
      </h1>

      <p className="mt-8 max-w-[30ch] font-serif text-xl italic leading-snug text-foreground/90 sm:text-2xl lg:text-[1.75rem]">
        Systems, scars, and selfhood: written from the corner, not the
        commentary booth.
      </p>

      <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
        Essays on governed AI, building teams, and the lessons that only become
        clear after the bell. I&apos;m Marc, founder of MAD Software, fighter,
        actor, and dad, and this is where the three lanes of that life meet.
      </p>
    </section>
  );
}
