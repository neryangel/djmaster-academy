/**
 * Storybook Configuration
 * הגדרות Storybook עבור DJMaster Academy
 */

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },

  docs: {
    autodocs: 'tag',
  },

  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-vite',
  },

  /**
   * Custom Vite configuration for Storybook
   * הגדרת Vite מותאמת ל-Storybook
   */
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [react()],
      define: {
        __STORYBOOK__: true,
      },
      resolve: {
        alias: {
          '@': '/src',
        },
      },
      css: {
        postcss: './postcss.config.js',
      },
    });
  },

  /**
   * Environment variables for Storybook
   */
  env: (config) => {
    return {
      ...config,
      STORYBOOK_VITE_BUILD: process.env.STORYBOOK_VITE_BUILD || 'false',
    };
  },
};

export default config;
