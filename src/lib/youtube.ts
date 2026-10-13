/** Saca el ID de un enlace de YouTube (watch?v=, youtu.be/, shorts/, embed/, live/). */
export function idYoutube(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    const partes = u.pathname.split('/');
    if (['shorts', 'embed', 'live'].includes(partes[1])) return partes[2] || null;
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}
