import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { idYoutube } from './lib/youtube';

const links = z.array(z.object({ plataforma: z.string(), url: z.string().url() }));

// Música, producción y proyectos alternos comparten estructura.
// Solo `titulo` y `portada` son obligatorios; todo lo demás es opcional.
const ficha = ({ image }: { image: () => any }) => z.object({
  titulo: z.string(),
  portada: image().optional(),    // si falta y hay `enlace` de YouTube, se usa la miniatura del video
  orden: z.number().default(999), // 1 = primero
  anio: z.number().optional(),
  artista: z.string().optional(),
  rol: z.string().optional(),     // lo que hizo Edgar (producción)
  enlace: z.string().url().optional(), // si existe, la portada lleva directo a este enlace (sin página de detalle)
  links: links.default([]),
}).refine((d) => d.portada || (d.enlace && idYoutube(d.enlace)), {
  message: 'Pon una `portada`, o un `enlace` de YouTube para usar su miniatura.',
});

const coleccion = (carpeta: string) =>
  defineCollection({
    loader: glob({ pattern: '*.md', base: `./src/content/${carpeta}` }),
    schema: ficha,
  });

const albumes = coleccion('albumes');
const alternos = coleccion('alternos');
const produccion = coleccion('produccion');

const videos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/videos' }),
  schema: z.object({
    titulo: z.string(),
    url: z.string().url(),          // enlace de YouTube
    artista: z.string().optional(),
    orden: z.number().default(999),
  }),
});

export const collections = { albumes, alternos, produccion, videos };
