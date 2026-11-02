import { useId, useState, type ChangeEvent } from 'react';

// Working weeks in a year, after holidays.
const WEKEN = 46;

/**
 * An optional calculation based on Martijn's own saving, not a promise about the reader's business.
 * The slider and number use the same value and range; all assumptions stay visible.
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
    <details className="pt-6 border-t border-slate-200 dark:border-slate-800">
      <summary className="cursor-pointer rounded-2xl py-2 font-medium text-slate-900 dark:text-white">
        Reken met mijn voorbeeld
      </summary>
      <div className="flex flex-col gap-4 pt-4">
        <p className="text-sm leading-relaxed text-subtle dark:text-slate-400">
          Bij mij scheelt het ongeveer {minuten} minuten per mail. Hieronder zie je wat die besparing bij een ander aantal mails zou betekenen. Wat het bij jou scheelt hangt af van je werk.
        </p>
        <label htmlFor={id} className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          Met hoeveel mails per week wil je rekenen?
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
            className="w-20 shrink-0 bg-transparent border border-slate-500 dark:border-slate-400 rounded-2xl px-3 py-2 font-display font-medium text-2xl tabular-nums text-slate-900 dark:text-white"
          />
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={mails}
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
              uur per jaar in dit rekenvoorbeeld.
            </span>
          </span>
        </output>
        <span className="text-xs font-semibold tracking-wide-xl uppercase text-subtle dark:text-slate-400">
          {minuten} minuten per mail × {mails} mails × {WEKEN} werkweken
        </span>
      </div>
    </details>
  );
}
