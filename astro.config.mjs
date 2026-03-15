import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://djmaster.academy',
  integrations: [
    starlight({
      title: 'DJMaster Academy',
      defaultLocale: 'he',
      disable404Route: true,
      locales: {
        he: { label: 'עברית', dir: 'rtl' },
        en: { label: 'English', dir: 'ltr' },
      },
      sidebar: [
        {
          label: 'קורסים',
          items: [
            { label: 'עולם הדי-ג\'יי', link: '/courses/world-of-dj/' },
            { label: 'ציוד DDJ-FLX4', link: '/courses/flx4-equipment/' },
            { label: 'Rekordbox', link: '/courses/rekordbox/' },
            { label: 'מבנה מוזיקלי', link: '/courses/music-structure/' },
            { label: 'ביטמאצ\'ינג ידני', link: '/courses/manual-beatmatching/' },
          ],
        },
        {
          label: 'כלים אינטראקטיביים',
          items: [
            { label: 'מחשבון BPM', link: '/tools/bpm-calculator/' },
            { label: 'גלגל הרמוני', link: '/tools/harmonic-wheel/' },
            { label: 'אימון EQ', link: '/tools/eq-trainer/' },
            { label: 'אימון Beatmatch', link: '/tools/beatmatch-trainer/' },
            { label: 'מתכנן סטים', link: '/tools/set-planner/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
});
