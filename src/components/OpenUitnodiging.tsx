import { useEffect, useRef } from 'react';
import { ContactButton } from './ContactButton';

/** One detour becomes a shorter route. Static final state before JS and with reduced motion. */
function KortereRoute() {
  const svg = useRef<SVGSVGElement>(null);
  const omweg = useRef<SVGPathElement>(null);
  const kort = useRef<SVGPathElement>(null);
  const pen = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = svg.current;
    const lang = omweg.current;
    const direct = kort.current;
    const tip = pen.current;
    if (!el || !lang || !direct || !tip || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const langLengte = lang.getTotalLength();
    const kortLengte = direct.getTotalLength();
    let frame = 0;
    let start = 0;
    const teken = (nu: number) => {
      if (!start) start = nu;
      const tijd = nu - start;
      const eerste = Math.min(tijd / 3000, 1);
      const tweede = Math.min(Math.max((tijd - 3400) / 1400, 0), 1);
      lang.style.strokeDasharray = `${langLengte}`;
      lang.style.strokeDashoffset = `${langLengte * (1 - eerste)}`;
      lang.style.opacity = `${0.7 - tweede * 0.55}`;
      direct.style.strokeDasharray = `${kortLengte}`;
      direct.style.strokeDashoffset = `${kortLengte * (1 - tweede)}`;
      const punt = tweede > 0 ? direct.getPointAtLength(kortLengte * tweede) : lang.getPointAtLength(langLengte * eerste);
      tip.setAttribute('cx', `${punt.x}`);
      tip.setAttribute('cy', `${punt.y}`);
      if (tijd < 4800) frame = requestAnimationFrame(teken);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      frame = requestAnimationFrame(teken);
    });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 280 140" aria-hidden="true" className="w-full max-w-72">
      <path ref={omweg} d="M24 102 Q23 33 60 34 Q97 35 96 80 Q96 123 139 111 Q181 97 158 61 Q138 29 188 29 Q234 29 256 44" fill="none" strokeWidth="1.5" strokeLinecap="round" className="stroke-slate-500 dark:stroke-slate-400 opacity-15" />
      <path ref={kort} d="M24 102 Q133 81 256 44" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-slate-500 dark:stroke-slate-400" />
      <circle cx="24" cy="102" r="4" className="fill-slate-50 dark:fill-kopwerk-dark stroke-slate-500 dark:stroke-slate-400" />
      <circle ref={pen} cx="256" cy="44" r="5" className="fill-amber-500" />
    </svg>
  );
}

export function OpenUitnodiging() {
  return (
    <section aria-labelledby="iets-anders" className="w-full pt-3 flex flex-col items-start gap-4">
      <KortereRoute />
      <h3 id="iets-anders" className="font-display font-medium text-xl sm:text-2xl leading-snug tracking-heading text-slate-900 dark:text-white">
        Gaat er bij jou iets anders onnodig lastig?
      </h3>
      <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        Vertel me hoe het nu gaat. Ik denk met je mee over wat eenvoudiger, mooier of sneller kan.
      </p>
      <ContactButton />
    </section>
  );
}
