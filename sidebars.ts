import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'example',
    {
      type: 'category',
      label: 'JT-Lib',
      items: [
        'jt-lib/getting-started',
        'jt-lib/base-script',
        'jt-lib/interfaces',
      ],
    },
    {
      type: 'category',
      label: 'JT-Trader',
      items: [
        'jt-trader/jt-trader-getting-started',
      ],
    },
  ],
};

export default sidebars;
