import next from 'eslint-config-next';

/** Flat config — eslint-config-next 16 já exporta o array pronto. */
export default [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'assets/**', 'public/**', 'next-env.d.ts'],
  },
];
