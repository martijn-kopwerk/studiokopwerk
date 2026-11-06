import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Project } from '../../lib/projects';
import { cn } from '../../lib/utils';
import { ErrorBoundary } from '../ErrorBoundary';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/button';
import { Stat } from '../ui/Stat';

// The film (and its dialog dependencies) is fetched on first intent, like the contact card: hover, focus or open.
const loadFilm = () => import('./ProjectFilm');
const ProjectFilm = lazy(() => loadFilm().then((m) => ({ default: m.ProjectFilm })));

const meta = 'text-sm font-medium text-subtle dark:text-slate-400';

/** The film's dialog, mounted on first open; the first scene loads as soon as the pointer or focus arrives. */
function useFilmDialog(project: Project) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const preload = () => {
    if (project.film?.[0]) new Image().src = project.film[0].image;
    // A failed preload is tried again when the film is opened.
    loadFilm().catch(() => {});
  };
  const show = () => {
    setMounted(true);
    setOpen(true);
  };
  // If the film can't load (offline, or a stale tab after a deploy), the click does nothing rather than break the page
  const dialog = mounted && (
    <ErrorBoundary onError={() => setMounted(false)}>
      <Suspense fallback={null}>
        <ProjectFilm project={project} open={open} onOpenChange={setOpen} />
      </Suspense>
    </ErrorBoundary>
  );
  return { preload, show, dialog };
}

/** The visible label that says the image opens a demonstration, also on phones. */
function FilmLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 rounded-lg bg-kopwerk-dark/85 p-2 pr-5 text-sm font-medium text-white',
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-white/15 transition-colors duration-500 ease-kopwerk group-hover:bg-amber-400 group-focus-visible:bg-amber-400">
        <Icon name="play" className="size-3.5 translate-x-px transition-colors duration-500 ease-kopwerk group-hover:text-slate-950 group-focus-visible:text-slate-950" />
      </span>
      Bekijk hoe het werkt
    </span>
  );
}

/**
 * The opdracht's image as a button that opens its film. On phones the label sits below the image, so it covers
 * none of it; from sm it floats in the image's top corner.
 */
function FilmTrigger({ project, children }: { project: Project; children: ReactNode }) {
  const { preload, show, dialog } = useFilmDialog(project);
  return (
    <>
      <button
        type="button"
        aria-label={`Bekijk hoe het werkt: ${project.title}`}
        onClick={show}
        onPointerEnter={preload}
        onFocus={preload}
        className="group relative flex flex-col items-start gap-3 w-full text-left rounded-2xl"
      >
        <span className="block w-full overflow-hidden rounded-2xl">{children}</span>
        <FilmLabel className="sm:absolute sm:right-4 sm:top-4" />
      </button>
      {dialog}
    </>
  );
}

const PHONE = '(max-width: 639px)';

/**
 * The film itself in the card (on /werk): always silent (the files carry no sound), playing only while it is on
 * screen, with a pause button. Upright on phones, wide from sm. Its poster is a frame from the film, so before it
 * plays, and for anyone who asked for less motion, the card shows the same picture. Below it, the button that opens
 * the film large with its scenes and captions.
 */
export function ProjectVideo({ project }: { project: Project & { video: NonNullable<Project['video']> } }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState(false);
  const { preload, show, dialog } = useFilmDialog(project);
  const shape = phone ? project.video.upright : project.video.wide;
  const alt = project.begin?.alt ?? (project.media?.kind === 'beeld' ? project.media.alt : project.title);

  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const watch = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    watch.observe(el);
    return () => watch.disconnect();
  }, [phone]);

  const plays = visible && !paused && !reduceMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    if (plays) el.play().catch(() => {});
    else el.pause();
  }, [plays, phone]);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-kopwerk-dark aspect-[4/5] sm:aspect-video">
        <video
          key={phone ? 'staand' : 'liggend'}
          ref={ref}
          poster={shape.poster}
          aria-label={`${alt} Een stil filmpje met verzonnen gegevens.`}
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="none"
          className="block size-full object-cover"
        >
          <source src={shape.webm} type="video/webm" />
          <source src={shape.mp4} type="video/mp4" />
        </video>
        {/* Hidden by CSS rather than by the hook, so the prerendered page and the browser agree */}
        <div className="dark absolute right-2 bottom-2 motion-reduce:hidden">
          <Button aria-label={paused ? 'Speel af' : 'Pauzeer'} onClick={() => setPaused(!paused)}>
            {paused ? <Icon name="play" className="size-5" /> : <Icon name="pause" className="size-5" />}
          </Button>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Bekijk hoe het werkt: ${project.title}`}
        onClick={show}
        onPointerEnter={preload}
        onFocus={preload}
        className="group rounded-full"
      >
        <FilmLabel />
      </button>
      {dialog}
    </div>
  );
}

/** The opdracht's image, quote or number, if it has one. */
export function ProjectMedia({ project, still }: { project: Project; still?: { image: string; alt: string } }) {
  const media = project.media;
  if (!media) return null;

  if (media.kind === 'beeld') {
    // `still`: another image in its place (Begin shows one scene of the film), still opening the film.
    const image = (
      <img
        src={still?.image ?? media.image}
        alt={still?.alt ?? media.alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'block w-full aspect-[4/3] object-cover rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900',
          project.film && 'transition-colors duration-150 ease-kopwerk group-hover:border-slate-400 dark:group-hover:border-slate-600'
        )}
      />
    );
    return project.film ? <FilmTrigger project={project}>{image}</FilmTrigger> : image;
  }

  if (media.kind === 'citaat') {
    return (
      <figure className="flex flex-col gap-4">
        <blockquote className="text-2xl font-normal leading-snug text-slate-600 dark:text-slate-300 text-pretty">
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
      <span className="font-display font-medium text-6xl xl:text-7xl leading-none tracking-heading text-slate-900 dark:text-white">
        {media.value}
      </span>
      <span className={meta}>{media.label}</span>
    </div>
  );
}

/** On /werk: the film playing in the card when the opdracht has one, otherwise its image, quote or number. */
export function ProjectShow({ project }: { project: Project }) {
  return project.video ? <ProjectVideo project={{ ...project, video: project.video }} /> : <ProjectMedia project={project} still={project.begin} />;
}

/**
 * What an opdracht says beyond its title: the image, quote or number, then its two or three sentences and its saving.
 * With a film, the card shows the scene marked `begin:` (one detail) rather than a whole screen.
 */
export function ProjectBody({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-6">
      <ProjectShow project={project} />
      <ProjectText project={project} />
      <ProjectStat project={project} className="mt-4" />
    </div>
  );
}

/** The saving the film gives, as a number above its sentence (a scene's `begin:` with `getal:`). */
export function ProjectStat({ project, className }: { project: Project; className?: string }) {
  const begin = project.begin;
  if (!begin?.figure) return null;
  return (
    <Stat value={begin.figure.value} unit={begin.figure.unit} className={className}>
      {begin.line}
    </Stat>
  );
}

/** The opdracht's two or three sentences. */
export function ProjectText({ project }: { project: Project }) {
  const { Text } = project;
  return (
    <div className="max-w-xl flex flex-col gap-3 text-base leading-relaxed text-slate-700 dark:text-slate-300 text-pretty [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold">
      <Text />
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
