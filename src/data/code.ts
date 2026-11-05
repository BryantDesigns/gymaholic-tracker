/** The Gymaholic Code: house rules shown on the home and about pages. */
export interface Rule {
  rule: string;
  note: string;
  /** Shown in the short list on the home page. */
  featured?: boolean;
}

export const CODE: Rule[] = [
  { rule: 'Re-rack your weights.', note: 'Every plate, every time. Nobody wants to find your 45s on the leg press.', featured: true },
  { rule: 'Wipe the bench.', note: 'Leave the bench cleaner than you found it.', featured: true },
  { rule: 'Don’t curl in the squat rack.', note: 'Unless it’s 5:45 a.m. and the gym is empty. Then do what you want.' },
  { rule: 'Log your fuel.', note: 'Training is half the job. The other half is what you eat.', featured: true },
  { rule: 'Show up on Monday.', note: 'And Tuesday. Consistency beats intensity, every single time.', featured: true },
  { rule: 'Spot the new guy.', note: 'Everyone was new once. Help them out.' },
];
