import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const links = z.array(z.object({ plataforma: z.string(), url: z.string().url() }));

// Música y proyectos alternos comparten estructura
const ficha = ({ image }: { image: () => any }) => z.object({
  titulo: z.string(),
  orden: z.number().default(999), // 1 = primero
  anio: z.number(),
  portada: image(),
  links,
});

const albumes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/albumes' }),
  schema: ficha,
});

const alternos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/alternos' }),
  schema: ficha,
});

const produccion = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/produccion' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    artista: z.string(),
    anio: z.number(),
    portada: image(),
    roles: z.array(z.string()).default([]),
    descripcion: z.string().optional(),
    creditos: z.array(z.string()).default([]),
    links: links.default([]),
  }),
});

export const collections = { albumes, alternos, produccion };
