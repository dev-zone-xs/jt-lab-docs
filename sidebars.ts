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
    'installation',
    'quick-start',
    'example',
    {
      type: 'category',
      label: 'JT-Lib',
      items: [
        // Новая документация (в порядке нумерации)
        'jt-lib/script-launch',
        'jt-lib/script-best-practices',
        'jt-lib/introduction-architecture',
        'jt-lib/core-fundamentals',
        'jt-lib/events-system',
        'jt-lib/trading-scripts',
        'jt-lib/exchange-orders-basket',
        'jt-lib/triggers-system',
        'jt-lib/market-data-candles',
        'jt-lib/technical-indicators',
        'jt-lib/reporting-system',

      ],
    },
    {
      type: 'category',
      label: 'JT-Trader',
      items: [
        'jt-trader/010-getting-started',
        'jt-trader/020-runtime-overview',
        'jt-trader/030-tester-overview',
        'jt-trader/040-strategy-files-overview',
        'jt-trader/050-configuration',
        'jt-trader/060-global-native-functions',
      ],
    },
  ],
};

export default sidebars;
