import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'JT-Lab & JT-Trader Документация',
  tagline: 'Документация по JavaScript торговым библиотекам',
  favicon: 'img/favicon.ico',

  // To match the URL structure on GitHub Pages
  deploymentBranch: 'main',
  trailingSlash: true,

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docsru.jt-lab.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For custom domain, baseUrl should be '/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dev-zone-xs', // Usually your GitHub org/user name.
  projectName: 'jt-lab-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },



  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dev-zone-xs/jt-lab-docs/tree/main/docs/',
          // Отключаем внешние плагины - используем встроенные возможности
          // remarkPlugins: [
          //   require('remark-images'),
          //   require('remark-gfm'),
          // ],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dev-zone-xs/jt-lab-docs/tree/main/blog/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          // Сортируем статьи по дате в убывающем порядке (новые сначала)
          sortPosts: 'descending',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'JT-Lab',
      logo: {
        alt: 'JT-Lib Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Документация',
        },
        {to: '/blog', label: 'Блог', position: 'left'},

        {
          href: 'https://github.com/jt-lab-com/jt-trader',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
            label: 'System Installation',
              to: '/docs/installation/',
            },
            {
              label: 'JT-Lib',
              to: '/docs/jt-lib/introduction-architecture',
            },
            {
              label: 'JT-Trader',
              to: '/docs/jt-trader/getting-started',
            },
            {
              label: 'Triggers',
              to: '/docs/jt-lib/triggers-system',
            },
          ],
        },
        {
          title: 'JT-Lab',
          items: [
            {
              label: 'Официальный сайт',
              href: 'https://jt-lab.com',
            },
            {
              label: 'JT-Trader GitHub',
              href: 'https://github.com/jt-lab-com/jt-trader',
            },
            {
              label: 'JT-Lib GitHub',
              href: 'https://github.com/jt-lab-com/jt-lib',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Docs',
              href: 'https://github.com/dev-zone-xs/jt-lab-docs',
            },

          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JT-Lib. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
