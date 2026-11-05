import logoUrl from '../assets/gymaholic-logo.svg';

export function Logo({ className }: { className?: string }) {
  return <img className={className} src={logoUrl} alt="Gymaholic" width={596} height={76} />;
}
