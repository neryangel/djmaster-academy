/**
 * Storybook Preview Configuration
 * הגדרות preview של Storybook
 */

import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../../../styles/globals.css';

/**
 * RTL Decorator
 * דקורטור RTL עבור תצוגה מימין לשמאל
 */
const RTLDecorator = (Story: any) => {
  return (
    <div dir="rtl" style={{ direction: 'rtl' }}>
      <Story />
    </div>
  );
};

/**
 * Dark Theme Decorator
 * דקורטור תימה אפלה
 */
const DarkThemeDecorator = (Story: any) => {
  return (
    <div
      style={{
        backgroundColor: '#0A0A0F',
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Story />
    </div>
  );
};

/**
 * DJ Theme Provider Decorator
 * ספק תימת DJ
 */
const DJThemeDecorator = (Story: any) => {
  return (
    <div
      style={{
        '--dj-bg': '#0A0A0F',
        '--dj-surface': '#1A1A2E',
        '--dj-primary': '#6C63FF',
        '--dj-secondary': '#9F7AEA',
        '--dj-accent': '#FF006E',
        '--dj-text-primary': '#FFFFFF',
        '--dj-text-secondary': '#B0B0B5',
        '--dj-border': '#2D2D44',
      } as any}
    >
      <Story />
    </div>
  );
};

/**
 * Storybook Preview Configuration
 */
const preview: Preview = {
  parameters: {
    /**
     * Actions panel configuration
     */
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },

    /**
     * Viewport configuration
     * הגדרות viewport כולל RTL support
     */
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        mobile_he: {
          name: 'Mobile (Hebrew)',
          styles: {
            width: '375px',
            height: '667px',
          },
          type: 'mobile',
        },
        tablet_he: {
          name: 'Tablet (Hebrew)',
          styles: {
            width: '768px',
            height: '1024px',
          },
          type: 'tablet',
        },
      },
      defaultViewport: 'mobile_he',
    },

    /**
     * Layout configuration
     */
    layout: 'centered',

    /**
     * Backgrounds configuration
     * הגדרות רקעים
     */
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#0A0A0F',
        },
        {
          name: 'dj-surface',
          value: '#1A1A2E',
        },
      ],
    },

    /**
     * Internationalization configuration
     * הגדרות i18n
     */
    i18n: {
      locale: 'he',
      locales: {
        en: { title: 'English', right: '🇬🇧' },
        he: { title: 'עברית', right: '🇮🇱' },
      },
    },

    /**
     * Controls configuration
     */
    controls: {
      matchers: {
        color: /(background|Color)$/i,
        date: /Date$/,
      },
    },

    /**
     * Accessibility addon configuration
     */
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'valid-aria-role',
            enabled: true,
          },
        ],
      },
    },

    /**
     * Docs configuration
     */
    docs: {
      defaultName: 'Documentation',
      theme: undefined,
    },
  },

  /**
   * Global Decorators
   * דקורטורים גלובליים
   */
  decorators: [
    RTLDecorator,
    DarkThemeDecorator,
    DJThemeDecorator,
  ],

  /**
   * Global tags for filtering stories
   */
  tags: ['autodocs'],
};

/**
 * Export preview configuration
 */
export default preview;

/**
 * Configure story sorting
 * הגדרת סדר תצוגת stories
 */
export const storySort = (a: any, b: any) => {
  const order = ['Introduction', 'Components', 'Patterns', 'Pages'];

  const aStory = a.story;
  const bStory = b.story;

  const aIndex = order.indexOf(aStory.kind.split('/')[0]);
  const bIndex = order.indexOf(bStory.kind.split('/')[0]);

  if (aIndex !== bIndex) {
    return aIndex - bIndex;
  }

  return aStory.kind.localeCompare(bStory.kind);
};
