import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";

function researchDirectoryIndexPlugin() {
  return {
    name: "research-directory-index",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (!request.url) {
          next();
          return;
        }

        const url = new URL(request.url, "http://localhost");
        if (url.pathname === "/research" || url.pathname === "/research/") {
          request.url = `/research/index.html${url.search}`;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  site: "https://gjchen.me",
  vite: {
    plugins: [researchDirectoryIndexPlugin()],
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ["github-light", "github-dark"],
    }),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypeCitation,
          {
            bibliography: "src/data/references.bib",
            path: ".",
            csl: "apa",
            linkCitations: true,
          },
        ],
      ],
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
