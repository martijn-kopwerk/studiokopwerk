import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    // Opdrachten (src/content/werk/*/index.md): the fields at the top become `export const frontmatter`,
    // the text below becomes a component. Plain Markdown, so nothing in it can run code.
    {enforce: 'pre', ...mdx({format: 'md', remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]})},
    react({include: /\.(md|jsx|tsx)$/}),
    tailwindcss(),
  ],
  build: {
    // Never inline fonts as data: URIs; the CSP (font-src 'self') only allows same-origin font files.
    assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined),
  },
});
