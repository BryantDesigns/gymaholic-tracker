/**
 * Submit a form to Netlify Forms. The matching static form definitions live in
 * index.html so Netlify can detect them at deploy time.
 */
export async function submitNetlifyForm(name: string, data: Record<string, string>): Promise<void> {
  const body = new URLSearchParams({ 'form-name': name, ...data }).toString();
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`);
}
