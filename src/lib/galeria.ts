import type { ImageMetadata } from 'astro';

type Modulos = Record<string, { default: ImageMetadata }>;

/**
 * Convierte las imágenes de una carpeta (import.meta.glob) en la lista que usa <Exposicion>.
 * - Orden: por nombre de archivo, reconociendo números (foto-2 antes que foto-10).
 * - Si las imágenes están en subcarpetas, la subcarpeta es la categoría (filtro).
 *   `ordenCategorias` define en qué orden salen en "Todo".
 */
export function aObras(modulos: Modulos, ordenCategorias: string[] = []) {
  const lista = Object.entries(modulos).map(([ruta, m]) => {
    const partes = ruta.split('/');
    const archivo = partes[partes.length - 1];
    const carpeta = partes[partes.length - 2];
    const categoria = ordenCategorias.includes(carpeta) ? carpeta : undefined;
    return { id: ruta, archivo, categoria, data: { imagen: m.default, categoria } };
  });
  const pos = (c?: string) => (c ? ordenCategorias.indexOf(c) : -1);
  return lista.sort(
    (a, b) => pos(a.categoria) - pos(b.categoria) || a.archivo.localeCompare(b.archivo, undefined, { numeric: true })
  );
}
