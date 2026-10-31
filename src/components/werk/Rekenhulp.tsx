import { useId, useState, type ChangeEvent } from 'react';

// Working weeks in a year, after holidays.
const WEKEN = 46;

/** What the hours come down to, in days or weeks you get back. */
function vertaling(uren: number) {
  const weken = uren / 40;
  if (weken >= 1.5) return `Dat zijn ruim ${Math.floor(weken)} werkweken die je aan je vak kunt besteden.`;
  if (weken >= 0.75) return 'Dat is bijna een hele werkweek.';
  const dagen = Math.max(1, Math.round(uren / 8));
  return dagen === 1 ? 'Dat is een werkdag die je terugkrijgt.' : `Dat zijn ${dagen} werkdagen die je terugkrijgt.`;
}

/**
 * The saving made personal: the reader fills in how many mails they answer a week and sees the hours a year that
 * the opdracht's minutes per mail come to. One field, no form; the slider and the number are the same value.
 * Before the script runs it shows the answer for 40 mails.
 */
export function Rekenhulp({ minuten }: { minuten: number }) {
  const [mails, setMails] = useState(40);
  const id = useId();
  const uren = Math.round((mails * minuten * WEKEN) / 60);

  const zet = (e: ChangeEvent<HTMLInputElement>) => {
    const waarde = Number.parseInt(e.target.value, 10);
    setMails(Number.isNaN(waarde) ? 1 : Math.min(500, Math.max(1, waarde)));
  };

  return (
    <div className="flex flex-col gap-4 pt-7 border-t border-slate-200 dark:border-slate-800">
      <label htmlFor={id} className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
        En bij jou? Hoeveel mails beantwoord je per week?
      </label>
      <div className="flex items-center gap-5">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={500}
          value={mails}
          onChange={zet}
          className="w-20 shrink-0 bg-transparent border-0 border-b border-slate-500 dark:border-slate-400 rounded-none py-1 font-display font-medium text-2xl tabular-nums text-slate-900 dark:text-white"
        />
        <input
          type="range"
          min={5}
          max={200}
          step={5}
          value={Math.min(200, Math.max(5, mails))}
          onChange={zet}
          aria-label="Mails per week"
          className="flex-1 min-w-0 accent-amber-500"
        />
      </div>
      <output htmlFor={id} aria-live="polite" className="flex flex-col gap-2">
        <span className="flex items-baseline gap-3">
          <span className="font-display font-medium text-5xl sm:text-6xl leading-none tracking-display tabular-nums text-slate-900 dark:text-white">
            {uren}
          </span>
          <span className="text-lg sm:text-xl font-light tracking-wide-sm text-slate-700 dark:text-slate-300">
            uur per jaar die je terug kunt krijgen.
          </span>
        </span>
        <span className="text-base text-slate-600 dark:text-slate-300 text-pretty">{vertaling(uren)}</span>
      </output>
      <span className="text-xs font-semibold tracking-wide-xl uppercase text-subtle dark:text-slate-400">
        Gerekend met {WEKEN} werkweken
      </span>
    </div>
  );
}
