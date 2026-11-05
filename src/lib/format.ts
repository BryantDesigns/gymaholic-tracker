const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Format a price in cents as USD. */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
