import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const links = z.array(z.object({ plataforma: z.string(), url: z.string().url() }));

// Música, producción y proyectos alternos comparten estructura.
// Solo `titulo` y `portada` son obligatorios; todo lo demás es opcional.
const ficha = ({ image }: { image: () => any }) => z.object({
  titulo: z.string(),
  portada: image(),
  orden: z.number().default(999), // 1 = primero
  anio: z.number().optional(),
  artista: z.string().optional(),
  rol: z.string().optional(),     // lo que hizo Edgar (producción)
  links: links.default([]),
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
