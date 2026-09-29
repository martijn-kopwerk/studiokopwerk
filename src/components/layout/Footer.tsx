import { Typography } from '../ui/Typography';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center justify-center gap-2 shrink-0"
    >
      <Typography variant="small" className="font-semibold tracking-wide-xl uppercase">
        © {currentYear} Studio Kopwerk
      </Typography>
    </footer>
  );
}
