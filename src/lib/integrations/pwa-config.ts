/**
 * PWA Configuration for Vite PWA Plugin
 * הגדרות PWA עבור פלוגין Vite PWA
 */

export interface VitePWAOptions {
  registerType: 'autoUpdate' | 'prompt';
  includeAssets: string[];
  manifest: {
    name: string;
    short_name: string;
    description: string;
    theme_color: string;
    background_color: string;
    display: string;
    scope: string;
    start_url: string;
    lang: string;
    dir: string;
    icons: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }>;
    screenshots?: Array<{
      src: string;
      sizes: string;
      type: string;
      form_factor: string;
    }>;
  };
  workbox: {
    globPatterns: string[];
    globIgnores: string[];
    runtimeCaching: Array<{
      urlPattern: string | RegExp;
      handler: string;
      options: {
        cacheName: string;
        expiration?: {
          maxEntries: number;
          maxAgeSeconds: number;
        };
        cacheableResponse?: {
          statuses: number[];
        };
      };
    }>;
  };
  devOptions: {
    enabled: boolean;
    navigateFallback: string;
    suppressWarnings: boolean;
  };
}

/**
 * VitePWA configuration for DJMaster Academy
 * הגדרת VitePWA עבור DJMaster Academy
 */
export const vitePWAConfig: VitePWAOptions = {
  registerType: 'autoUpdate',

  includeAssets: [
    'favicon.svg',
    'favicon.ico',
    'robots.txt',
    'manifest.json',
    'fonts/**/*.{ttf,woff,woff2}',
  ],

  manifest: {
    name: 'DJMaster Academy - קורס DJ מלא',
    short_name: 'DJMaster',
    description: 'פלטפורמת למידה מקיפה לדג׳יים - הקורס המלא שלך לשליטה בDJing',
    theme_color: '#6C63FF',
    background_color: '#0A0A0F',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    lang: 'he',
    dir: 'rtl',

    icons: [
      {
        src: '/pwa-icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/pwa-icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],

    screenshots: [
      {
        src: '/pwa-screenshots/screenshot-1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/pwa-screenshots/screenshot-2.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  },

  /**
   * Workbox caching strategies
   * אסטרטגיות cache עבור Workbox
   */
  workbox: {
    /**
     * Files to include in service worker cache
     */
    globPatterns: [
      '**/*.{js,css,html}',
      '**/*.{png,jpg,jpeg,svg,gif,webp}',
      '**/*.{woff,woff2,ttf,eot}',
      '/manifest.json',
    ],

    /**
     * Files to exclude from caching
     */
    globIgnores: [
      '**/node_modules/**/*',
      '**/.git/**/*',
      '**/build/**/*',
      '**/*.map',
    ],

    /**
     * Runtime caching strategies
     */
    runtimeCaching: [
      /**
       * Audio files - CacheFirst strategy
       * קבצי אודיו - אסטרטגיית CacheFirst
       */
      {
        urlPattern: /\.(?:mp3|wav|ogg|aac|flac)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'audio-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      /**
       * Image files - CacheFirst strategy
       * קבצי תמונה - אסטרטגיית CacheFirst
       */
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      /**
       * API requests - NetworkFirst strategy
       * בקשות API - אסטרטגיית NetworkFirst
       */
      {
        urlPattern: /^https:\/\/api\.djmaster\.local/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          networkTimeoutSeconds: 3,
        },
      },

      /**
       * HTML documents - NetworkFirst strategy
       * מסמכי HTML - אסטרטגיית NetworkFirst
       */
      {
        urlPattern: /\.html$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          networkTimeoutSeconds: 2,
        },
      },

      /**
       * External resources (fonts, CDN) - CacheFirst strategy
       * משאבים חיצוניים - אסטרטגיית CacheFirst
       */
      {
        urlPattern: /^https:\/\/(fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'external-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },

      /**
       * Course content - StaleWhileRevalidate strategy
       * תוכן קורסים - אסטרטגיית StaleWhileRevalidate
       */
      {
        urlPattern: /^https:\/\/api\.djmaster\.local\/courses/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'course-content-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
    ],
  },

  /**
   * Development options
   * אפשרויות פיתוח
   */
  devOptions: {
    enabled: false, // Set to true during development for testing
    navigateFallback: '/', // Fallback page for offline
    suppressWarnings: true,
  },
};

/**
 * Offline page content configuration
 * הגדרות עמוד offline
 */
export const offlinePageConfig = {
  path: '/offline.html',
  content: `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>אין חיבור לאינטרנט - DJMaster Academy</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: #0A0A0F;
            color: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }

          .offline-container {
            text-align: center;
            max-width: 500px;
          }

          .offline-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #6C63FF;
          }

          p {
            color: #B0B0B5;
            line-height: 1.6;
            margin-bottom: 30px;
          }

          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #6C63FF;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
            text-decoration: none;
          }

          .button:hover {
            background: #9F7AEA;
          }

          .offline-tips {
            margin-top: 40px;
            text-align: right;
            background: rgba(108, 99, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            border-right: 3px solid #6C63FF;
          }

          .offline-tips h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #6C63FF;
          }

          .offline-tips ul {
            list-style: none;
            text-align: right;
            color: #B0B0B5;
            font-size: 14px;
          }

          .offline-tips li {
            padding: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📡</div>
          <h1>אין חיבור לאינטרנט</h1>
          <p>נראה שאתה כעת לא מחובר לרשת. בדוק את החיבור שלך ונסה שוב.</p>
          <button class="button" onclick="window.location.reload()">
            רענן דף
          </button>

          <div class="offline-tips">
            <h3>טיפים:</h3>
            <ul>
              <li>✓ בדוק את חיבור ה-WiFi או ה-Cellular</li>
              <li>✓ נתונים מקומיים מכילים קורסים שנטענו קודם</li>
              <li>✓ כשתהיה מחובר, הכל יסתנכרן אוטומטית</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `,
};

/**
 * Service Worker update notification configuration
 * הגדרות התראות עדכון Service Worker
 */
export const swUpdateNotificationConfig = {
  title: 'עדכון זמין',
  message: 'גרסה חדשה של DJMaster Academy זמינה. האם תרצה להעדכן?',
  buttonText: 'עדכן עכשיו',
  cancelText: 'מאוחר יותר',
};

/**
 * Helper function to setup PWA update listener
 * פונקציית עזר להגדרת listener לעדכוני PWA
 */
export async function setupPWAUpdateListener(
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void
): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check for updates periodically
      setInterval(async () => {
        try {
          await registration.update();
        } catch (error) {
          console.error('Failed to update service worker:', error);
        }
      }, 60000); // Check every minute

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
        if (onUpdateAvailable && registration) {
          onUpdateAvailable(registration);
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}

export default {
  vitePWAConfig,
  offlinePageConfig,
  swUpdateNotificationConfig,
  setupPWAUpdateListener,
};
