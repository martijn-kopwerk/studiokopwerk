import { useContact } from '../hooks/useContact';
import { CapsuleButton } from './ui/CapsuleButton';
import { MagneticWrapper } from './ui/MagneticWrapper';

/**
 * The one call to action, the same on every page: "Vertel waar het knelt", magnetic, opening the contact card.
 * It says beforehand that it opens a dialog. The card loads on first intent (hover or focus).
 */
export function ContactButton({ className }: { className?: string }) {
  const { openContact, preloadContact } = useContact();
  return (
    <MagneticWrapper className={className}>
      <CapsuleButton
        onClick={openContact}
        onPointerEnter={preloadContact}
        onFocus={preloadContact}
        aria-haspopup="dialog"
        className="w-auto"
      >
        Vertel waar het knelt
      </CapsuleButton>
    </MagneticWrapper>
  );
}
