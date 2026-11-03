import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './ui/Icon';
import { CapsuleButton } from './ui/CapsuleButton';
import { knelpunten } from './Knelpunten';
import { contactEmail, mailtoHref } from '../lib/contact';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ContactCardProps {
  isOpen: boolean;
  onClose: () => void;
}

type CopyState = 'idle' | 'copied' | 'selected';

const copyLabels: Record<CopyState, string> = {
  idle: 'Kopieer het mailadres',
  copied: 'Gekopieerd naar het klembord',
  selected: 'Geselecteerd, kopieer met Ctrl+C of ⌘C',
};

// The canonical frictions still supply the mail subject; choosing one is optional.
const ANDERS = 'Iets anders';
const keuzes = [...knelpunten.map(({ knelt }) => knelt), ANDERS];
const labels = [...knelpunten.map(({ label, knelt }) => label ?? knelt), ANDERS];

/**
 * What "Vertel waar het knelt" opens (design system: ContactCard): the first conversation, not another copy of the
 * address the page already shows. The frictions are choices; a choice sets the subject of the mail ("Waar het knelt:
 * …"). The mail action comes first, with optional help below it. No form. Escape closes and focus returns to the trigger.
 */
export const ContactCard: React.FC<ContactCardProps> = ({ isOpen, onClose }) => {
  const [gekozen, setGekozen] = useState<number | null>(null);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const emailRef = useRef<HTMLSpanElement>(null);
  const mailRef = useRef<HTMLAnchorElement>(null);
  const voorbeeldenRef = useRef<HTMLDetailsElement>(null);
  const copied = copyState === 'copied';
  const knelt = gekozen !== null && keuzes[gekozen] !== ANDERS ? keuzes[gekozen] : undefined;

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const showState = (state: CopyState) => {
    setCopyState(state);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2500);
  };

  // Fallback when the Clipboard API is unavailable or refused: select the address so it can be copied by hand.
  const selectEmail = () => {
    const selection = window.getSelection();
    if (emailRef.current && selection) {
      selection.selectAllChildren(emailRef.current);
      showState('selected');
    }
  };

  const handleCopyEmail = async () => {
    if (!navigator.clipboard) {
      selectEmail();
      return;
    }
    try {
      await navigator.clipboard.writeText(contactEmail);
      showState('copied');
    } catch {
      selectEmail();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        initialFocus={mailRef}
        className="w-full sm:max-w-2xl md:max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden border-0 bg-white/95 dark:bg-kopwerk-dark/95 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-slate-900 dark:text-slate-100"
        showCloseButton={true}
      >
        <div aria-hidden="true" className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* One heading that answers the button that opened the card, and one line on what to do */}
        <DialogHeader className="relative z-10 gap-3 pr-5">
          <DialogTitle className="text-3xl sm:text-5xl font-display font-medium tracking-heading leading-tight text-slate-900 dark:text-white" id="contact-heading">
            Vertel waar het knelt.
          </DialogTitle>
          <DialogDescription className="text-lg text-slate-600 dark:text-slate-300">
            Vertel kort wat je doet en wat je tijd kost. Je hoeft nog geen oplossing te weten.
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 flex flex-col items-start gap-6">
          <div className="flex flex-col items-start gap-3">
            <CapsuleButton ref={mailRef} href={mailtoHref(knelt)} className="w-auto">
              Vertel het in een mail
            </CapsuleButton>
            <p className="text-sm text-subtle dark:text-slate-400">
              Het eerste gesprek is vrijblijvend. Een proefversie kost vanaf €&nbsp;500 exclusief btw. Je hoort binnen twee werkdagen van me.
            </p>
            {gekozen !== null && <p aria-live="polite" className="text-sm text-subtle dark:text-slate-400">Over: {labels[gekozen]}</p>}
          </div>

          {/* The address stays above the optional choices, including for people who use webmail. */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span ref={emailRef} className="text-base tracking-wide-sm text-slate-800 dark:text-slate-200">
              {contactEmail}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-500 dark:border-slate-400 px-3 py-2 text-xs font-semibold tracking-wide-xl uppercase text-slate-900 dark:text-white transition-colors duration-300 ease-kopwerk hover:border-amber-600 dark:hover:border-amber-400 motion-reduce:transition-none"
            >
              <Icon name={copied ? 'check' : 'copy'} className="size-4" />
              {copyLabels[copyState]}
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {copyState === 'idle' ? '' : copyLabels[copyState]}
            </span>
            <p className="text-sm text-subtle dark:text-slate-400">Opent je mail niet? Kopieer het mailadres.</p>
          </div>

          <details ref={voorbeeldenRef} className="w-full border-t border-slate-200 dark:border-slate-800 pt-4">
            <summary className="cursor-pointer rounded-2xl py-2 text-base font-medium text-slate-900 dark:text-white">
              Kies een voorbeeld als hulp
            </summary>
            <p className="mt-2 mb-4 text-sm text-subtle dark:text-slate-400">Kiezen hoeft niet. Een keuze vult alleen het onderwerp van je mail in.</p>
            <ul aria-label="Waar knelt het?" className="flex flex-col gap-2">
              {keuzes.map((keuze, index) => {
                const aan = gekozen === index;
                return (
                  <li key={keuze}>
                    <button
                      type="button"
                      aria-pressed={aan}
                      onClick={() => {
                        setGekozen(aan ? null : index);
                        if (voorbeeldenRef.current) voorbeeldenRef.current.open = false;
                        mailRef.current?.focus();
                      }}
                      className={cn(
                        'w-full rounded-2xl border px-4 py-3 text-left text-sm leading-snug tracking-wide-sm text-pretty transition-[border-color,color,box-shadow] duration-300 ease-kopwerk motion-reduce:transition-none',
                        aan
                          ? 'border-amber-500 text-slate-900 dark:text-white shadow-[inset_0_0_0_1px_rgb(245_158_11)]'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white'
                      )}
                    >
                      {labels[index]}
                    </button>
                  </li>
                );
              })}
            </ul>

            <p aria-live="polite" className="mt-4 text-sm text-subtle dark:text-slate-400">
              Onderwerp: {knelt ? `Waar het knelt: ${knelt.replace(/\.$/, '')}` : 'Waar het knelt'}
            </p>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
};
