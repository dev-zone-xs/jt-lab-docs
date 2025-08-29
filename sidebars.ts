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
    'intro',
    'example',
    {
      type: 'category',
      label: 'JT-Lib',
      items: [
        'jt-lib/overview',
        'jt-lib/getting-started',
        'jt-lib/script-execution',
        'jt-lib/best-practice',
        'jt-lib/api-specification',
        'jt-lib/base-script',
        'jt-lib/interfaces',
        'jt-lib/trading-api',
        'jt-lib/market-api',
        'jt-lib/exchange',
        'jt-lib/event-emitter',
        'jt-lib/storage',
        {
          type: 'category',
          label: 'Triggers',
          items: ['jt-lib/triggers/order-trigger'],
        },
      ],
    },
    {
      type: 'category',
      label: 'JT-Trader',
      items: [
        'jt-trader/jt-trader-getting-started',
        'jt-trader/installation',
        'jt-trader/configuration',
        'jt-trader/usage',
        'jt-trader/runtime',
        'jt-trader/tester',
      ],
    },
  ],
};

export default sidebars;
