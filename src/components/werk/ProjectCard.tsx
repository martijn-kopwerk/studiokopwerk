import type { Project } from '../../lib/projects';

const meta = 'text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400';

/** The opdracht's image, quote or number, if it has one. */
function ProjectMedia({ project }: { project: Project }) {
  const media = project.media;
  if (!media) return null;

  if (media.kind === 'beeld') {
    return (
      <img
        src={media.image}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className="block w-full aspect-[4/3] object-cover rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
      />
    );
  }

  if (media.kind === 'citaat') {
    return (
      <figure className="flex flex-col gap-4">
        <blockquote className="text-2xl font-light leading-snug tracking-wide-sm text-slate-600 dark:text-slate-300 text-pretty">
          “{media.quote}”
        </blockquote>
        <figcaption className={meta}>
          {media.name}
          {media.role && ` • ${media.role}`}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-display font-bold text-6xl xl:text-7xl leading-none tracking-wide-lg text-slate-900 dark:text-white">
        {media.value}
      </span>
      <span className={meta}>{media.label}</span>
    </div>
  );
}

/** What an opdracht says beyond its title: the image, quote or number, then its two or three sentences. */
export function ProjectBody({ project }: { project: Project }) {
  const { Text } = project;
  return (
    <div className="flex flex-col gap-6">
      <ProjectMedia project={project} />
      <div className="max-w-xl flex flex-col gap-3 text-base leading-relaxed text-slate-700 dark:text-slate-300 text-pretty [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold">
        <Text />
      </div>
    </div>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <span className={meta}>
      {project.client}
      {project.sector && ` • ${project.sector}`}
      {project.draft && ' • Concept'}
    </span>
  );
}
