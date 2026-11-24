import type { Project } from "./data";

const coverPalette: Record<string, { background: string; foreground: string; accent: string }> = {
  "aztec-temple": {
    background: "#17120b",
    foreground: "#f4e8c8",
    accent: "#b97837",
  },
  miro: {
    background: "#11171a",
    foreground: "#e8f1f1",
    accent: "#65b9b0",
  },
};

const projectImageUrl = (project: Project) => {
  if (!project.imageUrl) return null;
  if (/^https?:\/\//.test(project.imageUrl)) return project.imageUrl;
  return `${import.meta.env.BASE_URL}${project.imageUrl.replace(/^\/+/, "")}`;
};

export default function ProjectCover({ project, className = "" }: { project: Project; className?: string }) {
  const imageUrl = projectImageUrl(project);
  if (imageUrl) return <img src={imageUrl} alt="" className={className} />;

  const palette = coverPalette[project.id] ?? coverPalette.miro;
  return (
    <div
      aria-hidden="true"
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        color: palette.foreground,
        background: `radial-gradient(circle at 74% 22%, ${palette.accent}66 0, transparent 28%), linear-gradient(145deg, ${palette.background}, #050505)`,
      }}
    >
      <div className="absolute -bottom-[18%] left-[9%] h-[70%] w-[82%] rotate-[-7deg] rounded-[20%_20%_4%_4%] bg-black/28" />
      <div className="absolute inset-x-[14%] bottom-[22%] h-[12%] rounded-[4px]" style={{ background: palette.accent }} />
      <div className="absolute inset-x-[23%] bottom-[34%] h-[12%] rounded-[4px] bg-white/12" />
      <div className="absolute inset-x-[32%] bottom-[46%] h-[12%] rounded-[4px] bg-black/24" />
      <span className="absolute inset-x-6 bottom-6 z-10 max-w-[80%] text-[clamp(2rem,6vw,4.75rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
        {project.title}
      </span>
    </div>
  );
}
