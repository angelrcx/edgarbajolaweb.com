import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const links = z.array(z.object({ plataforma: z.string(), url: z.string().url() }));

const albumes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/albumes' }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    anio: z.number(),
    portada: image(),
    descripcion: z.string().optional(),
    links,
  }),
});

// Esquema compartido por fotografía y arte gráfico (ambas son exposiciones)
const obra = (cats: [string, ...string[]]) => ({ image }: { image: () => any }) => z.object({
  categoria: z.enum(cats),
  titulo: z.string(),
  anio: z.number().optional(),
  imagen: image(),
  alt: z.string().optional(),
  descripcion: z.string().optional(),
  orden: z.number().default(0),
});

const fotografia = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/fotografia' }),
  schema: obra(['analoga', 'digital']),
});

const arteGrafico = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/arte-grafico' }),
  schema: obra(['dibujo', 'flyer', 'diseno']),
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

export const collections = { albumes, fotografia, 'arte-grafico': arteGrafico, produccion };
