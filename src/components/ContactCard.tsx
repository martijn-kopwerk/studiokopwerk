import React, { useState } from 'react';
import { Check, Copy, ArrowUpRight } from 'lucide-react';
import { Typography } from './ui/Typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ContactCardProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  isOpen,
  onClose,
  email = 'hallo@studiokopwerk.nl',
}) => {
  const [copied, setCopied] = useState(false);
  const mailtoHref = `mailto:Studio Kopwerk <${email}>?subject=${encodeURIComponent('Kennismaking Studio Kopwerk')}`;

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy email', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
        
        <DialogHeader className="mb-12 relative z-10">
          <Typography variant="eyebrow" className="mb-4 inline-block">
            Direct Contact
          </Typography>
          <DialogTitle className="text-3xl sm:text-5xl md:text-6xl font-display font-light tracking-tight text-slate-900 dark:text-white" id="contact-heading">
            Tijd voor actie.
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 flex flex-col items-start gap-8">
          
          {/* Giant Interactive Email */}
          <button 
            onClick={handleCopyEmail}
            aria-label={copied ? `E-mailadres ${email} gekopieerd` : `Kopieer e-mailadres ${email}`}
            className="group relative text-left flex flex-col outline-none w-full rounded-xl focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-8 focus-visible:ring-offset-white dark:focus-visible:ring-offset-kopwerk-dark"
          >
            <span
              className={`text-xs font-semibold tracking-wide-xl uppercase mb-2 transition-colors ${
                copied
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-amber-500'
              }`}
            >
              {copied ? 'Gekopieerd naar klembord!' : 'E-mailadres kopiëren'}
            </span>
            <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors group-hover:border-amber-500/50 gap-4">
              <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors break-all">
                {email}
              </span>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-colors shrink-0">
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                )}
              </div>
            </div>
          </button>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {copied ? 'E-mailadres gekopieerd naar klembord' : ''}
          </span>

          {/* Mailto link */}
          <div className="w-full pt-4">
            <a
              href={mailtoHref}
              className="group inline-flex items-center gap-3 text-lg font-medium text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors outline-none rounded-md focus-visible:ring-4 focus-visible:ring-amber-500/50 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-kopwerk-dark"
            >
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  Deel je plannen
                </span>
                <span className="inline-block absolute top-0 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-amber-600 dark:text-amber-400">
                  Deel je plannen
                </span>
              </span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
