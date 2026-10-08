import { useState, type ReactNode } from 'react';
import { Play } from 'lucide-react';
import type { Project } from '../../lib/projects';
import { cn } from '../../lib/utils';
import { ProjectFilm } from './ProjectFilm';

const meta = 'text-xs font-semibold tracking-wide-xl uppercase text-slate-500 dark:text-slate-400';

/** The opdracht's image as a button that opens its film; the first scene loads as soon as the pointer or focus arrives. */
function FilmTrigger({ project, children }: { project: Project; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const preload = () => {
    if (project.film?.[0]) new Image().src = project.film[0].image;
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={preload}
        onFocus={preload}
        className="group relative block w-full text-left rounded-2xl"
      >
        <span className="block overflow-hidden rounded-2xl">{children}</span>
        <span className="absolute left-4 bottom-4 inline-flex items-center gap-3 rounded-full bg-kopwerk-dark/85 pl-2 pr-5 py-2 text-xs font-semibold tracking-wide-xl uppercase text-white shadow-xl shadow-kopwerk-dark/20 backdrop-blur-sm">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/15 transition-colors duration-500 ease-kopwerk group-hover:bg-amber-400 group-focus-visible:bg-amber-400">
            <Play aria-hidden="true" className="size-3.5 translate-x-px transition-colors duration-500 ease-kopwerk group-hover:text-slate-950 group-focus-visible:text-slate-950" />
          </span>
          Bekijk hoe het werkt
        </span>
      </button>
      <ProjectFilm project={project} open={open} onOpenChange={setOpen} />
    </>
  );
}

/** The opdracht's image, quote or number, if it has one. */
function ProjectMedia({ project }: { project: Project }) {
  const media = project.media;
  if (!media) return null;

  if (media.kind === 'beeld') {
    const image = (
      <img
        src={media.image}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'block w-full aspect-[4/3] object-cover rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900',
          project.film && 'transition-transform duration-500 ease-kopwerk group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
        )}
      />
    );
    return project.film ? <FilmTrigger project={project}>{image}</FilmTrigger> : image;
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
