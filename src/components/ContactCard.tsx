import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ArrowUpRight } from 'lucide-react';
import { RollingText } from './ui/RollingText';
import { contactEmail, mailtoHref } from '../lib/contact';
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
  email?: string;
}

type CopyState = 'idle' | 'copied' | 'selected';

const copyLabels: Record<CopyState, string> = {
  idle: 'Kopieer het mailadres',
  copied: 'Gekopieerd naar het klembord',
  selected: 'Geselecteerd, kopieer met Ctrl+C of ⌘C',
};

export const ContactCard: React.FC<ContactCardProps> = ({
  isOpen,
  onClose,
  email = contactEmail,
}) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const emailRef = useRef<HTMLSpanElement>(null);
  const [emailLocal, emailDomain] = email.split('@');
  const copied = copyState === 'copied';

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
      await navigator.clipboard.writeText(email);
      showState('copied');
    } catch {
      selectEmail();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full sm:max-w-2xl md:max-w-3xl border-0 bg-white/95 dark:bg-kopwerk-dark/95 p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
        showCloseButton={true}
      >
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* One heading that answers the button that opened the card, and one line on what to write */}
        <DialogHeader className="mb-12 relative z-10 gap-4">
          <DialogTitle className="text-3xl sm:text-5xl md:text-6xl font-display font-normal tracking-wide-md leading-tight text-slate-900 dark:text-white" id="contact-heading">
            Vertel waar het knelt.
          </DialogTitle>
          <DialogDescription className="text-lg text-slate-600 dark:text-slate-300">
            Een paar zinnen is genoeg.
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 flex flex-col items-start gap-8">

          {/* Giant Interactive Email */}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label={copied ? 'Mailadres gekopieerd naar het klembord' : `Kopieer het mailadres ${email}`}
            className="group relative text-left flex flex-col w-full rounded-xl"
          >
            <span className={`text-xs font-semibold tracking-wide-xl uppercase mb-2 transition-colors duration-300 ease-kopwerk ${
              copyState === 'idle' ? 'text-slate-500 dark:text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              {copyLabels[copyState]}
            </span>
            <span className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300 ease-kopwerk group-hover:border-amber-500/50 gap-4">
              {/* <wbr> after the @ so narrow screens wrap there, never mid-word */}
              <span ref={emailRef} className="min-w-0 text-xl sm:text-2xl md:text-3xl font-light tracking-wide-sm text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                {emailLocal}@<wbr />{emailDomain}
              </span>
              <span className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ease-kopwerk shrink-0 ${
                copied
                  ? 'bg-amber-500 dark:bg-amber-400'
                  : 'bg-slate-50 dark:bg-slate-900 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10'
              }`}>
                {copied ? (
                  <Check className="w-5 h-5 text-slate-950" aria-hidden="true" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400" aria-hidden="true" />
                )}
              </span>
            </span>
            <span role="status" aria-live="polite" className="sr-only">
              {copyState === 'idle' ? '' : copyLabels[copyState]}
            </span>
          </button>

          {/* Mailto link */}
          <div className="w-full pt-4 flex flex-col items-start">
            <a
              href={mailtoHref(email)}
              className="group inline-flex items-center gap-3 text-lg font-medium text-slate-900 dark:text-white rounded-md"
            >
              <RollingText accentClassName="text-amber-700 dark:text-amber-400">
                Vertel het in een mail
              </RollingText>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-500 ease-kopwerk group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
