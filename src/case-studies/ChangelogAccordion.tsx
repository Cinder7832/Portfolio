export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  body: string[];
};

export default function ChangelogAccordion({
  entries,
  openVersion,
  onToggle,
  idPrefix,
  description,
}: {
  entries: ChangelogEntry[];
  openVersion: string | null;
  onToggle: (version: string | null) => void;
  idPrefix: string;
  description: string;
}) {
  return (
    <section id="changelog" data-case-study-chapter className="scroll-mt-16 mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
      <div className="max-w-4xl">
        <h3 className="text-5xl font-semibold tracking-[-0.055em] md:text-8xl">Changelog</h3>
        <p className="mt-7 text-lg leading-8 text-white/60">{description}</p>
      </div>
      <div className="mt-16 divide-y divide-white/12 border-y border-white/12">
        {entries.map((entry) => {
          const isOpen = openVersion === entry.version;
          const panelId = `${idPrefix}-changelog-${entry.version.replaceAll(".", "-")}`;
          return (
            <article key={entry.version} className="py-6">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(isOpen ? null : entry.version)}
                className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-8 gap-y-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                <span className="text-2xl font-semibold">v{entry.version}</span>
                <span className="flex-1 text-lg text-white/70 md:text-right">{entry.title}</span>
                <span className="text-sm text-white/45">{entry.date}</span>
                <span aria-hidden="true" className={`text-2xl leading-none text-white/55 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
              </button>
              <div id={panelId} className={`case-study-changelog-panel ${isOpen ? "is-open" : ""}`}>
                <div className="min-h-0 overflow-hidden">
                  <div className="mt-7 grid max-w-4xl gap-2 border-l border-white/60 pl-5 text-[0.98rem] leading-7 text-white/64">
                    {entry.body.map((line, index) => line.endsWith(":")
                      ? <p key={`${entry.version}-${index}`} className="mt-3 font-semibold text-white first:mt-0">{line.slice(0, -1)}</p>
                      : <p key={`${entry.version}-${index}`} className="relative pl-5 before:absolute before:left-0 before:content-['•']">{line.startsWith("- ") ? line.slice(2) : line}</p>)}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
