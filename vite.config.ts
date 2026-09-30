import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    // Stories (src/content/werk/*/index.mdx): the YAML block at the top becomes `export const frontmatter`.
    {enforce: 'pre', ...mdx({remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]})},
    react({include: /\.(mdx|jsx|tsx)$/}),
    tailwindcss(),
  ],
  build: {
    // Never inline fonts as data: URIs; the CSP (font-src 'self') only allows same-origin font files.
    assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined),
  },
});
